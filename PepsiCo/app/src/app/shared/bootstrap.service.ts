import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

import { TextEngineService } from '../textengine/textengine.service';
import { EmailCaptureService } from './emailcapture.service';
import { ModelLoaderService } from '../model/model-loader.service';

import { CalcService, TextService, HttpWrapperService, StorageService, CommunicatorService, LoggerService, Constants } from '@btsdigital/ngx-isomer-core';
// var model = require('../model/index.js') //from '../model/index.js';

@Injectable()
export class BootstrapService {

    // private modelLoadProgressSub: Subscription;
    private textServiceInitPromise: Promise<any>;
    private modelLoadCompletePromise: Promise<any>;

    private textLoadedPromise: Promise<any>;
    private emailSavedPromise: Promise<any>;

    private isAppReady = false;

    constructor(private calcService: CalcService, private textService: TextService,
        private storageService: StorageService, private logger: LoggerService,
        private emailCaptureService: EmailCaptureService, private textEngineService: TextEngineService,
        private modelLoaderService: ModelLoaderService) { }

    init(): Promise<any> {
        return this.modelLoaderService.getModel().then((response) => {
            const modelLoader: any = response;
            // set theme mode
            window['__theme'] = 'bs4';
            // set storage mode
            this.storageService.setMode(environment.connectToPulse ? Constants.STORAGE_MODES.MIXED : Constants.STORAGE_MODES.LOCAL);
            // set initial language to be loaded
            this.textService.language = 'en';
            // load text content
            this.textServiceInitPromise = this.textService.init();
            // try and load the calc model
            this.modelLoadCompletePromise = this.calcService
                .getApi(modelLoader)
                .catch((err) => {
                    this.logger.log('Error when loading model ', err);
                });

            this.textLoadedPromise = this.textEngineService.init();
            this.emailSavedPromise = this.emailCaptureService.saveEmail();

            return Promise.all([this.textServiceInitPromise, this.modelLoadCompletePromise, this.textLoadedPromise, this.emailSavedPromise])
                .then(() => {
                    this.isAppReady = true;
                });
        });
    }

    // private onProgress(progress: string) {
    //   this.logger.log('Progress ' + progress);
    // }

    public set appReady(v: boolean) {
        this.isAppReady = v;
    }

    public get appReady(): boolean {
        return this.isAppReady;
    }
}

// const environment = {
//     production: false,
//     logging: true,
//     hostname: 'http://local.bts.com',
//     connectToPulse: false

// };
