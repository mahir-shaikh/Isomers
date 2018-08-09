import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

/// <reference path="../../libs/moment/moment.d.ts"/>
import moment = require('../../libs/moment/moment')

@Injectable()
export class SyncStatusService {
  private _lastSyncTime = <BehaviorSubject<moment.Moment>>new BehaviorSubject(null)
  private _status = <BehaviorSubject<SyncStatus>>new BehaviorSubject(SyncStatus.OutOfSync)
  private _modelStateStatus = <BehaviorSubject<SyncStatus>>new BehaviorSubject(SyncStatus.OutOfSync)

  public Status = this._status.asObservable()
  public ModelStateStatus = this._modelStateStatus.asObservable()
  public LastSyncTime = this._lastSyncTime.asObservable()

  constructor() {}

  SetStatus(status: SyncStatus) {
      if(status == SyncStatus.InSync) {
          this._lastSyncTime.next(moment())
      }
      this._status.next(status)
  }
  SetModelStateStatus(status: SyncStatus) {
    if(status == SyncStatus.InSync) {
        this._lastSyncTime.next(moment())
    }
    this._modelStateStatus.next(status)
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