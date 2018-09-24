import { Observable } from 'rxjs/Observable';
import { SyncStatus } from './syncstatus';
/**
 * This class is responsible for setting and updatingk THE UPLOAD and DOWNLOAD statuses
 */
export declare class SyncStatusService {
    /**
   * last sync time of the aggregated status private variable for LastSyncTime
   */
    private _lastSyncTime;
    /**
   * current active status private variable for Status
   */
    private _status;
    /**
   * current status of download & private variable for DownloadStatus
   */
    private _downloadStatus;
    /**
   * current status of model state & private variable for ModelStateStatus
   */
    private _modelStateStatus;
    /**
   * current active status
   */
    Status: Observable<any>;
    /**
  * current status of download
  */
    DownloadStatus: Observable<any>;
    /**
  * current status of model state
  */
    ModelStateStatus: Observable<any>;
    /**
  * last sync time of the aggregated status
  */
    LastSyncTime: Observable<any>;
    /**
   * Final aggregated status and private variable for AggregatedStatus
   */
    private _aggregatedStatus;
    /**
   * Final aggregated status
   */
    AggregatedStatus: Observable<any>;
    /**
     * set upload status and recalculate/set the aggregated status
     * @param status SyncStatus the new status to be set
     */
    SetStatus(status: SyncStatus): void;
    /**
     * set download status and recalculate/set the aggregated status
     * @param status SyncStatus the new status to be set
     */
    SetDownloadStatus(status: SyncStatus): void;
    /**
     * set model status and recalculate/set the aggregated status
     * @param status SyncStatus the new status to be set
     */
    SetModelStateStatus(status: SyncStatus): void;
    /**
   * get current aggregated status
   */
    GetCurrentStatus(): SyncStatus;
    /**
   * This is a fucntion used to calculate the agrregated status from all 3 ie upload/download/model
   */
    private SetAggregatedStatus();
    /**
    * update the last sync time when the status is IN SYNC
    */
    private UpdateSyncTime();
}
