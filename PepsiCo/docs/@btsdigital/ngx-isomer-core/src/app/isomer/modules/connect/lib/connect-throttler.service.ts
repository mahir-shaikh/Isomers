import { Injectable } from '@angular/core';
import * as ConnectInterface from '../interfaces';
import { Observable } from 'rxjs/Observable';
import { ConnectService } from './connect.service';
import { AuthenticationError } from '../authentication-error';
import { RequestFailedError } from '../request-failed-error';
import { SyncStatusService } from '../sync/sync-status.service';
import { SyncStatus } from '../sync/syncstatus';
import { Subject } from 'rxjs/Subject';
import { Response } from '@angular/http';

/**
 * ConnectThrottlerService balances the upload functionality from the connect module
 * It also download the data after every x seconds from the backend as per configuration
 * It queues up all change requests and then after every 3 seconds syncs them up with the server
 * It takes care that the same values are not syncronised twice. So if the same value is changed twice the latest is synced
 */
@Injectable()
export class ConnectThrottlerService {
    /**
    * Flag top check if Service initialised completely
    */
    private isInitialized: boolean;
    /**
    * Configuration (manifest) data which was last syncronised successfully
    */
    private lastSuccessfulSync: ConnectInterface.Connect.Manifest;
    /**
    * The manifest configuration which is not yet synced
    */
    private waitingToSync: ConnectInterface.Connect.Manifest;
    /**
    * The manifest configuration which is in sync and active
    */
    private activeRequest: Promise<ConnectInterface.Connect.Manifest> | Promise<void>;

    /**
    * The configuration that is emitted back after a sync is successfull
    */
    private syncEmitter: Subject<ConnectInterface.Connect.Manifest> = new Subject();
    /**
    * Emits errors that are found while sync
    */
    private errorEmitter: Subject<Error | RequestFailedError | AuthenticationError | Response> = new Subject();

    /**
     * public variable which defines the sync emitter
     */
    public SyncEmitter: Observable<any> = this.syncEmitter.asObservable();
    /**
     * public variable which defines the error emitter
     */
    public ErrorEmitter: Observable<any> = this.errorEmitter.asObservable();

    /**
    * Initialise the sync connector and then set the state to initialisation complete
    */
    Init(state: ConnectInterface.Connect.Manifest): Promise<void | ConnectInterface.Connect.Manifest> {
        this.activeRequest = this.connect.getQuestionIds(state)
            .then((statenew: ConnectInterface.Connect.Manifest) => {
                this.isInitialized = true;
                this.activeRequest = null;
                return statenew;
            })
            .catch((err) => {
                this.SetErrorStatus(err);
                throw err;
            });

        return this.activeRequest;
    }

    /**
    * set state to out of sync
    * upload the data in queue to backend
    * set the status to syncing
    * change it back to in sync when complete
    * In case any request come when u already have data in que, merge it with the data in queue
    */
    QueueUpload = (state: ConnectInterface.Connect.Manifest): void => {
        try {
            this.syncStatusService.SetStatus(SyncStatus.OutOfSync);

            if (!this.isInitialized && this.activeRequest == null) {
                this.Init(state).then(this.QueueUpload).catch(_ => { });
                return;
            }

            if (this.activeRequest != null) {
                this.waitingToSync = state;
                return;
            }
            this.syncStatusService.SetStatus(SyncStatus.Syncing);

            const stateCopy = this.clone(state);
            const currentQuestionsToSend = stateCopy.config.questionsToSend;
            if (this.lastSuccessfulSync) {
                const diff = stateCopy.config.questionsToSend.filter((question, idx) => {
                    return question.responseText !== this.lastSuccessfulSync.config.questionsToSend[idx].responseText;
                });
                stateCopy.config.questionsToSend = diff;
            }

            this.activeRequest = this.connect.voteManyQuestionsFromJson(stateCopy)
                .then((statenew) => {
                    if (!this.waitingToSync) {
                        this.syncStatusService.SetStatus(SyncStatus.InSync);
                    }
                    const mergedManifest = this.clone(statenew);
                    mergedManifest.config.questionsToSend = currentQuestionsToSend;
                    this.lastSuccessfulSync = mergedManifest;

                    this.activeRequest = null;
                    this.syncEmitter.next(mergedManifest);
                })
                .catch((err) => {
                    this.activeRequest = null;
                    this.waitingToSync = null;
                    throw err;
                })
                .catch(this.SetErrorStatus);
        } catch (unexpectedError) {
            this.SetErrorStatus(unexpectedError);
        }
    }

