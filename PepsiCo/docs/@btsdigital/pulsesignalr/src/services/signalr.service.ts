// import the packages  
import { Injectable, EventEmitter } from '@angular/core';
import { ChannelEvent, Channels, ChannelEventName, MessageFor } from '../common/classes/channelevent';
import { Observable, Observer } from 'rxjs/Rx';
//import { AuthenticationService } from 'pulseauthenticate';

import 'jquery/dist/jquery.min';
// declare the global variables  
declare var jQuery_1_6_4: any;
declare var require: any;

@Injectable()
export class SignalRService {
    // Declare the variables 

    private userId: string = '0';
    private hubUrl: string = '';
    private proxy: any;
    private proxyName: string = 'PulseServicesHub';
    private connection: any;
    private observable: Promise<any>;
    private connectionStartPromise: Promise<any>;
    private startConnectionPromise: Promise<any>;
    // create the Event Emitter  
    public eventmessageReceived: EventEmitter<any>;
    public groupmessageReceived: EventEmitter<any>;
    public clientmessageReceived: EventEmitter<any>;

    public connectionEstablished: EventEmitter<Boolean>;
    public connectionExists: Boolean;
    private hostname: string = "http://localhost";
    private serviceUrl: string = "http://localhost/PulseServices/";

    constructor() {
        //var vlu = this.config.value;
        //this.hubUrl = vlu.serviceUrl;
        //if (this.authenticationService.getAuthenticationObject())
        //this.userId = this.authenticationService.getAuthenticationObject().id;
        const signalRPlugin = require("./assets/js/jquery.signalR.js");
    }

    public initialiseConnection() {

        if (this.startConnectionPromise) {
            return this.startConnectionPromise;
        }
        else {
            this.startConnectionPromise = new Promise<boolean>((resolve, reject) => {
                //this.config.load().subscribe(r => {
                //this.config.value = r.json();

                // Constructor initialization  
                this.connectionEstablished = new EventEmitter<Boolean>();
                this.eventmessageReceived = new EventEmitter<any>();
                this.groupmessageReceived = new EventEmitter<any>();
                this.clientmessageReceived = new EventEmitter<any>();

                this.connectionExists = false;
                // create hub connection  
                //this.connection = $.hubConnection(SignalRService.serviceUrl);
                this.connection = jQuery_1_6_4.hubConnection();
                // create new proxy as name already given in top 
                this.connection.url = this.serviceUrl + '/signalR/';
                this.proxy = this.connection.createHubProxy(this.proxyName);
                // register on server events  
                this.registerOnServerEvents();
                // call the connecion start method to start the connection to send and receive events.  
                this.startConnection().then(() => {
                    resolve(true);
                });
                //});
            });

            return this.startConnectionPromise;
        }
    }
    // method to hit from client  
    public subscribe() {
        // server side hub method using proxy.invoke with method name pass as param  
        if (this.proxy && this.proxy.invoke) {
            this.proxy.invoke('Subscribe', this.userId);
            return this.clientmessageReceived;
        }
        else
            return new EventEmitter<any>();
    }

    public subscribeToChannel(channelName: Channels) {
        var evnt: ChannelEvent = new ChannelEvent();
        evnt.ChannelName = Channels[channelName];
        evnt.InvokedByParticipationId = parseInt(this.userId);
        this.proxy.invoke('SubscribeToChannel', evnt);
        return this.groupmessageReceived;
    }

    public subscribeToEvent(eventName: ChannelEventName) {
        var evnt: ChannelEvent = new ChannelEvent();
        evnt.EventName = ChannelEventName[eventName];
        evnt.InvokedByParticipationId = parseInt(this.userId);
        if (this.proxy && this.proxy.invoke)
            this.proxy.invoke('SubscribeToEvent', evnt);
        return this.eventmessageReceived;
    }

    public unSubscribe() {
        if (this.proxy && this.proxy.invoke) {
            // server side hub method using proxy.invoke with method name pass as param  
            this.proxy.invoke('Unsubscribe', this.userId);
        }
    }

    public unSubscribeFromChannel(channelName: Channels) {
        var evnt: ChannelEvent = new ChannelEvent();
        evnt.EventName = Channels[channelName];
        evnt.InvokedByParticipationId = parseInt(this.userId);
        this.proxy.invoke('UnsubscribeFromChannel', evnt);
    }

    public unSubscribeFromEvent(eventName: ChannelEventName) {
        if (this.proxy && this.proxy.invoke) {
            var evnt: ChannelEvent = new ChannelEvent();
            evnt.EventName = ChannelEventName[eventName];
            evnt.InvokedByParticipationId = parseInt(this.userId);
            this.proxy.invoke('UnsubscribeFromEvent', evnt);
        }
    }


    public publish(channelEvent: ChannelEvent) {
        channelEvent.InvokedByParticipationId = parseInt(this.userId);
        this.proxy.invoke('Publish', channelEvent);
    }

    public publishToClient(channelEvent: ChannelEvent) {
        channelEvent.InvokedByParticipationId = parseInt(this.userId);
        this.proxy.invoke('PublishToClient', channelEvent);
    }

    public publishToChannel(channelEvent: ChannelEvent) {
        channelEvent.InvokedByParticipationId = parseInt(this.userId);
        this.proxy.invoke('PublishToChannel', channelEvent);
    }

    public publishToEvent(channelEvent: ChannelEvent, targetParticipantId: number) {
        channelEvent.InvokedByParticipationId = parseInt(this.userId);
        channelEvent.TargetParticipationId = targetParticipantId;
        this.proxy.invoke('PublishToEvent', channelEvent);
    }
    // check in the browser console for either signalr connected or not  
    private startConnection(): Promise<any> {

        this.connectionStartPromise = this.connection.start({ transport: ['webSockets', 'longPolling'] }).done((data: any) => {
            console.log('Now connected ' + data.transport.name + ', connection ID= ' + data.id);
            this.connectionEstablished.emit(true);
            this.connectionExists = true;
            this.subscribe();
        }).fail((error: any) => {
            console.log('Could not connect ' + error);
            this.connectionEstablished.emit(false);
        });

        return this.connectionStartPromise;
    }
    private registerOnServerEvents(): void {

        this.proxy.on('OnEvent', (data: any) => {
            console.log('received from SignalRService: ' + JSON.stringify(data));
            if (data.For == MessageFor[MessageFor.Event])
                this.eventmessageReceived.emit(data);
            else if (data.For == MessageFor[MessageFor.Group])
                this.groupmessageReceived.emit(data);
            else if (data.For == MessageFor[MessageFor.Client])
                this.clientmessageReceived.emit(data);
        });
    }

    public configureSignalRService(configuration: SignalRServiceConfig) {
        this.hostname = configuration.hostname;
        this.serviceUrl = configuration.serviceUrl;
    }

    public setUser(userId: string) {
        this.userId = userId;
    }
}

export interface SignalRServiceConfig {
    hostname: string,
    serviceUrl: string
}
