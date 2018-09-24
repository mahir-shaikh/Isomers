import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import { Constants } from '../../../config/constants';
import { CalcService } from '../../calc/calc.service';
import { ManifestService } from '../../services/manifest/manifest.service';

import { ChannelEventName } from '@btsdigital/pulseutilities';
import * as ConnectInterface from '../../connect/interfaces';

import { AuthenticationError } from '../authentication-error';
import { RequestFailedError } from '../request-failed-error';
import { ConnectThrottlerService } from '../lib/connect-throttler.service';
import { JsCalcConnectorService } from '../lib/jscalc-connector.service';
import { SignalRWrapperService } from '../../services/signalrwrapper/signalr-wrapper.service';
import { SignalRServiceConfig } from '@btsdigital/pulsesignalr';

/**
  * This service is responsible for syncronizing the status of various uplaod and download processes
  * This also takes care of the aggregated status of sync
  */
@Injectable()
export class SyncService {
    /**
     * A private variable which stores the local state
     */
    private state: ConnectInterface.Connect.Manifest;
    /**
     * A private variable which stores the sunbscription to thedebounce object. Will call upload every x seconds
     */
    private subscription;
    /**
     * A private variable which stores the IntervalObservable. Will call download every x seconds
     */
    private dlSubscription: Subscription;
    /**
     * a variable which defines if connectiing to pulse is on or off
     */
    private connectToPulse: boolean = true;
    /**
     * by default we will use the connect module to fetch the participant votes
     * If we want to use signalR instead, we will say usePush to true
     */
    private usePush: boolean = false;

    /**
   * Constructor sync service
   *
   * @param {ConnectThrottlerService} connectThrottler ConnectThrottlerService instance
   *
   * @param {CalcService} syncStatusService CalcService instance
   *
   * @param {JsCalcConnectorService} jsCalc JsCalcConnectorService instance
   *
   * @param {ManifestService} manifestService ManifestService instance
   *
   * @param {SignalRWrapperService} signalRwrapperService SignalRWrapperService instance
   *
   */
    constructor(private connectThrottler: ConnectThrottlerService, private calcService: CalcService,
        private manifestService: ManifestService, private jsCalc: JsCalcConnectorService,
        private signalRwrapperService: SignalRWrapperService) {
        this.state = this.manifestService.Get();
        this.manifestService.State.subscribe((newState: ConnectInterface.Connect.Manifest) => {
            this.state = newState;
        });
        this.connectThrottler.ErrorEmitter.subscribe(SyncService.handleSyncErrors);
    }

    /**
    * Handle errors that occur during syncronisation requests
    */
    public static handleSyncErrors(err: Error | RequestFailedError | AuthenticationError | any): void {
        if (err instanceof AuthenticationError) {
            SyncService.clearCookiesAndReload();
        } else if (err instanceof RequestFailedError) {
            console.error(err.message);
        } else {
            err.stack ? console.error(err.message, err.stack) : console.error(err);
        }
    }

    /**
    * clear browser cookies anmd reload the page
    */
    private static clearCookiesAndReload(): void {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].split('=')[0].trim();
            if (cookie.length > 0) {
                document.cookie = cookie + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
            }
        }
        // console.log("Cookies cleared.");
        SyncService.reloadWindow();
    }

    /**
    * Simply seperating out window.reload to save the unit tests reloading and it can be stubbed
    */
    public static reloadWindow(): void {
        window.location.reload(true);
    }

    /**
    * Initialize to sync automatically on change
    */
    public initializeSync(): void {
        // If in connect mode, sync automatically on change
        if (this.connectToPulse) {
            const calcPromise = this.calcService.getApi();

            calcPromise.then((api) => {
                const debouncetime = this.calcService.getObservable().debounceTime(3000);
                this.subscription = debouncetime.subscribe(this.Upload);
                this.dlSubscription = new IntervalObservable(30000).subscribe(this.Download);
            });

            this.connectThrottler.Init(this.state)
                .then(() => {
                    calcPromise.then(this.Download);
                }).catch(_ => {
                    // Just catch. Error emitter handles the error.
                });
        }
    }

    /**
    * Download whatever is pending in download queue and then write the value to jscal connector
    */
    Download = (): any => {
        if (this.usePush === false) {
            return this.connectThrottler.QueueDownload(this.state)
                .then(this.jsCalc.writeValues);
        } else {
            return null;
        }
    }

    /**
    * Read the values from jscalc connector and then add to the upload queue
    */
    Upload = (): any => {
        return this.jsCalc.readValues(this.state)
            .then(this.connectThrottler.QueueUpload);
    }

    /**
   * By default connecting to pulse is always true. we can use this function we want to explicitly turn it off
   */
    disableConnectToPulse = (): void => {
        this.connectToPulse = false;
    }

    /**
    * by default we will use the connect module polling to fetch the participant votes
    * If we want to use signalR instead, we will say usePush to true
    */
    setMode = (mode: any): void => {
        if (mode === Constants.CONNECTION_MODE.PUSH) {
            this.usePush = true;
            this.signalRwrapperService.enablePush();
            // do a forced download and then init the signalr
            return this.connectThrottler.QueueDownload(this.state)
                .then(result => {
                    this.jsCalc.writeValues(this.state);
                    const signalrConfig: SignalRServiceConfig = {
                        hostname: this.manifestService.Get().config.hostName,
                        serviceUrl: this.manifestService.Get().config.hostName + '/PulseServices/'
                    };
                    this.signalRwrapperService.init(this.state.participantId, signalrConfig).then(
                        res => {
                            this.signalRwrapperService.subscribeForMyVoteChanged()
                                .subscribe(jsondata => {
                                    if (jsondata.EventName === ChannelEventName[ChannelEventName.MyVoteChanged]) {
                                        const pid = jsondata.TargetParticipationId;
                                        if (pid === this.state.foremanId || pid === result.foremanId) {
                                            this.connectThrottler.updateMyForemanVotes(this.state, jsondata.Data)
                                                .then(statenew => {
                                                    this.jsCalc.writeValues(statenew);
                                                });
                                        } else if (pid === this.state.participantId || pid === result.participantId) {
                                            let data: any;
                                            if (jsondata.Data) {
                                                data = jsondata.Data['Data'];
                                            }
                                            this.connectThrottler.updateMyVotes(this.state, data)
                                                .then(statenew => {
                                                    this.jsCalc.writeValues(statenew);
                                                });
                                        }
                                    }
                                });
                        });
                });
        } else {
            this.usePush = false;
            this.signalRwrapperService.disablePush();
        }
    }

}
