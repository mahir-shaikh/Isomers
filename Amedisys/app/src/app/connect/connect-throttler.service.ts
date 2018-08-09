import { Injectable } from '@angular/core'

/// <reference path="../../libs/moment/moment.d.ts"/>
import Manifest = Connect.Manifest;
import {AuthenticationError, Connect, RequestFailedError} from "./connect";
import {SyncStatus, SyncStatusService} from "./syncStatus.service";
import {Subject} from "rxjs/Subject";
import {Response} from '@angular/http';

@Injectable()
export default class ConnectThrottlerService {
    private isInitialized: boolean;
    private lastSuccessfulSync: Manifest;
    private waitingToSync: Manifest;
    private activeRequest: Promise<Manifest | void>;

    private syncEmitter: Subject<Manifest> = new Subject<Manifest>();
    private errorEmitter: Subject<Error | RequestFailedError | AuthenticationError | Response> = new Subject<Error | RequestFailedError | AuthenticationError | Response>();
    public SyncEmitter = this.syncEmitter.asObservable();
    public ErrorEmitter = this.errorEmitter.asObservable();

    Init = (state: Manifest) => {
        this.activeRequest = this.connect.getQuestionIds(state)
            .then((state: Manifest) => {
                this.isInitialized = true;
                this.activeRequest = null;
                return state;
            })
            .catch((err) => {
                this.SetErrorStatus(err);
                throw err;
            });

        return this.activeRequest;
    };

    QueueUpload = (state: Manifest) => {
        try {
            this.syncStatusService.SetStatus(SyncStatus.OutOfSync);

            if(!this.isInitialized && this.activeRequest == null) {
                this.Init(state).then(this.QueueUpload).catch(_ => {});
                return;
            }

            if(this.activeRequest != null) {
                this.waitingToSync = state;
                return;
            }
            this.syncStatusService.SetStatus(SyncStatus.Syncing);

            let stateCopy = this.clone(state);
            let currentQuestionsToSend = stateCopy.config.questionsToSend;
            if(this.lastSuccessfulSync) {
                let diff = stateCopy.config.questionsToSend.filter((question, idx) => {
                    return question.responseText != this.lastSuccessfulSync.config.questionsToSend[idx].responseText;
                });
                stateCopy.config.questionsToSend = diff;
            }

            this.activeRequest = this.connect.voteManyQuestionsFromJson(stateCopy)
                .then((state) => {
                    if(!this.waitingToSync) {
                        this.syncStatusService.SetStatus(SyncStatus.InSync);
                    }
                    let mergedManifest = this.clone(state);
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
        } catch(unexpectedError) {
            this.SetErrorStatus(unexpectedError);
        }
    };

    QueueDownload = (state: Manifest) => {
        if(!this.isInitialized) {
            return this.Init(state).then(this.QueueDownload).catch(_ => {});
        }

        this.syncStatusService.SetDownloadStatus(SyncStatus.Syncing);
        return this.connect.getMyVotes(state)
            .then((state) => {
                this.syncStatusService.SetDownloadStatus(SyncStatus.InSync);
                return state;
            })
            .catch(this.SetDownloadErrorStatus);
    };

    SetErrorStatus = (err: any) => {
        this.syncStatusService.SetStatus(this.getErrorStatus(err));
        this.errorEmitter.next(err);
    };

    SetDownloadErrorStatus = (err: any) => {
        this.syncStatusService.SetDownloadStatus(this.getErrorStatus(err));
        this.errorEmitter.next(err);
    };

    private getErrorStatus = (err: any) => {
        return err.status === 0 ? SyncStatus.NetworkError : SyncStatus.SyncError;
    };

    private clone = (state: Manifest) => {
        return JSON.parse(JSON.stringify(state));
    };

    constructor(private connect: Connect, private syncStatusService: SyncStatusService) {

        this.SyncEmitter.subscribe((state: Manifest) => {
           if(this.waitingToSync) {
               let nextState = this.waitingToSync;
               this.waitingToSync = null;

               this.QueueUpload(nextState);
           }
        });
    }
}