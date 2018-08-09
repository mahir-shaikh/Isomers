import { Injectable } from '@angular/core'
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { Subscription } from 'rxjs/Subscription';

import { CalcService } from '../calcmodule/calc.service'
import { ManifestService } from './manifest.service'

/// <reference path="./definitions.d.ts"/>
import {AuthenticationError, RequestFailedError} from './connect';
import {ConfigService} from "./config.service";
import ConnectThrottlerService from "./connect-throttler.service";
import JsCalcConnector from "./jscalc-connector";

@Injectable()
export class SyncService {
    private jsCalc;
    private state: Connect.Manifest;
    private subscription;
    private dlSubscription : Subscription;

    constructor(private connectThrottler: ConnectThrottlerService, private calcService: CalcService, private manifestService: ManifestService, private configService: ConfigService) {
        this.state = this.manifestService.Get();
        this.manifestService.State.subscribe((newState: Connect.Manifest) => {
            this.state = newState;
        });
        this.jsCalc = new JsCalcConnector(calcService);
        this.connectThrottler.ErrorEmitter.subscribe(SyncService.handleSyncErrors);

        // If in prod, sync automatically on change
        if (this.configService.CONNECT_TO_PULSE) {
            let calcPromise = this.calcService.getApi();

            calcPromise.then((api) => {
                this.subscription = this.calcService.getObservable().debounceTime(3000).subscribe(this.Upload);
                this.dlSubscription = new IntervalObservable(10000).subscribe(this.Download);
            });

            this.connectThrottler.Init(this.state)
                .then(() => {
                    calcPromise.then(this.Download);
                }).catch(_ => {
                    // Just catch. Error emitter handles the error.
                });
        }
    }

    Download = () => {
        return this.connectThrottler.QueueDownload(this.state)
            .then(this.jsCalc.writeValues)
    };

    Upload = () => {
        return this.jsCalc.readValues(this.state)
            .then(this.connectThrottler.QueueUpload)
    };

    private static handleSyncErrors(err: Error | RequestFailedError | AuthenticationError | any) {
        if(err instanceof AuthenticationError) {
            SyncService.clearCookiesAndReload();
        }
        else if(err instanceof RequestFailedError) {
            console.error(err.message);
        } else {
            err.stack ? console.error(err.message, err.stack) : console.error(err);
        }
    }

  private static clearCookiesAndReload() {
    const cookies = document.cookie.split(';');
    for(let i = 0; i<cookies.length; i++) {
        const cookie = cookies[i].split('=')[0].trim();
        if (cookie.length > 0) {
            document.cookie = cookie + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        }
    }
    console.log("Cookies cleared.");
    window.location.reload(true);
  }
}
