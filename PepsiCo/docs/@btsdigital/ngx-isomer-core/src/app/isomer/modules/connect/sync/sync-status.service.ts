import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { SyncStatus } from './syncstatus';
import * as moment from 'moment/moment';

/**
 * This class is responsible for setting and updatingk THE UPLOAD and DOWNLOAD statuses
 */
@Injectable()
export class SyncStatusService {
    /**
   * last sync time of the aggregated status private variable for LastSyncTime
   */
    private _lastSyncTime = <BehaviorSubject<moment.Moment>>new BehaviorSubject(null);
    /**
   * current active status private variable for Status
   */
    private _status = <BehaviorSubject<SyncStatus>>new BehaviorSubject(SyncStatus.OutOfSync);
    /**
   * current status of download & private variable for DownloadStatus
   */
    private _downloadStatus = <BehaviorSubject<SyncStatus>>new BehaviorSubject(SyncStatus.OutOfSync);
    /**
   * current status of model state & private variable for ModelStateStatus
   */
    private _modelStateStatus = <BehaviorSubject<SyncStatus>>new BehaviorSubject(SyncStatus.OutOfSync);

    /**
   * current active status
   */
    public Status: Observable<any> = this._status.asObservable();
    /**
  * current status of download
  */
    public DownloadStatus: Observable<any> = this._downloadStatus.asObservable();
    /**
  * current status of model state
  */
    public ModelStateStatus: Observable<any> = this._modelStateStatus.asObservable();
    /**
  * last sync time of the aggregated status
  */
    public LastSyncTime: Observable<any> = this._lastSyncTime.asObservable();

    /**
   * Final aggregated status and private variable for AggregatedStatus
   */
    private _aggregatedStatus = <BehaviorSubject<SyncStatus>>new BehaviorSubject(SyncStatus.OutOfSync);
    /**
   * Final aggregated status
   */
    public AggregatedStatus: Observable<any> = this._aggregatedStatus.asObservable();

    /**
     * set upload status and recalculate/set the aggregated status
     * @param status SyncStatus the new status to be set
     */
    SetStatus(status: SyncStatus): void {
        this._status.next(status);
        this.SetAggregatedStatus();
    }

   /**
    * set download status and recalculate/set the aggregated status
    * @param status SyncStatus the new status to be set
    */
    SetDownloadStatus(status: SyncStatus): void {
        this._downloadStatus.next(status);
        this.SetAggregatedStatus();
    }

    /**
     * set model status and recalculate/set the aggregated status
     * @param status SyncStatus the new status to be set
     */
    SetModelStateStatus(status: SyncStatus): void {
        this._modelStateStatus.next(status);
        this.SetAggregatedStatus();
    }

    /**
   * get current aggregated status
   */
    GetCurrentStatus(): SyncStatus {
        return this._status.getValue();
    }

    /**
   * This is a fucntion used to calculate the agrregated status from all 3 ie upload/download/model
   */
    private SetAggregatedStatus(): void {
        const status = [
            this._status.getValue(),
            this._modelStateStatus.getValue(),
            this._downloadStatus.getValue()
        ].sort();

        const highest = status[2];
        this._aggregatedStatus.next(highest);

        this.UpdateSyncTime();
    }

    /**
    * update the last sync time when the status is IN SYNC
    */
    private UpdateSyncTime(): void {
      const _moment = moment;
        if (this._aggregatedStatus.getValue() === SyncStatus.InSync) {
            this._lastSyncTime.next(_moment());
        }
    }
}

