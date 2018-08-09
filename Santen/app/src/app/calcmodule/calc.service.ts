import { Injectable, EventEmitter } from '@angular/core';
import { DataAdaptorService } from '../dataadaptor/data-adaptor.service';
import { IStorage } from '../dataadaptor/istorage';
import { CalcApi } from './calcapi';
import { FileSaver } from '../utils';
import * as Collections from 'typescript-collections';
import 'rxjs/add/operator/toPromise';
import '../../libs/jsCalc/jsCalc';

declare var jsCalc: any;

@Injectable()
export class CalcService {
    private api: CalcApi = null;
    private isInitialized = false;
    private isBeingInitialized = false;
    private modelName = './../../app/model/WiB-require';
    private courseActionsName = './../../app/model/TRCourseActions';
    private courseActions: any;
    private model: any;
    private modelLoadingPromise: Promise<any>;
    private modelChangeEvent: EventEmitter<any> = null;
    private localStorageKey: string = "modelstate:SantenBA2";
    private stateUrl: string;
    private progressCallBacks: Array<Function> = [];
    private emitter:EventEmitter<any> = new EventEmitter(true);
    private emitterObserver:any;
    private settingValue:boolean = false;
    private setDataQueue: Array<any> = [];
    private nextAnimationFrame:any;

    constructor(private dataAdaptorService: DataAdaptorService, private fileSaver: FileSaver) { }

    isApiReady(): boolean {
        return (this.api) ? true : false;
    }

    setStateUrl(url: string) {
        this.stateUrl = url;
    }

    getStateUrl(): string {
        return this.stateUrl;
    }

    getApi(loadingProgressCb:Function = null) : Promise<this> {
        if (loadingProgressCb) {
            this.progressCallBacks.push(loadingProgressCb);
        }
        if (this.api) {
            return Promise.resolve(this);
        }
        else {
            if (this.modelLoadingPromise === undefined) {
                return this.modelLoadingPromise = this.initialize(this.modelName, this.courseActionsName, loadingProgressCb);
            }
            else {
                return this.modelLoadingPromise;
            }
        }
    }

    getObservable(): EventEmitter<any> {
        return this.modelChangeEvent;
    }

    initialize(model: string, customActions: string, loadingProgressCb:Function = null): Promise<this> {
        //this.initialize(model, customActions);
        var self = this;
        self.modelChangeEvent = new EventEmitter(); // async event emitter
        self.emitterObserver = self.emitter.auditTime(300).subscribe((event) => {
            // model change event triggered - so send event to subscribers
            self.modelChangeEvent.emit();
            self.settingValue = false;
            // console.log("Send Model change trigger -");
        });
        // this.nextAnimationFrame = window.requestAnimationFrame(() => {
        //     this.processSetDataQueue();
        // });
        // return Promise.resolve(this);
        return self.loadModelData();
    }

    getValue(rangeRef: string, rawValue?:boolean): any {
        return this.api.getValue(rangeRef, rawValue);
    }

    getValueForYear(rangeRef: string, yearRef: string, rawValue?:boolean, logRangeRef?: boolean): any {
        /* If year is specified - append range name with _R + YearNo */
        if (yearRef) {
            let year = this.getValue(yearRef, rawValue);
            // if year == 1 do not append anything to ref
            if (year /* && year !== "1" */) {
                rangeRef += "_R" + year;
            }
        }
        if (logRangeRef) {
            console.log(rangeRef, this.getValue(rangeRef, rawValue));
        }

        return this.getValue(rangeRef, rawValue);
    }

    setValueForYear(rangeRef: string, value: any, yearRef: string) {
        /* If year is specified - append range name with _R + YearNo */
        if (yearRef) {
            let year = this.getValue(yearRef);
            // if year == 1 do not append anything to ref
            if (year /* && year !== "1" */) {
                rangeRef += "_R" + year;
            }
        }

        return this.setValue(rangeRef, value);
    }

    setValue(rangeRef: string, value: any): Promise<any> {
        // let _now = window.performance.now();

        let self = this;
        return self.api.setValue(rangeRef, value)
            .then(() => {
            // let timeLapsed = window.performance.now() - _now;

            self.saveStateToStorage();
            self.emitter.emit();
            // console.log("Model updated ", timeLapsed);
        });
        // this.setDataQueue.push({ ref: rangeRef, value: value});
        // return Promise.resolve();
    }

    saveProjectState(projectIdentifier: string):Promise<any> {
        if (!projectIdentifier) {
            return Promise.reject("Project Identifier cannot be null or empty!");
        }
        let currentProjectState = this.api.getJSONState(),
            projectStorageKey = this.localStorageKey + ":" + projectIdentifier;

        return this.dataAdaptorService.setValue(projectStorageKey, currentProjectState);
    }

