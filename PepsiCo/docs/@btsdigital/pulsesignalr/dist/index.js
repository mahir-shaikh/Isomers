import { EventEmitter, Injectable, NgModule } from '@angular/core';

var ChannelEvent = (function () {
    function ChannelEvent() {
        this.TargetParticipationId = 0;
    }
    return ChannelEvent;
}());
var ChannelEventName;
(function (ChannelEventName) {
    ChannelEventName[ChannelEventName["DDNewAction"] = 0] = "DDNewAction";
    ChannelEventName[ChannelEventName["Help"] = 1] = "Help";
    ChannelEventName[ChannelEventName["ParticipantActionSubmit"] = 2] = "ParticipantActionSubmit";
    ChannelEventName[ChannelEventName["MyVoteChanged"] = 3] = "MyVoteChanged";
})(ChannelEventName || (ChannelEventName = {}));
var Channels;
(function (Channels) {
    Channels[Channels["GroupDirector"] = 0] = "GroupDirector";
    Channels[Channels["Participants"] = 1] = "Participants";
})(Channels || (Channels = {}));
var MessageFor;
(function (MessageFor) {
    MessageFor[MessageFor["Client"] = 0] = "Client";
    MessageFor[MessageFor["Group"] = 1] = "Group";
    MessageFor[MessageFor["Event"] = 2] = "Event";
})(MessageFor || (MessageFor = {}));

