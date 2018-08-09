import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

/// <reference path="../../libs/moment/moment.d.ts"/>
import moment = require('../../libs/moment/moment')

@Injectable()
export class SyncStatusService {
    private _lastSyncTime = <BehaviorSubject<moment.Moment>>new BehaviorSubject(null);
    private _status = <BehaviorSubject<SyncStatus>>new BehaviorSubject(SyncStatus.OutOfSync);
    private _downloadStatus = <BehaviorSubject<SyncStatus>>new BehaviorSubject(SyncStatus.OutOfSync);
    private _modelStateStatus = <BehaviorSubject<SyncStatus>>new BehaviorSubject(SyncStatus.OutOfSync);

    public Status = this._status.asObservable();
    public DownloadStatus = this._downloadStatus.asObservable();
    public ModelStateStatus = this._modelStateStatus.asObservable();
    public LastSyncTime = this._lastSyncTime.asObservable();

    private _aggregatedStatus = <BehaviorSubject<SyncStatus>>new BehaviorSubject(SyncStatus.OutOfSync);
    public AggregatedStatus = this._aggregatedStatus.asObservable();

    constructor() {}

    SetStatus(status: SyncStatus) {
        this._status.next(status);
        this.SetAggregatedStatus();
    }

    SetDownloadStatus(status: SyncStatus) {
        this._downloadStatus.next(status);
        this.SetAggregatedStatus();
    }

    SetModelStateStatus(status: SyncStatus) {
        this._modelStateStatus.next(status);
        this.SetAggregatedStatus();
    }

    GetCurrentStatus() {
        return this._status.getValue();
    }

    private SetAggregatedStatus() {
        let status = [
            this._status.getValue(),
            this._modelStateStatus.getValue(),
            this._downloadStatus.getValue()
        ].sort();

        let highest = status[2];
        this._aggregatedStatus.next(highest);

        this.UpdateSyncTime();
    }

    private UpdateSyncTime() {
        if(this._aggregatedStatus.getValue() == SyncStatus.InSync) {
            this._lastSyncTime.next(moment())
        }
    }
}

// Ordered in the order of importance to display
export enum SyncStatus {
    InSync = 0,
    OutOfSync,
    SyncError,
    NetworkError,
    Syncing
}