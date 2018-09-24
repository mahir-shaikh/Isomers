import 'rxjs/add/operator/debounceTime';
import { CalcService } from '../../calc/calc.service';
import { ManifestService } from '../../services/manifest/manifest.service';
import { AuthenticationError } from '../authentication-error';
import { RequestFailedError } from '../request-failed-error';
import { ConnectThrottlerService } from '../lib/connect-throttler.service';
import { JsCalcConnectorService } from '../lib/jscalc-connector.service';
import { SignalRWrapperService } from '../../services/signalrwrapper/signalr-wrapper.service';
/**
  * This service is responsible for syncronizing the status of various uplaod and download processes
  * This also takes care of the aggregated status of sync
  */
export declare class SyncService {
    private connectThrottler;
    private calcService;
    private manifestService;
    private jsCalc;
    private signalRwrapperService;
    /**
     * A private variable which stores the local state
     */
    private state;
    /**
     * A private variable which stores the sunbscription to thedebounce object. Will call upload every x seconds
     */
    private subscription;
    /**
     * A private variable which stores the IntervalObservable. Will call download every x seconds
     */
    private dlSubscription;
    /**
     * a variable which defines if connectiing to pulse is on or off
     */
    private connectToPulse;
    /**
     * by default we will use the connect module to fetch the participant votes
     * If we want to use signalR instead, we will say usePush to true
     */
    private usePush;
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
    constructor(connectThrottler: ConnectThrottlerService, calcService: CalcService, manifestService: ManifestService, jsCalc: JsCalcConnectorService, signalRwrapperService: SignalRWrapperService);
    /**
    * Handle errors that occur during syncronisation requests
    */
    static handleSyncErrors(err: Error | RequestFailedError | AuthenticationError | any): void;
    /**
    * clear browser cookies anmd reload the page
    */
    private static clearCookiesAndReload();
    /**
    * Simply seperating out window.reload to save the unit tests reloading and it can be stubbed
    */
    static reloadWindow(): void;
    /**
    * Initialize to sync automatically on change
    */
    initializeSync(): void;
    /**
    * Download whatever is pending in download queue and then write the value to jscal connector
    */
    Download: () => any;
    /**
    * Read the values from jscalc connector and then add to the upload queue
    */
    Upload: () => any;
    /**
   * By default connecting to pulse is always true. we can use this function we want to explicitly turn it off
   */
    disableConnectToPulse: () => void;
    /**
    * by default we will use the connect module polling to fetch the participant votes
    * If we want to use signalR instead, we will say usePush to true
    */
    setMode: (mode: any) => void;
}
