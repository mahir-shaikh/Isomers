import { Component, OnInit } from '@angular/core';
// import { CalcService, ProjectStateService } from '../../shared/external-module';
// import { ProjectStateService } from '../../calcmodule';
// import { TextEngineService } from '../../textengine/textengine.service';
import { Router } from '@angular/router';
import { APP_READY, DataStore, EVENTS } from '../../utils';
// import { EmailCaptureService } from '../emailcapture.service';

import { BootstrapService } from '../bootstrap.service';
import { LoggerService, StorageService, Constants, CommunicatorService, SyncService } from '@btsdigital/ngx-isomer-core';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../environments/environment';
// import '../../../libs/jsCalc/jsCalc';

@Component({
    selector: 'isma-splash',
    templateUrl: './splash.component.html',
    styleUrls: ['./splash.component.styl']
})

export class SplashComponent implements OnInit {
    title: string = 'Loading...';
    progress: number = 0;
    progressMessage: string = 'Loading model...';
    format: string = '0%';
    scaler: number = 0;
    private modelProgressSubscription: Subscription;

    constructor(private bootstraper: BootstrapService, private router: Router, private logger: LoggerService,
        private storageService: StorageService, private communicator: CommunicatorService,
        private dataStore: DataStore, private syncService: SyncService) { }

    // ngOnInit() {
    //     let self = this,
    //         stateUrl = '',
    //         urlTree: UrlTree = null,
    //         calcModelLoadedPromise = this.calcService.getApi(this.progressCb(this))
    //         // .then(api => api.forceRecalculate())
    //         , textLoadedPromise = this.textEngine.init()
    //         , emailSavedPromise = this.emailCaptureService.saveEmail()
    //         , textEngineLoadedPromise = this.textEngineService.init();
    //     // , projectServiceLoaded = this.projectStateService.init();

    //     Promise.all([calcModelLoadedPromise, textLoadedPromise/*, projectServiceLoaded*/, emailSavedPromise, textEngineLoadedPromise]).then(() => {
    //         stateUrl = (this.calcService.getStateUrl() && this.calcService.getStateUrl() !== '') ? this.calcService.getStateUrl() : '/intro';
    //         urlTree = this.router.parseUrl(decodeURIComponent(stateUrl));
    //         // check if app-ready was already set as persistent
    //         let introData = self.dataStore.getData(EVENTS['INTRO_COMPLETE'], true);
    //         self.dataStore.setData(APP_READY, true);
    //         if (introData !== null) {
    //             introData.then((ready) => {
    //                 if (ready == 'true') {
    //                     self.router.navigateByUrl(stateUrl);
    //                 }
    //                 else {
    //                     self.router.navigateByUrl('intro');
    //                 }
    //             });
    //         }
    //         else {
    //             this.router.navigateByUrl('intro');
    //         }
    //     });
    // }

    ngOnInit() {
        let count = 0;
        if (!this.bootstraper.appReady) {
            this.modelProgressSubscription = this.communicator
                .getEmitter(Constants.MODEL_LOAD_PROGRESS)
                .subscribe((progress) => {
                    if (progress >= 1) {
                        if (count !== 0 && progress === 1) {
                            progress = 1;
                        } else {
                            progress = progress / 1000;
                        }
                    }
                    this.progress = progress;
                    count++;
                });

            this.bootstraper
                .init()
                .then(() => {
                    this.appReady();
                    if (environment.enableConnectModule) {
                        this.syncService.initializeSync();
                        this.syncService.setMode(Constants.CONNECTION_MODE.PUSH);
                    }
                });
        }
    }

    private appReady() {
        this.logger.log('Model loaded');
        let returnUrl: string;
        this.storageService.getValue(Constants.RETURN_URL)
            .then(val => {
                returnUrl = val + '';
                const introData = this.dataStore.getData(EVENTS['INTRO_COMPLETE'], true);
                this.dataStore.setData(APP_READY, true);
                if (introData !== null) {
                    introData.then((ready) => {
                        if (ready === 'true') {
                            this.router.navigateByUrl(returnUrl);
                        } else {
                            this.router.navigateByUrl('/intro');
                        }
                    });
                }
            })
            .catch(err => {
                this.router.navigateByUrl('');
            });
    }

    // loadingProgress(progressOb: any) {
    //     this.progress = (progressOb.numComplete / progressOb.numTotal) > 1 ? 0 : progressOb.numComplete / progressOb.numTotal;
    // }

    // progressCb(self: SplashComponent) {
    //     return function (progress: any) {
    //         self.loadingProgress(progress);
    //         if (parseInt(self.progress + '') === 1) {
    //             self.progressMessage = 'Initializing model...';
    //         } else {
    //             self.progressMessage = 'Loading model...';
    //         }
    //     }

    // }
}
