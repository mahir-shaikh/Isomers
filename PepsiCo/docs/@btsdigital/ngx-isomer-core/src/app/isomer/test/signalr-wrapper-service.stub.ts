import { Injectable, transition, EventEmitter } from '@angular/core';
import * as ConnectInterface from '../modules/connect/interfaces';
import { SignalRServiceConfig } from '@btsdigital/pulsesignalr';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { Subscription } from 'rxjs/Subscription';

export class SignalRWrapperServiceStub {
    private usePush: boolean = true;
    private dlSubscription: Subscription;
    private emitter: EventEmitter<any>;

    init(participantId: string, signalRServiceConfig: SignalRServiceConfig): Promise<any> {
        return Promise.resolve(true);
    }

    disablePush(): void {
        this.usePush = false;
    }

    enablePush(): void {
        this.usePush = true;
    }


    subscribeForMyVoteChanged(state: ConnectInterface.Connect.Manifest): EventEmitter<any> {
        this.emitter = new EventEmitter();
        this.dlSubscription = new IntervalObservable(1000).subscribe(this.dummyData);
        return this.emitter;
    }

    dummyData() {
        return {
            'EventName' : 'MyVoteChanged',
            'TargetParticipationId' : 11,
        };
    }
}
