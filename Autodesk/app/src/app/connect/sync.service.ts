import { Injectable } from '@angular/core'
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { Subscription } from 'rxjs/Subscription';

import { Angular2HttpWrapper } from './angular2HttpWrapper'
import { CalcService } from '../calcmodule'
import { SyncStatusService, SyncStatus } from './syncStatus.service'
import { ManifestService } from './manifest.service'
import { Observable } from 'rxjs/Observable';

/// <reference path="./definitions.d.ts"/>
import PulseConnector = require('app/connect/lib/connect')
import JsCalcConnector = require('app/connect/lib/jsCalcConnector')

@Injectable()
export class SyncService {
  private connect : Connect.Connect
  private jsCalc
  private state: Connect.Manifest
  private subscription
  private dlSubscription : Subscription

  constructor(private httpWrapper: Angular2HttpWrapper, private calcService: CalcService, private syncStatusService: SyncStatusService, private manifestService: ManifestService) {
    this.state = this.manifestService.Get()
    this.manifestService.State.subscribe((newState: Connect.Manifest) => {
      this.state = newState
    })

    // Initialize Connect with a http module and a promise implementation
    this.connect = PulseConnector(httpWrapper, Promise)
    this.jsCalc = JsCalcConnector(calcService, Promise)

    // If in prod, sync automatically on change
    if (process.env.CONNECT_TO_PULSE === 'true') {
      this.calcService.getApi().then((api) => {
        this.subscription = this.calcService.getObservable().subscribe((_) => {
          this.setSyncStatus(SyncStatus.OutOfSync)
          this.Upload()
        })
      })

      this.getQuestionIdsIfNotPresent(this.state)
        .then(() => {
            // pull data from backend and add to the model
            this.calcService.getApi().then(() => {
              this.Download().then((hasQuestions) => {
                if (!hasQuestions) return;
                this.dlSubscription = Observable.interval(30000).subscribe(() => {
                    this.Download()
                })
              })
            })
        })
        .catch(this.handleError)
    }
  }

  Download(): Promise<any> {
    let questionIds = this.connect.getQuestionIdsToReceive(this.state);
    if (questionIds.length) {
      this.setSyncStatus(SyncStatus.Syncing)
      return this.connect.getMyVotes(this.state)
            .then(this.jsCalc.writeValues)
            .then((state: Connect.Manifest) => {
              this.setSyncStatus(SyncStatus.InSync)
              this.manifestService.SetState(state)
              return state
            })
            .catch((err) => this.handleError(err))
    }
    return Promise.resolve(false);
  }


  Upload() {
    this.setSyncStatus(SyncStatus.Syncing)

    return this.getQuestionIdsIfNotPresent(this.state)
      .then(this.jsCalc.readValues)
      .then(this.connect.voteManyQuestionsFromJson)
      .catch(this.handleAuthErrors)
      .then((state: Connect.Manifest) => {
        this.setSyncStatus(SyncStatus.InSync)
        this.manifestService.SetState(state)
      })
      .catch((err) => this.handleError(err))
  }

  private getQuestionIdsIfNotPresent = (state: Connect.Manifest): Promise<Connect.Manifest> => {
      if(!state.questionIds) {
        // Fetch the questionIds
        return this.connect.getQuestionIds(state)
          .catch(this.handleAuthErrors)
          .then((state: Connect.Manifest) => {
            this.manifestService.SetState(state)
            return state
          })
      }
      return Promise.resolve(state)
  }

  private handleAuthErrors = (res: Connect.AuthenticationError) => {
      if(res.unauthenticated) {
        this.clearCookiesAndReload()
      }
      return Promise.reject(res)
  }

  private handleError = (err: Error & any) => {
      if(err.status === 0) {
        this.setSyncStatus(SyncStatus.NetworkError)
        console.log(err)
      } else {
        err.stack ? console.log(err, err.stack) : console.log(err)
        this.setSyncStatus(SyncStatus.SyncError)
      }
  }

  private clearCookiesAndReload = () => {
    var cookies = document.cookie.split(';')
    for(var i = 0; i<cookies.length; i++) {
        var cookie = cookies[i].split('=')[0].trim()
        if (cookie.length > 0) {
            document.cookie = cookie + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC"
        }
    }
    console.log("Cookies cleared.")
    window.location.reload(true)
  }

  private setSyncStatus = (syncStatus: SyncStatus) => {
    this.syncStatusService.SetStatus(syncStatus)
  }
}
