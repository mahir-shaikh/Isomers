import { Injectable, EventEmitter } from '@angular/core';
import { DataAdaptorService } from '../dataadaptor/data-adaptor.service';
import { IStorage } from '../dataadaptor/istorage';
import { CalcApi } from './calcapi';
import { FileSaver } from '../utils/utils';
import 'rxjs/add/operator/toPromise';
import '../../libs/jsCalc/jsCalc';

declare var jsCalc: any;

@Injectable()
export class CalcService {
    api: CalcApi = null;
    private isInitialized = false;
    private isBeingInitialized = false;
    private modelName = './../../app/model/WiB-require';
    private courseActionsName = './../../app/model/TRCourseActions';
    private courseActions: any;
    private model: any;
    private modelLoadingPromise: Promise<any>;
    private modelChangeEvent: EventEmitter<any> = null;
    private localStorageKey: string = "modelstate:WiB-require";
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
        var self = this,
            stateObPromise = this.getStateFromStorage();
        self.modelChangeEvent = new EventEmitter(); // async event emitter
        // self.emitterObserver = self.emitter.debounceTime(CALC_UPDATE_DEBOUNCE).subscribe((event) => {
        //     // model change event triggered - so send event to subscribers
        //     self.modelChangeEvent.emit();
        //     self.settingValue = false;
        //     console.log("Send Model change trigger -");
        // });
        this.nextAnimationFrame = window.requestAnimationFrame(() => {
            this.processSetDataQueue();
        });
        // return Promise.resolve(this);
        return new Promise((resolve, reject) => {
            var _model = require('./../../app/model/index');
            self.model = _model.model;
            self.courseActions = _model.customActions;
            Promise.all([stateObPromise])
                .then((modules) => {
                    let stateOb = modules[0];
                    // comment the line below when you want to restore data
                    // stateOb = null;
                    // initialize model -
                    new jsCalc({
                        model: self.model,
                        customActions: self.courseActions,
                        loadCallback: function() {
                            // calc model is loaded and now ready to use so return its instance and resolve promise
                            // resolve(this);
                            self.api = new CalcApi(this);
                            if (stateOb !== null) {
                                // found model data in local storage so load the data into the model -
                                self.api.appendDataToModel(stateOb).then(() => {
                                    self.saveStateToStorage();
                                    // self.exportData();
                                    resolve(self);
                                })
                            }
                            else {
                                resolve(self);
                            }
                        },
                        buildProgressCallback: function(progOb) {
                            // if (loadingProgressCb) {
                            //     loadingProgressCb(progOb);
                            // }
                            if (self.progressCallBacks.length) {
                                self.progressCallBacks.forEach((cb) => {
                                    cb(progOb);
                                });
                            }
                        }
                    });
                });
        });
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

        this.setDataQueue.push({ ref: rangeRef, value: value});
            // return self.api.setValue(rangeRef, value)
            //     .then(() => {
            //     self.saveStateToStorage();
            //     self.emitter.emit();
            //     console.log("Model updated");
            // });
        return Promise.resolve();
    }

    processSetDataQueue() {
        if (this.setDataQueue.length && !this.settingValue) {
            var nextSetValue = this.setDataQueue[0];
            this.setDataQueue.splice(0,1);
            this.settingValue = true;
            this.api.setValue(nextSetValue.ref, nextSetValue.value).then(() => {
                this.saveStateToStorage();
                this.modelChangeEvent.emit();
                this.settingValue = false;
            })
        }

        this.nextAnimationFrame = window.requestAnimationFrame(() => {
            this.processSetDataQueue();
        });
    }

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
        var fileNamePrefix = "WIB_ISOMER";
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
