import { SyncService } from './sync.service';
import {Angular2HttpWrapper} from "./angular2HttpWrapper";
import {Connect} from "./connect";
import {CalcService} from "../calcmodule/calc.service";
import {SyncStatus, SyncStatusService} from "./syncStatus.service";
import {ManifestService} from "./manifest.service";
import {ConfigService} from "./config.service";
import {EventEmitter} from "@angular/core";
import {discardPeriodicTasks, fakeAsync, tick} from '@angular/core/testing';
import Manifest = Connect.Manifest;
import ConnectThrottlerService from "./connect-throttler.service";

describe('SyncService Download', () => {
    let service: SyncService,
        manifestService: ManifestService,
        calcService: CalcService,
        syncStatusService: SyncStatusService,
        angular2HttpWrapper: Angular2HttpWrapper,
        throttler: ConnectThrottlerService,
        configService: ConfigService;

    let mockObservable:EventEmitter<any> = new EventEmitter(true);
    const calcMock = {
        getApi: () => {
            return Promise.resolve(calcMock);
        },
        getValue: (range, rawValue) => {
            return 'Some Value';
        },
        setValue: (range, value) => {
            mockObservable.emit();
            return Promise.resolve();
        },
        getObservable: () => {
            return mockObservable;
        }
    };

    let httpGetAllQuestionsCounter = 0;
    const httpMock = {
        postJson: (url, body) => {
            switch(url) {
                case '/Wizer/CloudFront/GetAllQuestions':
                    httpGetAllQuestionsCounter++;
                    return Promise.resolve([{Id: 1337, ShortName: "xxRBD1DBM2"}]);
                case '/Wizer/CloudFront/GetMyVotes':
                    return Promise.resolve({ success: true, votes: [{QuestionId: 1337, ResponseText:"Server response"}]});
                case '/Wizer/CloudFront/VoteManyQuestionsFromJson':
                    return Promise.resolve({ success: true });
                default:
                    return Promise.resolve({ success: true });
            }
        }
    };
    const configMock = {
        CONNECT_TO_PULSE: true
    };

    let manifestMock = {
        config: {
            hostName: "NotARealHostname",
            eventTitle: 'TakedaBa2',
            questionsToSend: [
                {"questionName": "xxRBD1DBM2", "rangeName": "xxRBD1DBM2"},
            ],
            questionsToReceive: [
                {"questionName": "xxRBD1DBM2", "rangeName": "xxRBD1DBM2"},
            ]
        }
    };

    beforeEach(() => {
        manifestService = new ManifestService();
        syncStatusService = new SyncStatusService();

        calcService = calcMock as CalcService;
        angular2HttpWrapper = httpMock as Angular2HttpWrapper;
        configService = configMock as ConfigService;
        throttler = new ConnectThrottlerService(new Connect(angular2HttpWrapper), syncStatusService);

        httpGetAllQuestionsCounter = 0;
        manifestService.SetState(manifestMock as Manifest);
    });

    it('Allows mocking of the manifest', fakeAsync(() => {
        manifestService.SetState(manifestMock as Manifest);
        expect(manifestService.Get().config.hostName).toBe("NotARealHostname");
    }));

    it('should get the latest values from the server on initialization', fakeAsync(() => {
        spyOn(angular2HttpWrapper, 'postJson').and.callThrough();
        expect(SyncStatus[syncStatusService.GetCurrentStatus()]).toBe(SyncStatus[SyncStatus.OutOfSync]);
        service = new SyncService(throttler, calcService, manifestService, configService);

        expect(angular2HttpWrapper.postJson).toHaveBeenCalledWith('/Wizer/CloudFront/GetAllQuestions', jasmine.anything());
        expect(angular2HttpWrapper.postJson).not.toHaveBeenCalledWith('/Wizer/CloudFront/GetMyVotes', jasmine.anything());
        expect(angular2HttpWrapper.postJson).not.toHaveBeenCalledWith('/Wizer/CloudFront/VoteManyQuestionsFromJson', jasmine.anything());

        tick(1);

        expect(angular2HttpWrapper.postJson).toHaveBeenCalledWith('/Wizer/CloudFront/GetMyVotes', jasmine.anything());

        tick(3001); //Debounce for model changes

        expect(angular2HttpWrapper.postJson).toHaveBeenCalledWith('/Wizer/CloudFront/VoteManyQuestionsFromJson', jasmine.anything());

        expect(SyncStatus[syncStatusService.GetCurrentStatus()]).toBe(SyncStatus[SyncStatus.InSync]);

        expect(httpGetAllQuestionsCounter).toBe(1, "GetAllQuestions should only be called once");
        discardPeriodicTasks();
    }));

    it('should call download at 30 second intervals', fakeAsync(() => {
        service = new SyncService(throttler, calcService, manifestService, configService);
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
        spyOn(angular2HttpWrapper, 'postJson').and.callFake(() => Promise.resolve({success: false, errCode: "Mock Error", errMsg:"Mock Error"}));

        service = new SyncService(throttler, calcService, manifestService, configService);
        spyOn(service, 'Download').and.callThrough();
        tick(1);
        expect(service.Download).toHaveBeenCalledTimes(0);
        discardPeriodicTasks();
    }));
});