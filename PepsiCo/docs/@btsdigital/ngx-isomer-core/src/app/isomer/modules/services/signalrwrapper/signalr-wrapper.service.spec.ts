import { TestBed, inject, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';

import { SignalRWrapperService } from './signalr-wrapper.service';
import { LoggerService } from '../logger/logger.service';
import { SignalRService } from '@btsdigital/pulsesignalr';
import { SignalRServiceStub } from '../../../test/signalr-service.stub';

let participantId: string;

describe('SignalRWrapperService', () => {
    let signalRService: SignalRService,
        signalRWrapperService: SignalRWrapperService,
        loggerService: LoggerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LoggerService, { provide: SignalRService, useClass: SignalRServiceStub }, SignalRWrapperService]
        });
        signalRService = TestBed.get(SignalRService);
        signalRWrapperService = TestBed.get(SignalRWrapperService);
        loggerService = TestBed.get(LoggerService);
        participantId = '251';
    });

    it('should be created', fakeAsync(() => {
        expect(signalRService).toBeTruthy();
        expect(signalRWrapperService).toBeTruthy();
    }));

    it('should init Participants', fakeAsync(() => {
        spyOn(signalRService, 'initialiseConnection');
        signalRWrapperService.init(participantId, { hostname: 'someserver.dmain.com', serviceUrl: 'https://someurl/PulseServices' });
        expect(signalRService.initialiseConnection).toHaveBeenCalled();
        signalRWrapperService.disablePush();
        signalRWrapperService.enablePush();
    }));

    it('should init Participants with invalid pid', fakeAsync(() => {
        spyOn(signalRService, 'initialiseConnection');
        spyOn(loggerService, 'log');
        expect(function () {
            signalRWrapperService.init(null, { hostname: 'someserver.dmain.com', serviceUrl: 'https://someurl/PulseServices' });
        }).toThrow(new Error('Invalid participant Id. Hence cannot initialise signalR connection'));
        expect(signalRService.initialiseConnection).not.toHaveBeenCalledWith('Invalid participant Id. Hence cannot initialise signalR connection');
        expect(loggerService.log).toHaveBeenCalled();
        signalRWrapperService.enablePush();
    }));

    it('subscribe for my vote changed', fakeAsync(() => {
        // const spy = spyOnProperty(signalRService, 'connectionExists', 'get').and.returnValue(true);
        spyOn(signalRService, 'subscribeToEvent');
        signalRWrapperService.subscribeForMyVoteChanged();
        tick(1);
        // expect(spy).toBe(true);
        expect(signalRService.subscribeToEvent).toHaveBeenCalled();
        discardPeriodicTasks();
    }));
});
