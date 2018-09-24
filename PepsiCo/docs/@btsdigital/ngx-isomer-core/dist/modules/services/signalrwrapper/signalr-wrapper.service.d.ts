import { EventEmitter } from '@angular/core';
import { SignalRService, SignalRServiceConfig } from '@btsdigital/pulsesignalr';
import { LoggerService } from '../logger/logger.service';
export declare class SignalRWrapperService {
    private signalR;
    private logger;
    /**
     * local variable which stores if the application is in pull or push mode
     */
    private usePush;
    /**
     * local varibale which stores the subscription to a signalR function
     */
    private signalRsubscription;
    /**
    * Constructor for the service
    *
    * @param {SignalRService} signalR Instance of SignalRService
    *
    * @param {LoggerService} logger Instance of LoggerService
    */
    constructor(signalR: SignalRService, logger: LoggerService);
    /**
     * This function initialises the signalR connection
     * @param participantId The id of the participant in backend
     * @param signalRServiceConfig The config of signalR containing the hostname etc
     */
    init(participantId: string, signalRServiceConfig: SignalRServiceConfig): Promise<any>;
    /**
     * This function will disable the push functionality during init
     */
    disablePush(): void;
    /**
     * This function will enable the push functionality during init
     */
    enablePush(): void;
    /**
     *
     * This function helps us to subscribe for my event changed.
     * Once we subscribe we get a callback when my vote is changed for the list of questions i am listening for
     */
    subscribeForMyVoteChanged(): EventEmitter<any>;
}