    deleteProjectState(projectIdentifier: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!projectIdentifier) {
                reject("Project Identifier cannot be null or empty");
                return;
            }
            let projectStorageKey = this.localStorageKey + ":" + projectIdentifier;
            return this.dataAdaptorService.clear(projectStorageKey).then(resolve, reject);
        });
    }

    loadProjectState(projectIdentifier: string): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!projectIdentifier) {
                new Error("Project Identifier cannot be null or empty!");
                return;
            }
            let projectStorageKey = this.localStorageKey + ":" + projectIdentifier;
            this.dataAdaptorService.getValue(projectStorageKey).then((modelState) => {
                modelState = (modelState) ? modelState : "{}";
                this.resetModelState(modelState).then(() => {
                    this.emitter.emit();
                    resolve();
                });
            })
        })
    }

    resetModelState(modelData?:string) {
        // rebuild entire model with new data
        return this.loadModelData(modelData);
    }

    buildModel():Promise<CalcApi> {
        let self = this;
        return new Promise((resolve, reject) => {
            var _model = require('./../../app/model/index');
            this.model = _model.model;
            this.courseActions = _model.customActions;
            this.modelName = _model.modelName || this.modelName;
                    // initialize model -
                    new jsCalc({
                        model: this.model,
                        customActions: this.courseActions,
                        loadCallback: function() {
                            let calcApi = new CalcApi(this);
                            resolve(calcApi);
                        },
                        buildProgressCallback: function(progOb) {
                            if (self.progressCallBacks.length) {
                                self.progressCallBacks.forEach((cb) => {
                                    cb(progOb);
                                });
                            }
                        }
                    });
                // });
        });
    }

    loadModelData(modelData?:string): Promise<this> {
        let stateObPromise = (!modelData) ? this.getStateFromStorage() : Promise.resolve(modelData),
            self = this;
        return new Promise((resolve, reject) => {
            Promise.all([this.buildModel(), stateObPromise]).then((modules) => {
                this.api = modules[0];
                let modelState = modules[1];
                this.api.appendDataToModel(modelState).then(() => {
                    this.saveStateToStorage();
                    resolve(this);
                });
            });
        });
    }

    getModelDefaults(arrRefs:Array<string>): Promise<Collections.Dictionary<string, string>> {
        return new Promise((resolve, reject) => {
            let dictionary = new Collections.Dictionary<string, string>();
            this.buildModel().then((calcApi: CalcApi) => {
                // calcApi.getValue()
                arrRefs.forEach((ref, refIndex) => {
                    let defaultVal = calcApi.getValue(ref, true);
                    dictionary.setValue(ref, defaultVal);
                });
                resolve(dictionary);
            });
        })
    }

    resetRefstoDefault(arrRefs:Array<string>): Promise<any> {
        return new Promise((resolve, reject) => {
            this.buildModel().then((calcApi: CalcApi) => {
                // calcApi.getValue()
                arrRefs.forEach((ref, refIndex) => {
                    let defaultVal = calcApi.getValue(ref, true);
                    this.setValue(ref, defaultVal);
                })
                resolve();
            });
        })
    }

    // processSetDataQueue() {
    //     if (this.setDataQueue.length && !this.settingValue) {
    //         var nextSetValue = this.setDataQueue[0];
    //         this.setDataQueue.splice(0,1);
    //         this.settingValue = true;
    //         this.api.setValue(nextSetValue.ref, nextSetValue.value).then(() => {
    //             this.saveStateToStorage();
    //             this.modelChangeEvent.emit();
    //             this.settingValue = false;
    //         })
    //         console.log("Setting data for " + nextSetValue.ref);
    //     }

    //     this.nextAnimationFrame = window.requestAnimationFrame(() => {
    //         this.processSetDataQueue();
    //     });
    // }

    forceRecalculate() {
        // this.api.getBook().recalculate();
        // let startTime = window.performance.now();
        // this.api.addCalculationCallback(function() {
        //     let endTime = window.performance.now();
        //     console.log(" model recalculated successfully! : start time: " + startTime + " - endTime" + endTime);

        // });
    }

    saveStateToStorage():void {
        this.dataAdaptorService.setValue(this.localStorageKey, this.api.getJSONState());
    }

    private getStateFromStorage():Promise<any> {
        return this.dataAdaptorService.getValue(this.localStorageKey);
    }


    exportData() {
        this.exportDecisions();
    }


    private exportDecisions() {
        let self = this;
        // if sales or eng FTE < 0 show warning message
        // if (isFteNegative(calcApi)) {
        //     var modalInstance = self.$uibModal.open({
        //         animation: true,
        //         templateUrl: 'app/dashboard/negativeFteWarning.html',
        //         controller: function($scope, $uibModalInstance) {
        //             $scope.dismiss = function() {
        //                 $uibModalInstance.close();
        //             }
        //         },
        //         size: 'lg'
        //     });
        // }
        var modelState = this.getAllInputsState();
        var teamNo = this.getValue("tlInputTeamNumber");
        var teamYear = this.getValue("tlInputTeamYear");
        var fileNamePrefix = "SantenBA2";
        var fileName = fileNamePrefix + teamNo + "Y" + teamYear + ".csv";
        var delim = ',';
        self.fileSaver.fileSaveAs(fileName, modelState, delim);
    }

    private getAllInputsState(isExport?:any) {
        var pattern = new RegExp('^tlInput.+$'),
            rangeNames = this.api.getNames(pattern),
            THOUSAND = 1000,
            out = {};

        rangeNames.forEach(name => {
            try {
                var val = this.getValue(name, true);
                out[name] = val;
            }
            catch (e) {
                //console.log("Cannot get value for : " + name);
                // cannot get value for cell - so process next cell
            }
        });
        return out;
    }
}
