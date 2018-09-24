import { Injectable, transition, EventEmitter } from '@angular/core';
import { SignalRService, SignalRServiceConfig } from '@btsdigital/pulsesignalr';
import { LoggerService } from '../logger/logger.service';
import { ChannelEventName } from '@btsdigital/pulseutilities';
import * as ConnectInterface from '../../connect/interfaces';
import { ChannelEvent } from '@btsdigital/pulseutilities/dist/app/common/classes/channelevent';

/*
* This service is responsible for maintaining a signalR connection via websockets to the pulse backend
* This will enable it to listen for any pushes from the server
*/
@Injectable()
export class SignalRWrapperService {
    /**
     * local variable which stores if the application is in pull or push mode
     */
    private usePush: boolean = true;
    /**
     * local varibale which stores the subscription to a signalR function
     */
    private signalRsubscription: any;

    /**
    * Constructor for the service
    *
    * @param {SignalRService} signalR Instance of SignalRService
    *
    * @param {LoggerService} logger Instance of LoggerService
    */
    constructor(private signalR: SignalRService, private logger: LoggerService) {
    }

    /**
     * This function initialises the signalR connection
     * @param participantId The id of the participant in backend
     * @param signalRServiceConfig The config of signalR containing the hostname etc
     */
    init(participantId: string, signalRServiceConfig: SignalRServiceConfig): Promise<any> {
        if (participantId != null && this.usePush) {
            this.signalR.setUser(participantId);
            this.signalR.configureSignalRService(signalRServiceConfig);
            try {
                return this.signalR.initialiseConnection();
            } catch (ex) {
                this.logger.log(ex);
                return Promise.resolve({ success: false });
            }
        } else {
            this.logger.log('Invalid participant Id. Hence cannot initialise signalR connection');
            throw new Error('Invalid participant Id. Hence cannot initialise signalR connection');
        }
    }

    /**
     * This function will disable the push functionality during init
     */
    disablePush(): void {
        this.usePush = false;
    }

    /**
     * This function will enable the push functionality during init
     */
    enablePush(): void {
        this.usePush = true;
    }

    /**
     *
     * This function helps us to subscribe for my event changed.
     * Once we subscribe we get a callback when my vote is changed for the list of questions i am listening for
     */
    subscribeForMyVoteChanged(): EventEmitter<any> {
        if (this.signalR && this.signalR.connectionExists) {
            this.signalRsubscription = this.signalR.subscribeToEvent(ChannelEventName.MyVoteChanged);
        }
        return this.signalRsubscription;
    }
}