// import the packages  
//import { AuthenticationService } from 'pulseauthenticate';
var SignalRService = (function () {
    function SignalRService() {
        // Declare the variables 
        this.userId = '0';
        this.hubUrl = '';
        this.proxyName = 'PulseServicesHub';
        this.hostname = "http://localhost";
        this.serviceUrl = "http://localhost/PulseServices/";
        //var vlu = this.config.value;
        //this.hubUrl = vlu.serviceUrl;
        //if (this.authenticationService.getAuthenticationObject())
        //this.userId = this.authenticationService.getAuthenticationObject().id;
        var signalRPlugin = require("./assets/js/jquery.signalR.js");
    }
    SignalRService.prototype.initialiseConnection = function () {
        var _this = this;
        if (this.startConnectionPromise) {
            return this.startConnectionPromise;
        }
        else {
            this.startConnectionPromise = new Promise(function (resolve, reject) {
                //this.config.load().subscribe(r => {
                //this.config.value = r.json();
                // Constructor initialization  
                _this.connectionEstablished = new EventEmitter();
                _this.eventmessageReceived = new EventEmitter();
                _this.groupmessageReceived = new EventEmitter();
                _this.clientmessageReceived = new EventEmitter();
                _this.connectionExists = false;
                // create hub connection  
                //this.connection = $.hubConnection(SignalRService.serviceUrl);
                _this.connection = jQuery_1_6_4.hubConnection();
                // create new proxy as name already given in top 
                _this.connection.url = _this.serviceUrl + '/signalR/';
                _this.proxy = _this.connection.createHubProxy(_this.proxyName);
                // register on server events  
                _this.registerOnServerEvents();
                // call the connecion start method to start the connection to send and receive events.  
                _this.startConnection().then(function () {
                    resolve(true);
                });
                //});
            });
            return this.startConnectionPromise;
        }
    };
    // method to hit from client  
    SignalRService.prototype.subscribe = function () {
        // server side hub method using proxy.invoke with method name pass as param  
        if (this.proxy && this.proxy.invoke) {
            this.proxy.invoke('Subscribe', this.userId);
            return this.clientmessageReceived;
        }
        else
            return new EventEmitter();
    };
    SignalRService.prototype.subscribeToChannel = function (channelName) {
        var evnt = new ChannelEvent();
        evnt.ChannelName = Channels[channelName];
        evnt.InvokedByParticipationId = parseInt(this.userId);
        this.proxy.invoke('SubscribeToChannel', evnt);
        return this.groupmessageReceived;
    };
    SignalRService.prototype.subscribeToEvent = function (eventName) {
        var evnt = new ChannelEvent();
        evnt.EventName = ChannelEventName[eventName];
        evnt.InvokedByParticipationId = parseInt(this.userId);
        if (this.proxy && this.proxy.invoke)
            this.proxy.invoke('SubscribeToEvent', evnt);
        return this.eventmessageReceived;
    };
    SignalRService.prototype.unSubscribe = function () {
        if (this.proxy && this.proxy.invoke) {
            // server side hub method using proxy.invoke with method name pass as param  
            this.proxy.invoke('Unsubscribe', this.userId);
        }
    };
    SignalRService.prototype.unSubscribeFromChannel = function (channelName) {
        var evnt = new ChannelEvent();
        evnt.EventName = Channels[channelName];
        evnt.InvokedByParticipationId = parseInt(this.userId);
        this.proxy.invoke('UnsubscribeFromChannel', evnt);
    };
    SignalRService.prototype.unSubscribeFromEvent = function (eventName) {
        if (this.proxy && this.proxy.invoke) {
            var evnt = new ChannelEvent();
            evnt.EventName = ChannelEventName[eventName];
            evnt.InvokedByParticipationId = parseInt(this.userId);
            this.proxy.invoke('UnsubscribeFromEvent', evnt);
        }
    };
    SignalRService.prototype.publish = function (channelEvent) {
        channelEvent.InvokedByParticipationId = parseInt(this.userId);
        this.proxy.invoke('Publish', channelEvent);
    };
    SignalRService.prototype.publishToClient = function (channelEvent) {
        channelEvent.InvokedByParticipationId = parseInt(this.userId);
        this.proxy.invoke('PublishToClient', channelEvent);
    };
    SignalRService.prototype.publishToChannel = function (channelEvent) {
        channelEvent.InvokedByParticipationId = parseInt(this.userId);
        this.proxy.invoke('PublishToChannel', channelEvent);
    };
    SignalRService.prototype.publishToEvent = function (channelEvent, targetParticipantId) {
        channelEvent.InvokedByParticipationId = parseInt(this.userId);
        channelEvent.TargetParticipationId = targetParticipantId;
        this.proxy.invoke('PublishToEvent', channelEvent);
    };
    // check in the browser console for either signalr connected or not  
    SignalRService.prototype.startConnection = function () {
        var _this = this;
        this.connectionStartPromise = this.connection.start({ transport: ['webSockets', 'longPolling'] }).done(function (data) {
            console.log('Now connected ' + data.transport.name + ', connection ID= ' + data.id);
            _this.connectionEstablished.emit(true);
            _this.connectionExists = true;
            _this.subscribe();
        }).fail(function (error) {
            console.log('Could not connect ' + error);
            _this.connectionEstablished.emit(false);
        });
        return this.connectionStartPromise;
    };
    SignalRService.prototype.registerOnServerEvents = function () {
        var _this = this;
        this.proxy.on('OnEvent', function (data) {
            console.log('received from SignalRService: ' + JSON.stringify(data));
            if (data.For == MessageFor[MessageFor.Event])
                _this.eventmessageReceived.emit(data);
            else if (data.For == MessageFor[MessageFor.Group])
                _this.groupmessageReceived.emit(data);
            else if (data.For == MessageFor[MessageFor.Client])
                _this.clientmessageReceived.emit(data);
        });
    };
    SignalRService.prototype.configureSignalRService = function (configuration) {
        this.hostname = configuration.hostname;
        this.serviceUrl = configuration.serviceUrl;
    };
    SignalRService.prototype.setUser = function (userId) {
        this.userId = userId;
    };
    return SignalRService;
}());
SignalRService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
SignalRService.ctorParameters = function () { return []; };

var SignalRModule = (function () {
    function SignalRModule() {
    }
    return SignalRModule;
}());
SignalRModule.decorators = [
    { type: NgModule, args: [{
                imports: [],
                exports: [],
                declarations: [],
                providers: [
                    SignalRService
                ]
            },] },
];
/** @nocollapse */
SignalRModule.ctorParameters = function () { return []; };

export { SignalRModule, SignalRService };
