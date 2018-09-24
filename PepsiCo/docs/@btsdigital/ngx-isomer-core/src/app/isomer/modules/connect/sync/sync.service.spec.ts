import { SyncService } from './sync.service';
import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from '../httpwrapper/http-wrapper.service';
import { ConnectService } from '../lib/connect.service';
import { AuthenticationError } from '../authentication-error';
import { CalcService } from '../../calc/calc.service';
import { SyncStatusService } from '../sync/sync-status.service';
import { JsCalcConnectorService } from '../lib/jscalc-connector.service';
import { SyncStatus } from '../sync/syncstatus';
import { ManifestService } from '../../services/manifest/manifest.service';
import { EventEmitter } from '@angular/core';
import { discardPeriodicTasks, fakeAsync, tick, TestBed } from '@angular/core/testing';
import * as ConnectInterface from '../interfaces';
import { ConnectThrottlerService } from '../lib/connect-throttler.service';
import 'rxjs/add/operator/debounceTime';
import { SignalRWrapperService } from '../../services/signalrwrapper/signalr-wrapper.service';
// import { HttpWrapperServiceStub } from '../../../test/http-wrapper-service.stub';
import { SignalRWrapperServiceStub } from '../../../test/signalr-wrapper-service.stub';
import { Constants } from '../../../config/constants';

