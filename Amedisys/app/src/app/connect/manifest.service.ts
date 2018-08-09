import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

/// <reference path="./definitions.d.ts"/>
import Manifest = require('app/connect/lib/manifest')

@Injectable()
export class ManifestService {
  private _state = <BehaviorSubject<Connect.Manifest>>new BehaviorSubject(Manifest)
  public State = this._state.asObservable()

  constructor() {}

  SetState(state: Connect.Manifest) {
    this._state.next(state)
  }

  Get(): Connect.Manifest {
    return this._state.getValue()
  }

}