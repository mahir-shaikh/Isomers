import { EventEmitter } from '@angular/core';
import { ChannelEvent, Channels, ChannelEventName } from '../common/classes/channelevent';
import 'jquery/dist/jquery.min';
export declare class SignalRService {
    private userId;
    private hubUrl;
    private proxy;
    private proxyName;
    private connection;
    private observable;
    private connectionStartPromise;
    private startConnectionPromise;
    eventmessageReceived: EventEmitter<any>;
    groupmessageReceived: EventEmitter<any>;
    clientmessageReceived: EventEmitter<any>;
    connectionEstablished: EventEmitter<Boolean>;
    connectionExists: Boolean;
    private hostname;
    private serviceUrl;
    constructor();
    initialiseConnection(): Promise<any>;
    subscribe(): EventEmitter<any>;
    subscribeToChannel(channelName: Channels): EventEmitter<any>;
    subscribeToEvent(eventName: ChannelEventName): EventEmitter<any>;
    unSubscribe(): void;
    unSubscribeFromChannel(channelName: Channels): void;
    unSubscribeFromEvent(eventName: ChannelEventName): void;
    publish(channelEvent: ChannelEvent): void;
    publishToClient(channelEvent: ChannelEvent): void;
    publishToChannel(channelEvent: ChannelEvent): void;
    publishToEvent(channelEvent: ChannelEvent, targetParticipantId: number): void;
    private startConnection();
    private registerOnServerEvents();
    configureSignalRService(configuration: SignalRServiceConfig): void;
    setUser(userId: string): void;
}
export interface SignalRServiceConfig {
    hostname: string;
    serviceUrl: string;
}