describe('SyncService Download', () => {
    let service: SyncService,
        manifestService: ManifestService,
        jscalcConnectorService: JsCalcConnectorService,
        calcService: CalcService,
        syncStatusService: SyncStatusService,
        angular2HttpWrapper: HttpWrapperService,
        throttler: ConnectThrottlerService,
        signalRWrapperService: SignalRWrapperService;

    const mockObservable: EventEmitter<any> = new EventEmitter(true);
    class CalcMock {
        getApi() {
            return Promise.resolve(CalcMock);
        }
        getValue(range, rawValue) {
            return 'Some Value';
        }
        setValue(range, value) {
            mockObservable.emit();
            return Promise.resolve();
        }
        getObservable() {
            return mockObservable;
        }
    }

    let httpGetAllQuestionsCounter = 0;
    class HttpWrapperServiceStub {
        postJson(relativeUrl: string, body: any): Promise<any> {
            switch (relativeUrl) {
                case '/Wizer/CloudFront/GetAllQuestions':
                    httpGetAllQuestionsCounter++;
                    return Promise.resolve([{ Id: 1337, ShortName: 'xxRBD1DBM2' }]);
                case '/Wizer/CloudFront/GetMyVotes':
                    return Promise.resolve({ success: true, votes: [{ QuestionId: 1337, ResponseText: 'Server response' }] });
                case '/Wizer/CloudFront/GetMyForemanVotes':
                    return Promise.resolve({ success: true, votes: [{ QuestionId: 1338, ResponseText: 'Server foreman response' }] });
                case '/Wizer/CloudFront/VoteManyQuestionsFromJson':
                    return Promise.resolve({ success: true });
                default:
                    return Promise.resolve({ success: true });
            }
        }
    }



    const manifestMock = {
        config: {
            hostName: 'NotARealHostname',
            eventTitle: 'TakedaBa2',
            questionsToSend: [
                { 'questionName': 'xxRBD1DBM2', 'rangeName': 'xxRBD1DBM2' },
            ],
            questionsToReceive: [
                { 'questionName': 'xxRBD1DBM2', 'rangeName': 'xxRBD1DBM2' },
            ],
            foremanquestionsToRecieve: null,
            trackQuestion: null,
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ManifestService, SyncStatusService,
                ConnectThrottlerService,
                { provide: CalcService, useClass: CalcMock },
                { provide: SignalRWrapperService, useClass: SignalRWrapperServiceStub },
                JsCalcConnectorService,
                { provide: HttpWrapperService, useClass: HttpWrapperServiceStub }]
        });
        manifestService = TestBed.get(ManifestService);
        manifestService.setConfig(manifestMock as ConnectInterface.Connect.Manifest);
        manifestService.SetState(manifestMock as ConnectInterface.Connect.Manifest);

        calcService = TestBed.get(CalcService);
        angular2HttpWrapper = TestBed.get(HttpWrapperService);
        syncStatusService = TestBed.get(SyncStatusService);

        throttler = new ConnectThrottlerService(new ConnectService(angular2HttpWrapper), syncStatusService);
        jscalcConnectorService = TestBed.get(JsCalcConnectorService);
        httpGetAllQuestionsCounter = 0;
        signalRWrapperService = TestBed.get(SignalRWrapperService);
    });

    it('Allows mocking of the manifest', fakeAsync(() => {
        manifestService.SetState(manifestMock as ConnectInterface.Connect.Manifest);
        expect(manifestService.Get().config.hostName).toBe('NotARealHostname');
    }));


    it('should get the latest values from the server on initialization', fakeAsync(() => {
        spyOn(angular2HttpWrapper, 'postJson').and.callThrough();
        expect(SyncStatus[syncStatusService.GetCurrentStatus()]).toBe(SyncStatus[SyncStatus.OutOfSync]);
        service = new SyncService(throttler, calcService, manifestService, jscalcConnectorService, signalRWrapperService);
        service.initializeSync();

        expect(angular2HttpWrapper.postJson).toHaveBeenCalledWith('/Wizer/CloudFront/GetAllQuestions', jasmine.anything());
        expect(angular2HttpWrapper.postJson).not.toHaveBeenCalledWith('/Wizer/CloudFront/GetMyVotes', jasmine.anything());
        expect(angular2HttpWrapper.postJson).not.toHaveBeenCalledWith('/Wizer/CloudFront/VoteManyQuestionsFromJson', jasmine.anything());

        tick(1);

        expect(angular2HttpWrapper.postJson).toHaveBeenCalledWith('/Wizer/CloudFront/GetMyVotes', jasmine.anything());

        tick(3001); // Debounce for model changes

        expect(angular2HttpWrapper.postJson).toHaveBeenCalledWith('/Wizer/CloudFront/VoteManyQuestionsFromJson', jasmine.anything());

        expect(SyncStatus[syncStatusService.GetCurrentStatus()]).toBe(SyncStatus[SyncStatus.InSync]);

        expect(httpGetAllQuestionsCounter).toBe(1, 'GetAllQuestions should only be called once');
        discardPeriodicTasks();
    }));

    it('should call download at 30 second intervals', fakeAsync(() => {
        service = new SyncService(throttler, calcService, manifestService, jscalcConnectorService, signalRWrapperService);
        service.initializeSync();
        spyOn(service, 'Download').and.callThrough();

        tick(1);
        expect(service.Download).toHaveBeenCalledTimes(1);

        tick(30001);
        expect(service.Download).toHaveBeenCalledTimes(2);

        tick(30001);
        expect(service.Download).toHaveBeenCalledTimes(3);

        discardPeriodicTasks();
    }));


    it('When getting errors on initialization, should respond properly', fakeAsync(() => {
        spyOn(angular2HttpWrapper, 'postJson').and.callFake(() => Promise.resolve({ success: false, errCode: 'Mock Error', errMsg: 'Mock Error' }));

        service = new SyncService(throttler, calcService, manifestService, jscalcConnectorService, signalRWrapperService);
        service.initializeSync();
        spyOn(service, 'Download').and.callThrough();
        tick(1);
        expect(service.Download).toHaveBeenCalledTimes(0);
        discardPeriodicTasks();
    }));

    it('Clear the cookies and reload page', fakeAsync(() => {
        spyOn(SyncService, 'reloadWindow');
        service = new SyncService(throttler, calcService, manifestService, jscalcConnectorService, signalRWrapperService);
        service.initializeSync();
        document.cookie = 'name=oeschger;expires=Thu, 06 Jan 2070 00:00:00 UTC';
        expect(document.cookie).toBe('name=oeschger');
        manifestService.SetState(manifestMock as ConnectInterface.Connect.Manifest);
        expect(manifestService.Get().config.hostName).toBe('NotARealHostname');
        SyncService.handleSyncErrors(new AuthenticationError({ err: 'Invalid username' }));
        tick(1);
        expect(document.cookie).toBe('');
        expect(SyncService.reloadWindow).toHaveBeenCalled();
        discardPeriodicTasks();
    }));

    it('disable/enable connect to pulse - myvotechnged', fakeAsync(() => {
        spyOn(signalRWrapperService, 'disablePush');
        service = new SyncService(throttler, calcService, manifestService, jscalcConnectorService, signalRWrapperService);
        service.initializeSync();
        manifestService.SetState(manifestMock as ConnectInterface.Connect.Manifest);
        expect(manifestService.Get().config.hostName).toBe('NotARealHostname');
        tick(1);
        service.disableConnectToPulse();
        service.setMode(Constants.CONNECTION_MODE.POLL);
        expect(signalRWrapperService.disablePush).toHaveBeenCalled();
        spyOn(signalRWrapperService, 'enablePush');
        spyOn(jscalcConnectorService, 'writeValues');
        spyOn(signalRWrapperService, 'subscribeForMyVoteChanged').and.callFake(() => Observable.of({ 'EventName': 'MyVoteChanged', 'TargetParticipationId': 11 }));
        const newObj = {
            config: manifestMock,
            participantId: 11
        };
        spyOn(throttler, 'updateMyVotes').and.callFake(() => Promise.resolve(newObj));
        spyOn(throttler, 'QueueDownload').and.callFake(() => Promise.resolve(newObj));
        service.setMode(Constants.CONNECTION_MODE.PUSH);
        tick(1);
        expect(signalRWrapperService.enablePush).toHaveBeenCalledTimes(1);
        expect(throttler.QueueDownload).toHaveBeenCalledTimes(1);
        expect(signalRWrapperService.subscribeForMyVoteChanged).toHaveBeenCalledTimes(1);
        expect(throttler.updateMyVotes).toHaveBeenCalledTimes(1);
        expect(jscalcConnectorService.writeValues).toHaveBeenCalledTimes(2);
        discardPeriodicTasks();
    }));

    it('disable/enable connect to pulse - myforemanvotechnged', fakeAsync(() => {
        spyOn(signalRWrapperService, 'disablePush');
        service = new SyncService(throttler, calcService, manifestService, jscalcConnectorService, signalRWrapperService);
        service.initializeSync();
        manifestService.SetState(manifestMock as ConnectInterface.Connect.Manifest);
        expect(manifestService.Get().config.hostName).toBe('NotARealHostname');
        tick(1);
        spyOn(signalRWrapperService, 'enablePush');
        spyOn(jscalcConnectorService, 'writeValues');
        spyOn(signalRWrapperService, 'subscribeForMyVoteChanged').and.callFake(() => Observable.of({ 'EventName': 'MyVoteChanged', 'TargetParticipationId': 12 }));
        const newObj1 = {
            config: manifestMock,
            foremanId: 12
        };
        spyOn(throttler, 'updateMyForemanVotes').and.callFake(() => Promise.resolve(newObj1));
        spyOn(throttler, 'QueueDownload').and.callFake(() => Promise.resolve(newObj1));
        service.setMode(Constants.CONNECTION_MODE.PUSH);
        tick(1);
        expect(signalRWrapperService.enablePush).toHaveBeenCalledTimes(1);
        expect(throttler.QueueDownload).toHaveBeenCalledTimes(1);
        expect(signalRWrapperService.subscribeForMyVoteChanged).toHaveBeenCalledTimes(1);
        expect(throttler.updateMyForemanVotes).toHaveBeenCalledTimes(1);
        expect(jscalcConnectorService.writeValues).toHaveBeenCalledTimes(2);
        discardPeriodicTasks();
    }));
});