    /**
   * Set the download status to syncing and the download the data
   * set it back to in sync when completed
   */
    QueueDownload = (state: ConnectInterface.Connect.Manifest): any => {
        if (!this.isInitialized) {
            return this.Init(state).then(this.QueueDownload).catch(_ => { });
        }

        this.syncStatusService.SetDownloadStatus(SyncStatus.Syncing);
        return this.connect.getMyVotes(state)
            .then((statenew) => {
                return this.connect.getMyForemanVotes(statenew)
                    .then((statenewest) => {
                        this.syncStatusService.SetDownloadStatus(SyncStatus.InSync);
                        return statenewest;
                    }).catch(this.SetDownloadErrorStatus);
            })
            .catch(this.SetDownloadErrorStatus);
    }

    /**
   * update votes returned by the signalr
   * set it back to in sync when completed
   */
    updateMyVotes = (state: ConnectInterface.Connect.Manifest, result: any): any => {
        if (!this.isInitialized) {
            return this.Init(state).then(this.QueueDownload).catch(_ => { });
        }
        const promise = new Promise((resolve, reject) => {
            this.syncStatusService.SetDownloadStatus(SyncStatus.Syncing);
            // upate state
            Object.keys(state.questionIds).forEach(function (key) {
                const questionId = state.questionIds[key];
                // check if the vote.QuestionId is indeed requested by our configuration
                const voteRecord = result.votes.filter(e => e.QuestionId === questionId);
                if (voteRecord.length > 0) {
                    state.votes[questionId] = voteRecord[0].ResponseText;
                }
            });
            this.syncStatusService.SetDownloadStatus(SyncStatus.InSync);
            resolve(state);
        });
        return promise;
    }

    /**
  * update votes returned by the signalr
  * set it back to in sync when completed
  */
    updateMyForemanVotes = (state: ConnectInterface.Connect.Manifest, result: any): any => {
        if (!this.isInitialized) {
            return this.Init(state).then(this.QueueDownload).catch(_ => { });
        }
        const promise = new Promise((resolve, reject) => {
            this.syncStatusService.SetDownloadStatus(SyncStatus.Syncing);
            // upate state
            Object.keys(state.foremanQuestionIds).forEach(function (key) {
                const questionId = state.foremanQuestionIds[key];
                // check if the vote.QuestionId is indeed requested by our configuration
                const voteRecord = result.votes.filter(e => e.QuestionId === questionId);
                if (voteRecord.length > 0) {
                    state.foremanvotes[questionId] = voteRecord[0].ResponseText;
                }
            });
            this.syncStatusService.SetDownloadStatus(SyncStatus.InSync);
            resolve(state);
        });
        return promise;
    }


    /**
    * Set the status to error when any errors are met during upload
    */
    SetErrorStatus = (err: any): void => {
        this.syncStatusService.SetStatus(this.getErrorStatus(err));
        this.errorEmitter.next(err);
    }

    /**
    * Set the status to error when any errors are met during download
    */
    SetDownloadErrorStatus = (err: any): void => {
        this.syncStatusService.SetDownloadStatus(this.getErrorStatus(err));
        this.errorEmitter.next(err);
    }

    /**
     * This function will return the error status if any
     */
    private getErrorStatus = (err: any): SyncStatus.NetworkError | SyncStatus.SyncError => {
        return err.status === 0 ? SyncStatus.NetworkError : SyncStatus.SyncError;
    }

    /**
     * This function will clone the state object and return a copy
     */
    private clone = (state: ConnectInterface.Connect.Manifest): any => {
        return JSON.parse(JSON.stringify(state));
    }

    /**
    * Constructor connect-throttler service
    *
    * @param {Connect} connect Connect instance
    *
    * @param {SyncStatusService} syncStatusService SyncStatusService instance
    *
    */
    constructor(private connect: ConnectService, private syncStatusService: SyncStatusService) {

        this.SyncEmitter.subscribe((state: ConnectInterface.Connect.Manifest) => {
            if (this.waitingToSync) {
                const nextState = this.waitingToSync;
                this.waitingToSync = null;

                this.QueueUpload(nextState);
            }
        });
    }
}
