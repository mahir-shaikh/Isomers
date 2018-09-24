import { SyncStatusService } from '../sync/sync-status.service';
import { SyncStatus } from '../sync/syncstatus';
import { SyncService } from '../sync/sync.service';
import { discardPeriodicTasks, fakeAsync, tick, TestBed } from '@angular/core/testing';
import * as ConnectInterface from '../interfaces';
import { ConnectThrottlerService } from './connect-throttler.service';
import { ConnectService } from './connect.service';
import { AuthenticationError } from '../authentication-error';
import { RequestFailedError } from '../request-failed-error';
import { HttpWrapperService } from '../httpwrapper/http-wrapper.service';
import { HttpWrapperServiceStub } from '../../../test/http-wrapper-service.stub';
import { throttle } from 'rxjs/operator/throttle';

describe('Connect Throttler', () => {
    let syncStatusService: SyncStatusService,
        connect: ConnectService,
        throttler: ConnectThrottlerService,
        manifest: ConnectInterface.Connect.Manifest;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: HttpWrapperService, useClass: HttpWrapperServiceStub },
                SyncStatusService,
                ConnectService,
                ConnectThrottlerService]
        });
        connect = TestBed.get(ConnectService);
        syncStatusService = TestBed.get(SyncStatusService);
        throttler = TestBed.get(ConnectThrottlerService);
        manifest = {
            config: {
                hostName: 'NotARealHostname',
                eventTitle: 'TakedaBa2',
                questionsToSend: [
                    { 'questionName': 'xxRBD1DBM2', 'rangeName': 'xxRBD1DBM2', 'responseText': 'Response' },
                    { 'questionName': 'xxRBD1DBM3', 'rangeName': 'xxRBD1DBM3', 'responseText': 'Response' },
                ],
                questionsToReceive: [
                    { 'questionName': 'xxRBD1DBM2', 'rangeName': 'xxRBD1DBM2' },
                ],
                foremanquestionsToRecieve: null,
                trackQuestion: null
            }
        };
        spyOn(SyncService, 'reloadWindow');
    });

    describe('Init', () => {
        it('Emits an error if it cant initialize', fakeAsync(() => {
            spyOn(connect, 'getQuestionIds').and.callFake(() => {
                return Promise.reject(new Error('Mock Server Error'));
            });

            let errorFired = null;
            throttler.ErrorEmitter.subscribe((err) => {
                errorFired = err;
            });

            throttler.Init(manifest).then((state) => {
                fail('Got state when it was supposed to fail');
            }).catch((err) => {
                expect(err.message).toEqual('Mock Server Error');
            });

            tick(1);

            expect(errorFired).toBeDefined('Error should fire');
            expect(errorFired.message).toEqual('Mock Server Error', 'Error should contain correct message');

            expect(SyncStatus[syncStatusService.GetCurrentStatus()]).toBe(SyncStatus[SyncStatus.SyncError], 'Sync status should have been updated');
        }));

        it('Returns the initialized state when initializing', fakeAsync(() => {
            spyOn(connect, 'getQuestionIds').and.callFake((state: ConnectInterface.Connect.Manifest) => {
                state.questionIds = 'Mocked answer';
                return Promise.resolve(state);
            });

            throttler.Init(manifest).then((state: ConnectInterface.Connect.Manifest) => {
                expect(state.questionIds).toEqual('Mocked answer');
            });
        }));
    });

    describe('SetErrorStatus', () => {
        it('Should emit an error', fakeAsync(() => {
            let errorFired = null;
            throttler.ErrorEmitter.subscribe((err) => {
                errorFired = err;
            });

            throttler.SetErrorStatus(new Error('Mocked error'));

            tick(1);

            expect(errorFired).toBeDefined('Error should fire');
            expect(errorFired.message).toBe('Mocked error');
        }));

        it('Should set the sync status to network error on network errors', fakeAsync(() => {
            throttler.SetErrorStatus({ status: 0 });

            expect(SyncStatus[syncStatusService.GetCurrentStatus()]).toBe(SyncStatus[SyncStatus.NetworkError], 'Sync status should have been updated');
        }));

        it('Should set the sync status to sync error on other errors', fakeAsync(() => {
            throttler.SetErrorStatus(new Error('Mocked error'));
            expect(SyncStatus[syncStatusService.GetCurrentStatus()]).toBe(SyncStatus[SyncStatus.SyncError], 'Sync status should have been updated');

            syncStatusService.SetStatus(SyncStatus.InSync);

            throttler.SetErrorStatus(new RequestFailedError('Mocked Request error'));
            expect(SyncStatus[syncStatusService.GetCurrentStatus()]).toBe(SyncStatus[SyncStatus.SyncError], 'Sync status should have been updated');

            syncStatusService.SetStatus(SyncStatus.InSync);

            throttler.SetErrorStatus(new AuthenticationError('Mocked Auth error'));
            expect(SyncStatus[syncStatusService.GetCurrentStatus()]).toBe(SyncStatus[SyncStatus.SyncError], 'Sync status should have been updated');
        }));

    });

    describe('QueueUpload', () => {
        it('Should queue an upload if already initialized', fakeAsync(() => {
            spyOn(connect, 'getQuestionIds').and.callFake((state: ConnectInterface.Connect.Manifest) => {
                state.questionIds = 'Mocked answer';
                return Promise.resolve(state);
            });
            spyOn(connect, 'voteManyQuestionsFromJson').and.callFake((state: ConnectInterface.Connect.Manifest) => {
                return Promise.resolve(state);
            });

            let initState = null;
            throttler.Init(manifest).then((state) => {
                initState = state;
            });
            tick(1);
            expect(initState.questionIds).toEqual('Mocked answer');

            let emittedSyncSuccess = null;
            throttler.SyncEmitter.subscribe((state) => {
                emittedSyncSuccess = state;
            });

            throttler.QueueUpload(initState);
            expect(SyncStatus[syncStatusService.GetCurrentStatus()]).toBe(SyncStatus[SyncStatus.Syncing], 'Sync status should have been updated');

            tick(1);
            expect(emittedSyncSuccess).not.toBe(initState, 'The returned state should be a clone');
            expect(emittedSyncSuccess).toEqual(initState, 'The returned state should be equal to the input');
            expect(SyncStatus[syncStatusService.GetCurrentStatus()]).toBe(SyncStatus[SyncStatus.InSync], 'Sync status should have been updated');
            discardPeriodicTasks();
        }));

        it('Should initialize before uploading if not initialized', fakeAsync(() => {
            spyOn(connect, 'getQuestionIds').and.callFake((state: ConnectInterface.Connect.Manifest) => {
                state.questionIds = 'Mocked answer';
                return Promise.resolve(state);
            });
            spyOn(connect, 'voteManyQuestionsFromJson').and.callFake((state: ConnectInterface.Connect.Manifest) => {
                return Promise.resolve(state);
            });
            spyOn(throttler, 'Init').and.callThrough();

            let emittedSyncSuccess = null;
            throttler.SyncEmitter.subscribe((state) => {
                emittedSyncSuccess = state;
            });
            throttler.QueueUpload(manifest);
            expect(throttler.Init).toHaveBeenCalledTimes(1);

            tick(1);
            expect(emittedSyncSuccess).toEqual(manifest);
            expect(SyncStatus[syncStatusService.GetCurrentStatus()]).toBe(SyncStatus[SyncStatus.InSync], 'Sync status should have been updated');
            discardPeriodicTasks();
        }));

        it('Should terminate quickly if there is no connection and not initialized', fakeAsync(() => {
            spyOn(connect, 'getQuestionIds').and.callFake(() => {
                return Promise.reject(new Error('Mocked server error'));
            });
            spyOn(connect, 'voteManyQuestionsFromJson').and.callFake(() => {
                return Promise.reject(new Error('Shouldnt have been called'));
            });
            spyOn(throttler, 'Init').and.callThrough();

            throttler.QueueUpload(manifest);
            expect(throttler.Init).toHaveBeenCalledTimes(1);
            tick(1);

            expect(SyncStatus[syncStatusService.GetCurrentStatus()]).toBe(SyncStatus[SyncStatus.SyncError], 'Sync status should have been updated');
            expect(connect.voteManyQuestionsFromJson).not.toHaveBeenCalled();
            discardPeriodicTasks();
        }));

        it('Should only have one outstanding upload or init request at any given time', fakeAsync(() => {
            spyOn(connect, 'getQuestionIds').and.callFake((state: ConnectInterface.Connect.Manifest) => {
                state.questionIds = 'Mocked answer';
                return Promise.resolve(state);
            });
            spyOn(connect, 'voteManyQuestionsFromJson').and.callFake((state: ConnectInterface.Connect.Manifest) => {
                return new Promise((resolve) => { setTimeout(() => resolve(state), 1000); });
            });
            spyOn(throttler, 'Init').and.callThrough();

            let emittedSyncSuccess = null;
            throttler.SyncEmitter.subscribe((state) => {
                emittedSyncSuccess = state;
            });
            throttler.QueueUpload(manifest);
            throttler.QueueUpload(manifest);
            expect(throttler.Init).toHaveBeenCalledTimes(1);

            tick(1);
            expect(SyncStatus[syncStatusService.GetCurrentStatus()]).toBe(SyncStatus[SyncStatus.Syncing], 'Sync status should have been updated');
            expect(connect.voteManyQuestionsFromJson).toHaveBeenCalledTimes(1);

            tick(1001);
            expect(emittedSyncSuccess).toEqual(manifest);
            expect(SyncStatus[syncStatusService.GetCurrentStatus()]).toBe(SyncStatus[SyncStatus.Syncing], 'Sync status should have been updated');
            expect(connect.voteManyQuestionsFromJson).toHaveBeenCalledTimes(2);

            tick(1001);
            expect(SyncStatus[syncStatusService.GetCurrentStatus()]).toBe(SyncStatus[SyncStatus.InSync], 'Sync status should have been updated');

            expect(throttler.Init).toHaveBeenCalledTimes(1);
            discardPeriodicTasks();
        }));

        it('Should only send the difference between requests', fakeAsync(() => {
            spyOn(connect, 'getQuestionIds').and.callFake((state: ConnectInterface.Connect.Manifest) => {
                state.questionIds = 'Mocked answer';
                return Promise.resolve(state);
            });
            spyOn(connect, 'voteManyQuestionsFromJson').and.callFake((state: ConnectInterface.Connect.Manifest) => {
                return new Promise((resolve) => { setTimeout(() => resolve(state), 1000); });
            });
            spyOn(throttler, 'Init').and.callThrough();

            let emittedSyncSuccess = null;
            throttler.SyncEmitter.subscribe((state) => {
                emittedSyncSuccess = state;
            });


            // First request
            throttler.QueueUpload(manifest);
            expect(throttler.Init).toHaveBeenCalledTimes(1);
            const expectedFirstMergedManifestQuestions = JSON.parse(JSON.stringify(manifest.config.questionsToSend));

            tick(1);
            expect(SyncStatus[syncStatusService.GetCurrentStatus()]).toBe(SyncStatus[SyncStatus.Syncing], 'Sync status should have been updated');
            expect(connect.voteManyQuestionsFromJson).toHaveBeenCalledTimes(1);
            expect(connect.voteManyQuestionsFromJson).toHaveBeenCalledWith(manifest);

            tick(1001); // Wait for first request to resolve
            expect(emittedSyncSuccess.config.questionsToSend).toEqual(expectedFirstMergedManifestQuestions, 'The first emitted sync should be the whole object');

            expect(SyncStatus[syncStatusService.GetCurrentStatus()]).toBe(SyncStatus[SyncStatus.InSync], 'Sync status should have been updated');

            // Second request
            manifest.config.questionsToSend[0].responseText = 'New Response';
            throttler.QueueUpload(manifest);
            const expectedSecondMergedManifestQuestions = JSON.parse(JSON.stringify(manifest.config.questionsToSend));

            tick(1001); // Wait for second request to resolve
            expect(emittedSyncSuccess.config.questionsToSend).toEqual(expectedSecondMergedManifestQuestions, 'The second emitted sync should be the merged object');

            manifest.config.questionsToSend = manifest.config.questionsToSend.slice(0, 1);
            expect(connect.voteManyQuestionsFromJson).toHaveBeenCalledWith(manifest);
            expect(connect.voteManyQuestionsFromJson).toHaveBeenCalledTimes(2);

            expect(SyncStatus[syncStatusService.GetCurrentStatus()]).toBe(SyncStatus[SyncStatus.InSync], 'Sync status should have been updated');
            expect(throttler.Init).toHaveBeenCalledTimes(1);
            discardPeriodicTasks();
        }));

        it('Should emit errors on failure', fakeAsync(() => {
            spyOn(connect, 'getQuestionIds').and.callFake((state: ConnectInterface.Connect.Manifest) => {
                state.questionIds = 'Mocked answer';
                return Promise.resolve(state);
            });
            spyOn(connect, 'voteManyQuestionsFromJson').and.callFake(() => {
                return Promise.reject(new Error('Mocked server error'));
            });
            spyOn(throttler, 'Init').and.callThrough();

            let emittedError = null;
            throttler.ErrorEmitter.subscribe((err) => {
                emittedError = err;
            });

            throttler.QueueUpload(manifest);
            expect(throttler.Init).toHaveBeenCalledTimes(1);
            tick(1);

            expect(emittedError.message).toEqual('Mocked server error');
            expect(SyncStatus[syncStatusService.GetCurrentStatus()]).toBe(SyncStatus[SyncStatus.SyncError], 'Sync status should have been updated');
            discardPeriodicTasks();
        }));
    });

    describe('QueueDownload', () => {
        it('Should queue a download if already initialized', fakeAsync(() => {
            spyOn(connect, 'getQuestionIds').and.callFake((state: ConnectInterface.Connect.Manifest) => {
                state.questionIds = 'Mocked answer';
                return Promise.resolve(state);
            });
            spyOn(connect, 'getMyVotes').and.callFake((state: ConnectInterface.Connect.Manifest) => {
                state.votes = 'Mocked votes answer';
                return Promise.resolve(state);
            });

            let downloadStatus = null;
            syncStatusService.DownloadStatus.subscribe((status) => {
                downloadStatus = status;
            });

            let initState = null;
            throttler.Init(manifest).then((state) => {
                initState = state;
            });
            tick(1);
            expect(initState.questionIds).toEqual('Mocked answer');

            let downloadState = null;
            throttler.QueueDownload(initState).then((state) => {
                downloadState = state;
            });
            expect(SyncStatus[downloadStatus]).toBe(SyncStatus[SyncStatus.Syncing], 'Sync status should have been updated');

            tick(1);
            expect(downloadState.votes).toEqual('Mocked votes answer');
            expect(SyncStatus[downloadStatus]).toBe(SyncStatus[SyncStatus.InSync], 'Sync status should have been updated');
            discardPeriodicTasks();
        }));

        it('Should initialize before downloading if not initialized', fakeAsync(() => {
            spyOn(connect, 'getQuestionIds').and.callFake((state: ConnectInterface.Connect.Manifest) => {
                state.questionIds = 'Mocked answer';
                return Promise.resolve(state);
            });
            spyOn(connect, 'getMyVotes').and.callFake((state: ConnectInterface.Connect.Manifest) => {
                state.votes = 'Mocked votes answer';
                return Promise.resolve(state);
            });
            spyOn(throttler, 'Init').and.callThrough();
            let downloadStatus = null;
            syncStatusService.DownloadStatus.subscribe((status) => {
                downloadStatus = status;
            });

            let downloadState = null;
            throttler.QueueDownload(manifest).then((state) => {
                downloadState = state;
            });
            expect(throttler.Init).toHaveBeenCalledTimes(1);

            tick(1);
            expect(downloadState.votes).toEqual('Mocked votes answer');
            expect(SyncStatus[downloadStatus]).toBe(SyncStatus[SyncStatus.InSync], 'Sync status should have been updated');
            discardPeriodicTasks();
        }));

        it('Should terminate quickly if not initialized and there is no connection', fakeAsync(() => {
            spyOn(connect, 'getQuestionIds').and.callFake(() => {
                return Promise.reject(new Error('Mocked server error'));
            });
            spyOn(connect, 'getMyVotes').and.callFake(() => {
                return Promise.reject(new Error('Shouldnt have been called'));
            });
            spyOn(throttler, 'Init').and.callThrough();

            let downloadState = null;
            throttler.QueueDownload(manifest).then((state) => {
                downloadState = state;
            });
            expect(throttler.Init).toHaveBeenCalledTimes(1);
            tick(1);

            expect(SyncStatus[syncStatusService.GetCurrentStatus()]).toBe(SyncStatus[SyncStatus.SyncError], 'Sync status should have been updated');
            expect(connect.getMyVotes).not.toHaveBeenCalled();
            discardPeriodicTasks();
        }));

        it('Should emit errors when download fails', fakeAsync(() => {
            spyOn(connect, 'getQuestionIds').and.callFake((state: ConnectInterface.Connect.Manifest) => {
                state.questionIds = 'Mocked answer';
                return Promise.resolve(state);
            });
            spyOn(connect, 'getMyVotes').and.callFake(() => {
                return Promise.reject(new Error('Mocked server error'));
            });
            spyOn(throttler, 'Init').and.callThrough();

            let emittedError = null, downloadStatus = null;
            throttler.ErrorEmitter.subscribe((err) => {
                emittedError = err;
            });
            syncStatusService.DownloadStatus.subscribe((status) => {
                downloadStatus = status;
            });

            throttler.QueueDownload(manifest);
            expect(throttler.Init).toHaveBeenCalledTimes(1);
            tick(1);

            expect(emittedError.message).toEqual('Mocked server error');
            expect(SyncStatus[downloadStatus]).toBe(SyncStatus[SyncStatus.SyncError], 'Sync status should have been updated');
            discardPeriodicTasks();
        }));

        it('should gracefully handle exceptions', fakeAsync(() => {
            spyOn(connect, 'getQuestionIds').and.callFake((state: ConnectInterface.Connect.Manifest) => {
                state.questionIds = 'Mocked answer';
                return Promise.resolve(state);
            });
            spyOn(connect, 'voteManyQuestionsFromJson').and.callFake(() => {
                return Promise.reject(new Error('Mocked server error'));
            });
            spyOn(throttler, 'Init').and.callThrough();

            let emittedError = null;
            throttler.ErrorEmitter.subscribe((err) => {
                emittedError = err;
            });

            delete manifest.config; // This should make it throw.
            throttler.QueueUpload(manifest);
            expect(throttler.Init).toHaveBeenCalledTimes(1);
            tick(1);

            expect(emittedError.message).toEqual('undefined is not an object (evaluating \'stateCopy.config.questionsToSend\')');
            // expect(emittedError.message).toEqual('Cannot read property 'questionsToSend' of undefined');
            expect(SyncStatus[syncStatusService.GetCurrentStatus()]).toBe(SyncStatus[SyncStatus.SyncError], 'Sync status should have been updated');
            discardPeriodicTasks();
        }));


        it('update my votes', fakeAsync(() => {
            spyOn(connect, 'getQuestionIds').and.callFake((state: ConnectInterface.Connect.Manifest) => {
                state.questionIds = 'Mocked answer';
                return Promise.resolve(state);
            });
            throttler.Init(manifest);
            tick(1);
            const newState = {
                config: manifest.config,
                votes: {},
                questionIds: [12, 13, 14]
            };
            tick(2);
            const result = {
                votes: [{ QuestionId: 12, ResponseText: 'aanew' },
                { QuestionId: 13, ResponseText: 'bbnew' }]
            };
            tick(1);
            let downloadState = null;
            throttler.updateMyVotes(newState, result).then(neweststate => {
                downloadState = neweststate;
            });
            tick(1);
            expect(downloadState.votes[12]).toBe('aanew');
            expect(downloadState.votes[13]).toBe('bbnew');
            discardPeriodicTasks();
        }));

        it('update my foreman votes', fakeAsync(() => {
            spyOn(connect, 'getQuestionIds').and.callFake((state: ConnectInterface.Connect.Manifest) => {
                state.foremanQuestionIds = 'Mocked answer';
                return Promise.resolve(state);
            });
            throttler.Init(manifest);
            tick(1);
            const newState = {
                config: manifest.config,
                foremanvotes: {},
                foremanQuestionIds: [12, 13, 14]
            };
            tick(2);
            const result = {
                votes: [{ QuestionId: 12, ResponseText: 'aanew' },
                { QuestionId: 13, ResponseText: 'bbnew' }]
            };
            tick(1);
            let downloadState = null;
            throttler.updateMyForemanVotes(newState, result).then(neweststate => {
                downloadState = neweststate;
            });
            tick(1);
            expect(downloadState.foremanvotes[12]).toBe('aanew');
            expect(downloadState.foremanvotes[13]).toBe('bbnew');
            discardPeriodicTasks();
        }));
    });
});
