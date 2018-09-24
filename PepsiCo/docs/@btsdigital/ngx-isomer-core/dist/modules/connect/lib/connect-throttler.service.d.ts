import * as ConnectInterface from '../interfaces';
import { Observable } from 'rxjs/Observable';
import { ConnectService } from './connect.service';
import { SyncStatusService } from '../sync/sync-status.service';
/**
 * ConnectThrottlerService balances the upload functionality from the connect module
 * It also download the data after every x seconds from the backend as per configuration
 * It queues up all change requests and then after every 3 seconds syncs them up with the server
 * It takes care that the same values are not syncronised twice. So if the same value is changed twice the latest is synced
 */
export declare class ConnectThrottlerService {
    private connect;
    private syncStatusService;
    /**
    * Flag top check if Service initialised completely
    */
    private isInitialized;
    /**
    * Configuration (manifest) data which was last syncronised successfully
    */
    private lastSuccessfulSync;
    /**
    * The manifest configuration which is not yet synced
    */
    private waitingToSync;
    /**
    * The manifest configuration which is in sync and active
    */
    private activeRequest;
    /**
    * The configuration that is emitted back after a sync is successfull
    */
    private syncEmitter;
    /**
    * Emits errors that are found while sync
    */
    private errorEmitter;
    /**
     * public variable which defines the sync emitter
     */
    SyncEmitter: Observable<any>;
    /**
     * public variable which defines the error emitter
     */
    ErrorEmitter: Observable<any>;
    /**
    * Initialise the sync connector and then set the state to initialisation complete
    */
    Init(state: ConnectInterface.Connect.Manifest): Promise<void | ConnectInterface.Connect.Manifest>;
    /**
    * set state to out of sync
    * upload the data in queue to backend
    * set the status to syncing
    * change it back to in sync when complete
    * In case any request come when u already have data in que, merge it with the data in queue
    */
    QueueUpload: (state: ConnectInterface.Connect.Manifest) => void;
    /**
   * Set the download status to syncing and the download the data
   * set it back to in sync when completed
   */
    QueueDownload: (state: ConnectInterface.Connect.Manifest) => any;
    /**
   * update votes returned by the signalr
   * set it back to in sync when completed
   */
    updateMyVotes: (state: ConnectInterface.Connect.Manifest, result: any) => any;
    /**
  * update votes returned by the signalr
  * set it back to in sync when completed
  */
    updateMyForemanVotes: (state: ConnectInterface.Connect.Manifest, result: any) => any;
    /**
    * Set the status to error when any errors are met during upload
    */
    SetErrorStatus: (err: any) => void;
    /**
    * Set the status to error when any errors are met during download
    */
    SetDownloadErrorStatus: (err: any) => void;
    /**
     * This function will return the error status if any
     */
    private getErrorStatus;
    /**
     * This function will clone the state object and return a copy
     */
    private clone;
    /**
    * Constructor connect-throttler service
    *
    * @param {Connect} connect Connect instance
    *
    * @param {SyncStatusService} syncStatusService SyncStatusService instance
    *
    */
    constructor(connect: ConnectService, syncStatusService: SyncStatusService);
}
