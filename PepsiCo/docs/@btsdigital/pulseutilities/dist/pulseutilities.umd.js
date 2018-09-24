(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('xlsx'), require('rxjs/Rx'), require('@angular/http')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'xlsx', 'rxjs/Rx', '@angular/http'], factory) :
	(factory((global.pulseutilities = {}),global.core,global.xlsx,global.Rx,global.http));
}(this, (function (exports,core,xlsx,Rx,http) { 'use strict';

/**
 * Logger service to log information to console
 *
 */
var LoggerService = (function () {
    /**
     * Constructor for initializing the service
     *
     */
    function LoggerService() {
        this.isLogging = true;
    }
    /**
     * Log method, used for logging messages to console
     *
     * @param {(string|Number)} msg This is the message to be logged
     *
     * @param {Array<any>} ...args Any additional parameters to be logged to console
     *
     */
    LoggerService.prototype.log = function (msg) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.isLogging) {
            if (args.length) {
                console.log(msg, args);
            }
            else {
                console.log(msg);
            }
        }
    };
    /**
     * Method to toggle logging mode of the service
     *
     * @param {Boolean} enableTrueDisableFalse Logging mode for the service
     */
    LoggerService.prototype.enableLogging = function (enableTrueDisableFalse) {
        if (enableTrueDisableFalse === void 0) { enableTrueDisableFalse = true; }
        this.isLogging = !!enableTrueDisableFalse;
    };
    return LoggerService;
}());
LoggerService.decorators = [
    { type: core.Injectable },
];
/** @nocollapse */
LoggerService.ctorParameters = function () { return []; };

var ChannelEvent = (function () {
    function ChannelEvent() {
        this.TargetParticipationId = 0;
    }
    return ChannelEvent;
}());

(function (ChannelEventName) {
    ChannelEventName[ChannelEventName["DDNewAction"] = 0] = "DDNewAction";
    ChannelEventName[ChannelEventName["Help"] = 1] = "Help";
    ChannelEventName[ChannelEventName["ParticipantActionSubmit"] = 2] = "ParticipantActionSubmit";
    ChannelEventName[ChannelEventName["MyVoteChanged"] = 3] = "MyVoteChanged";
    ChannelEventName[ChannelEventName["ParticipantComment"] = 4] = "ParticipantComment";
})(exports.ChannelEventName || (exports.ChannelEventName = {}));

(function (Channels) {
    Channels[Channels["GroupDirector"] = 0] = "GroupDirector";
    Channels[Channels["Participants"] = 1] = "Participants";
})(exports.Channels || (exports.Channels = {}));

(function (MessageFor) {
    MessageFor[MessageFor["Client"] = 0] = "Client";
    MessageFor[MessageFor["Group"] = 1] = "Group";
    MessageFor[MessageFor["Event"] = 2] = "Event";
})(exports.MessageFor || (exports.MessageFor = {}));

var ContentObject = (function () {
    function ContentObject() {
    }
    return ContentObject;
}());
var COSection = (function () {
    function COSection() {
    }
    return COSection;
}());
var HierarchyEmmitOptions = (function () {
    function HierarchyEmmitOptions(action, curNode, idx) {
        this.action = action;
        this.curNode = curNode;
        this.idx = idx;
    }
    return HierarchyEmmitOptions;
}());

(function (CriteriaType) {
    CriteriaType[CriteriaType["NA"] = 1] = "NA";
    CriteriaType[CriteriaType["DefaultSectionsToBe"] = 2] = "DefaultSectionsToBe";
    CriteriaType[CriteriaType["DefaultSectionsToBeUntil"] = 4] = "DefaultSectionsToBeUntil";
    CriteriaType[CriteriaType["AssessmentModuleId"] = 8] = "AssessmentModuleId";
    CriteriaType[CriteriaType["ParentEnrollmentCompleted"] = 16] = "ParentEnrollmentCompleted";
    CriteriaType[CriteriaType["ParentSchedulingCompleted"] = 32] = "ParentSchedulingCompleted";
    CriteriaType[CriteriaType["OffsetToCohortStartTime"] = 64] = "OffsetToCohortStartTime";
    CriteriaType[CriteriaType["OffsetToCohortEndTime"] = 128] = "OffsetToCohortEndTime";
    CriteriaType[CriteriaType["OffsetToDeliveryStartTime"] = 256] = "OffsetToDeliveryStartTime";
    CriteriaType[CriteriaType["OffsetToDeliveryEndTime"] = 512] = "OffsetToDeliveryEndTime";
    CriteriaType[CriteriaType["OffsetToSessionStartTime"] = 1024] = "OffsetToSessionStartTime";
    CriteriaType[CriteriaType["OffsetToSessionEndTime"] = 2048] = "OffsetToSessionEndTime";
    CriteriaType[CriteriaType["VoteOnQuestion"] = 4096] = "VoteOnQuestion";
    CriteriaType[CriteriaType["CompletionPreRequisite"] = 8192] = "CompletionPreRequisite";
})(exports.CriteriaType || (exports.CriteriaType = {}));

(function (CriteriaForState) {
    CriteriaForState[CriteriaForState["NA"] = 1] = "NA";
    CriteriaForState[CriteriaForState["MakingVisible"] = 2] = "MakingVisible";
    CriteriaForState[CriteriaForState["MakingAvailable"] = 4] = "MakingAvailable";
    CriteriaForState[CriteriaForState["RemovingAccess"] = 8] = "RemovingAccess";
    CriteriaForState[CriteriaForState["MakingInvisible"] = 16] = "MakingInvisible";
    CriteriaForState[CriteriaForState["Scheduling"] = 32] = "Scheduling";
    CriteriaForState[CriteriaForState["Enrolling"] = 64] = "Enrolling";
})(exports.CriteriaForState || (exports.CriteriaForState = {}));

var Delivery = (function () {
    function Delivery() {
    }
    return Delivery;
}());

var XLSXParser = (function () {
    function XLSXParser() {
        this.uploadedXls = new core.EventEmitter();
    }
    XLSXParser.prototype.ngOnInit = function () {
    };
    XLSXParser.prototype.XLSXParser = function () {
        this.filesSubject = new Rx.Subject();
        this._uploadedXls = this.filesSubject.asObservable()
            .switchMap(function (file) {
            return new Rx.Observable(function (observer) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    if (!e) {
                        observer.next(reader.content);
                    }
                    else {
                        observer.next(e.target.result);
                    }
                };
                if (reader.readAsBinaryString === undefined) {
                    FileReader.prototype.readAsBinaryString = function (fileData) {
                        var binary = "";
                        var pt = this;
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            var bytes = new Uint8Array(reader.result);
                            var length = bytes.byteLength;
                            for (var i = 0; i < length; i++) {
                                binary += String.fromCharCode(bytes[i]);
                            }
                            //pt.result  - readonly so assign content to another property
                            pt.content = binary;
                            pt.onload();
                        };
                        reader.readAsArrayBuffer(fileData);
                    };
                }
                reader.readAsBinaryString(file);
                return function () {
                    reader.abort();
                };
            })
                .map(function (value) {
                return xlsx.read(value, { type: 'binary' });
            }).map(function (wb) {
                return wb.SheetNames.map(function (sheetName) {
                    var sheet = wb.Sheets[sheetName];
                    var utils1 = xlsx.utils.sheet_to_json(sheet, { header: 1 });
                    return utils1;
                });
            }).map(function (results) {
                return { result: 'success', payload: results };
            })
                .catch(function (e) { return Rx.Observable.of({ result: 'failure', payload: e }); });
        });
        this.subscription = this._uploadedXls.subscribe(this.uploadedXls);
    };
    XLSXParser.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    };
    return XLSXParser;
}());
XLSXParser.decorators = [
    { type: core.Injectable },
];
/** @nocollapse */
XLSXParser.ctorParameters = function () { return []; };
XLSXParser.propDecorators = {
    'uploadedXls': [{ type: core.Output },],
};

var ParticipantOverview = (function () {
    function ParticipantOverview() {
    }
    return ParticipantOverview;
}());
var VoteResponse = (function () {
    function VoteResponse() {
    }
    return VoteResponse;
}());

var Question = (function () {
    function Question() {
    }
    return Question;
}());

var Section = (function () {
    function Section() {
    }
    return Section;
}());

//import { AppConfig } from '../../app.config';
var GatewayService = (function () {
    function GatewayService(http$$1) {
        this.http = http$$1;
        //private baseUrl: string = '';
        this.programKey = 'program';
        this.stateKey = 'componentState';
        this.loadingMyPrograms = false;
        this.loadingEventConfig = false;
        this.selectedActions = [];
        this.moduleList = [];
        this.topicList = [];
        this.eventConfig = null;
        this.hierarchyKey = 'HIERARCHY';
        this.moduleKey = 'MODULE';
        this.topicKey = 'TOPIC';
        this.sectionKey = 'SECTION';
        this.favouriteKey = "FAVOURITE";
        this.hostname = "http://localhost";
        this.baseUrl = "http://localhost/PulseServices/";
        this.eventsUrl = "http://localhost/Wizer/Pages/Events/";
        this.wizerServer = "http://localhost/";
        this.stateChange = new core.EventEmitter();
        //Modules Active Data Structure
        this.modData = {
            idx: null,
            modName: null,
            sysName: null,
            editMode: false,
            curModule: null,
            criteriaList: {
                makeVisible: [],
                makeInvisible: [],
                scheduledModule: null,
                scheduledModuleId: null
            },
            enrollable: null,
            schedulable: null
        };
        //Topics Active Data Structure
        this.topData = {
            idx: null,
            mIdx: null,
            modName: null,
            topName: null,
            sysName: null,
            topDesc: null,
            topDuration: null,
            topPoints: null,
            topIconFile: null,
            topIsNew: false,
            editMode: false,
            curTopic: null,
            description: null,
            newParent: {
                title: null,
                id: null
            },
            topIcon: null
        };
        //Sections Active Data Structure
        this.secData = {
            idx: null,
            mIdx: null,
            tIdx: null,
            modName: null,
            modId: null,
            topName: null,
            topId: null,
            secName: null,
            sysName: null,
            secDuration: null,
            secPoints: null,
            secIconFile: null,
            secLevel: null,
            secLevelImage: null,
            secType: null,
            secIsNew: false,
            secJump: false,
            editMode: false,
            curSection: null,
            secDesc: null,
            selectedActions: null,
            newParent: {
                title: null,
                id: null
            },
            secIcon: null,
            criteriaList: {
                makeVisible: [],
                makeInvisible: [],
                makeAvailable: [],
                removeAccess: []
            },
        };
        this._observableEmitter = {};
        //var vlu = this.config.value;
        //this.baseUrl = vlu.serviceUrl;
    }
    GatewayService.prototype.get = function (url) {
        var headers = new http.Headers();
        headers.append('Access-Control-Allow-Origin', '*');
        var options = new http.RequestOptions({ headers: headers });
        return this.http.get(url, options);
    };
    GatewayService.prototype.getMyPrograms = function (eventId, isAuthoring) {
        var _this = this;
        if (this.loadingMyPrograms) {
            return Rx.Observable.fromPromise(this.observable).debounceTime(1500);
        }
        else if (!this.myProgram) {
            this.loadingMyPrograms = true;
            var url = this.baseUrl + "GatewayService.svc/GetContentObjects";
            var body = {
                "eventId": eventId,
                "programKey": this.programKey,
                "stateKey": this.stateKey,
                "resolveCriterias": isAuthoring ? false : true
            };
            this.observable = this.postRequest(url, body)
                .map(function (data) { return _this.extractData(data); })
                .toPromise()
                .catch(this.handleError);
            return Rx.Observable.fromPromise(this.observable);
        }
        else {
            //return cached data
            return this.createObservable(this.myProgram);
            //return this.myProgram;
        }
    };
    GatewayService.prototype.getRecentHistory = function () {
        var _this = this;
        if (this.recentHistory && this.recentHistory.length > 0) {
            return this.createObservable(this.recentHistory);
        }
        else {
            var url = this.baseUrl + "GatewayService.svc/RecentHistory";
            this.rHObservable = this.postRequest(url, {})
                .map(function (data) { return _this.extractRecentHistory(data); })
                .toPromise()
                .catch(this.handleError);
            return Rx.Observable.fromPromise(this.rHObservable);
        }
    };
    GatewayService.prototype.getEnrolledModuleCount = function () {
        var enrolledModuleCount = 0;
        for (var i = 0; i < this.myProgram.contentObjects.length; i++) {
            if (this.myProgram.contentObjects[i].enrolled) {
                enrolledModuleCount++;
            }
        }
        return enrolledModuleCount;
    };
    GatewayService.prototype.changeLanguage = function (eventId, languageKey) {
        var url = this.baseUrl + "GatewayService.svc/ChangeLanguage";
        var body = {
            "eventId": eventId,
            "languageKey": languageKey
        };
        return this.postRequest(url, body);
    };
    GatewayService.prototype.extractRecentHistory = function (res) {
        this.recentHistory = res.json().GetRecentHistoryResult.Contentobject;
        //this.exandDefault();
        for (var i = 0; i < this.recentHistory.length; i++) {
            this.initializeData(this.recentHistory[i]);
        }
        return this.recentHistory;
    };
    GatewayService.prototype.getResources = function () {
        return this.resources;
    };
    GatewayService.prototype.deleteCO = function (coId) {
        var url = this.baseUrl + "GatewayService.svc/DeleteContentObject";
        var body = {
            "contentObjectId": coId
        };
        this.postRequest(url, body).subscribe(function (c) {
        });
    };
    GatewayService.prototype.saveCOSequence = function (program) {
        var url = this.baseUrl + "GatewayService.svc/SaveCOSequence";
        var coIds = [];
        for (var i = 0; i < program.contentObjects.length; i++) {
            coIds.push(program.contentObjects[i].id);
        }
        var body = {
            "parentCOId": program.id,
            "childCOIds": coIds
        };
        this.postRequest(url, body).subscribe(function (c) {
        });
    };
    GatewayService.prototype.postRequest = function (url, body) {
        var headers = new http.Headers();
        headers.append('Content-Type', 'application/json');
        var options = new http.RequestOptions({ headers: headers });
        var params = JSON.stringify(body);
        return this.http.post(url, params, options)
            .map(function (data) { return data; })
            .catch(this.handleError);
    };
    GatewayService.prototype.saveCO = function (program, eventId, parentCoId, languageId) {
        var url = this.baseUrl + "GatewayService.svc/SaveContentObject";
        var contentObject = this.convertMetadataFormat(program);
        var body = {
            "contentObject": contentObject,
            "customerEventId": eventId,
            "parentCoId": parentCoId,
            "languageId": languageId
        };
        return this.postRequest(url, body);
    };
    GatewayService.prototype.convertMetadataFormat = function (program) {
        var metadata = [];
        for (var key in program.metadata) {
            metadata.push({
                "Key": key,
                "Value": program.metadata[key]
            });
        }
        var contentObject = {
            "id": program.id,
            "name": program.name,
            "metadata": metadata,
            "section": program.section
        };
        return contentObject;
    };
    GatewayService.prototype.extractData = function (res) {
        var responseJson = res.json().GetContentObjectsResult;
        this.myProgram = responseJson.Contentobject[0] || {};
        this.resources = responseJson.Contentobject[1] || {};
        this.languages = responseJson.languages || {};
        this.secActions = responseJson.allActions || {};
        this.eventIcons = responseJson.allIcons || [];
        this.modules = responseJson.modules || [];
        this.questions = responseJson.questions || [];
        this.notifications = responseJson.notifications || [];
        var localStorage = responseJson.programCache;
        var state = responseJson.stateCache;
        if (localStorage) {
            var obj = JSON.parse(localStorage);
            if (obj.id && obj.id == this.myProgram.id)
                this.setExpandedState(obj);
        }
        if (state)
            this.setState(state);
        //console.log(this.resources);
        this.myProgram = this.initializeData(this.myProgram);
        this.resources = this.initializeData(this.resources);
        this.myProgram.eventName = responseJson.eventName;
        this.resources.eventName = responseJson.eventName;
        this.myProgram.languageName = responseJson.languageName;
        this.myProgram.languages = responseJson.languages;
        //console.log(this.resources);
        this.loadingMyPrograms = false;
        var enrolledModuleCount = this.getEnrolledModuleCount();
        if (enrolledModuleCount === this.myProgram.maxModules) {
            for (var i = 0; i < this.myProgram.contentObjects.length; i++) {
                if (!this.myProgram.contentObjects[i].enrolled && this.myProgram.contentObjects[i].enrollable) {
                    this.myProgram.contentObjects[i].disabled = true;
                }
            }
        }
        return this.myProgram;
    };
    GatewayService.prototype.getNotifications = function () {
        // this.notifications = [{
        //     "Id": 1,
        //     "Date": "2017-09-17T18:30:01Z",
        //     "Subject": "This is a notification 1",
        //     "Body": "This is a notification 1"
        // }, {
        //     "Id": 2,
        //     "Date": "2017-09-18T18:30:01Z",
        //     "Subject": "This is a notification 2",
        //     "Body": "This is a notification 2"
        // }, {
        //     "Id": 3,
        //     "Date": "2017-09-17T18:30:01Z",
        //     "Subject": "This is a notification 3",
        //     "Body": "This is a notification 3"
        // }, {
        //     "Id": 4,
        //     "Date": "2017-09-17T18:30:01Z",
        //     "Subject": "This is a notification 4",
        //     "Body": "This is a notification 4"
        // }, {
        //     "Id": 5,
        //     "Date": "2017-09-17T18:30:01Z",
        //     "Subject": "This is a notification 5",
        //     "Body": "This is a notification 5"
        // }];
        return this.notifications;
    };
    GatewayService.prototype.setExpandedState = function (obj) {
        var co = this.getCoById(this.myProgram, obj.id);
        if (co)
            co.expanded = obj.expanded;
        if (obj.contentObjects)
            for (var i = 0; i < obj.contentObjects.length; i++)
                this.setExpandedState(obj.contentObjects[i]);
    };
    GatewayService.prototype.setCOToLocalStorage = function (co) {
        var body = {
            "key": this.programKey,
            "value": JSON.stringify(co)
        };
        var cacheValueURL = this.baseUrl + "CachingService.svc/SetValue";
        // this.get(url)
        //         .map((data) => this.extractData(data))
        this.postRequest(cacheValueURL, body).subscribe(function (c) { });
        //localStorage.setItem("program", JSON.stringify(co));
    };
    GatewayService.prototype.setStateToLocalStorage = function (state) {
        var body = {
            "key": this.stateKey,
            "value": state
        };
        var cacheValueURL = this.baseUrl + "CachingService.svc/SetValue";
        this.postRequest(cacheValueURL, body).subscribe(function (c) { });
    };
    GatewayService.prototype.getCoById = function (co, id) {
        var self = this;
        if (co.id === id)
            return co;
        if (co.contentObjects) {
            var coFound = null;
            for (var j = 0; j < co.contentObjects.length; j++) {
                var childCo = self.getCoById(co.contentObjects[j], id);
                if (childCo) {
                    coFound = childCo;
                    break;
                }
            }
            return coFound;
        }
        return null;
    };
    GatewayService.prototype.getCoByName = function (co, name) {
        var self = this;
        if (!co)
            return null;
        if (co.name === name)
            return co;
        if (co.contentObjects) {
            var coFound = null;
            for (var j = 0; j < co.contentObjects.length; j++) {
                var childCo = self.getCoByName(co.contentObjects[j], name);
                if (childCo) {
                    coFound = childCo;
                    break;
                }
            }
            return coFound;
        }
        return null;
    };
    GatewayService.prototype.getCoByPath = function (co, path) {
        var self = this;
        if (co.path === path)
            return co;
        if (co.contentObjects) {
            var coFound = null;
            for (var j = 0; j < co.contentObjects.length; j++) {
                var childCo = self.getCoByPath(co.contentObjects[j], path);
                if (childCo) {
                    coFound = childCo;
                    break;
                }
            }
            return coFound;
        }
        return null;
    };
    GatewayService.prototype.setState = function (state) {
        this.dashboardState = state;
        this.stateChange.emit(this.dashboardState);
    };
    GatewayService.prototype.initializeData = function (co, parentCO) {
        if (Array.isArray(co.metadata)) {
            var metadataObj = {};
            if (co.metadata) {
                for (var i = 0; i < co.metadata.length; i++) {
                    if (co.metadata[i].Value[0].indexOf('\"') !== -1) {
                        co.metadata[i].Value[0] = co.metadata[i].Value[0].replace(/\\\"/g, '\"');
                    }
                    metadataObj[co.metadata[i].Key] = [this.htmlDecode(co.metadata[i].Value)];
                }
            }
            co.metadata = metadataObj;
        }
        co.path = "";
        if (co.name) {
            co.path = "/" + co.name;
        }
        if (parentCO) {
            co.parent = parentCO;
            co.path = co.parent.path + co.path;
        }
        // console.log("path:", co.path);
        if (co.contentObjects)
            for (var j = 0; j < co.contentObjects.length; j++) {
                var childCO = this.initializeData(co.contentObjects[j], co);
            }
        return co;
    };
    GatewayService.prototype.htmlDecode = function (value) {
        var a = document.createElement('a');
        a.innerHTML = value;
        return a.textContent;
    };
    GatewayService.prototype.createObservable = function (data) {
        return Rx.Observable.create(function (observer) {
            observer.next(data);
            observer.complete();
        });
    };
    GatewayService.prototype.handleError = function (error) {
        console.log(error);
        return Rx.Observable.throw(error.json().error || 'Server error');
    };
    GatewayService.prototype.loadEventConfig = function (eventName, eventId) {
        var _this = this;
        if (this.loadingEventConfig) {
            return Rx.Observable.fromPromise(this.eventConfigObservable).debounceTime(1500);
        }
        else if (!this.eventConfig) {
            this.loadingEventConfig = true;
            var url = this.baseUrl + "GatewayService.svc/GetGatewayConfiguration/" + eventId;
            this.eventConfigObservable = this.get(url)
                .map(function (data) { return _this.extractEventConfig(data); })
                .toPromise()
                .catch(this.handleError);
            return Rx.Observable.fromPromise(this.eventConfigObservable);
        }
        else {
            return this.createObservable(this.eventConfig);
        }
    };
    GatewayService.prototype.extractEventConfig = function (data) {
        this.eventConfig = JSON.parse(data.json().configuration);
        this.eventConfig.wizerServer = this.wizerServer;
        this.eventConfig.eventsUrl = this.eventsUrl;
        this.loadingEventConfig = false;
        return this.eventConfig;
    };
    GatewayService.prototype.testFunctionHere = function () {
        return "In service - " + this.baseUrl;
    };
    GatewayService.prototype.genUUID = function (optChar) {
        var d = new Date().getTime();
        var uuid = optChar + 'xxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 6) % 6 | 0;
            d = Math.floor(d / 6);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(6);
        });
        return uuid;
    };
    GatewayService.prototype.genUUStr = function (myStr) {
        var str = myStr;
        var s = str.toString().replace(/[^a-zA-Z0-9 ]/g, "");
        str = s.replace(/ /g, "_");
        return str.toLowerCase();
    };
    GatewayService.prototype.emitData = function (key, opts) {
        if (this._observableEmitter[key])
            this._observableEmitter[key].emit(opts);
    };
    GatewayService.prototype.getEmitter = function (key) {
        if (key) {
            this._observableEmitter[key] = new core.EventEmitter();
            return this._observableEmitter[key];
        }
    };
    GatewayService.prototype.saveIcon = function (iconFile, eventId, name) {
        var url = this.baseUrl + "GatewayService.svc/Upload/" + eventId + "/" + name;
        return this.http.post(url, iconFile)
            .map(function (data) { return data; })
            .catch(this.handleError);
    };
    GatewayService.prototype.jumpToContent = function (path) {
        window.location.href = this.wizerServer + 'Wizer/MyGateway' + path + "?fromGateway=true";
    };
    GatewayService.prototype.logout = function () {
        localStorage.removeItem('currentUser');
        window.location.href = this.wizerServer + 'Wizer/Wizer/Logout';
    };
    GatewayService.prototype.saveFavourite = function (coId, isFavourite) {
        var url = this.baseUrl + "GatewayService.svc/AddOrUpdateFavourites";
        var body = {
            "contentObjectId": coId,
            "IsFavourite": isFavourite,
        };
        return this.postRequest(url, body);
    };
    GatewayService.prototype.extractTextConfig = function (res) {
        this.textConfig = res.json();
        return this.textConfig;
    };
    GatewayService.prototype.getTextConfig = function (eventId) {
        var _this = this;
        if (this.textConfig) {
            return this.createObservable(this.textConfig);
        }
        else {
            var url = this.baseUrl + "GatewayService.svc/GetKeys/" + eventId;
            this.tKObservable = this.get(url)
                .map(function (data) { return _this.extractTextConfig(data); })
                .toPromise()
                .catch(this.handleError);
            return Rx.Observable.fromPromise(this.tKObservable);
        }
    };
    GatewayService.prototype.saveTextConfig = function (textConfig, eventId) {
        var url = this.baseUrl + "GatewayService.svc/SaveKeys";
        var body = {
            "eventId": eventId,
            "coId": this.myProgram.id,
            "values": textConfig.Keys,
        };
        return this.postRequest(url, body);
    };
    GatewayService.prototype.saveEnrollScheduleCriterias = function (maxModules, criterias, enrollable, schedulable, id) {
        var url = this.baseUrl + "GatewayService.svc/SaveLifeCycle";
        var body = {
            "coId": id,
            "maxModules": maxModules,
            "criterias": criterias,
            "enrollable": enrollable,
            "schedulable": schedulable
        };
        return this.postRequest(url, body);
    };
    GatewayService.prototype.saveModuleEnrolledState = function (id) {
        var url = this.baseUrl + "GatewayService.svc/EnrollParticipant";
        var body = {
            "coId": id,
        };
        return this.postRequest(url, body);
    };
    GatewayService.prototype.getLanguageName = function () {
        if (this.myProgram) {
            return this.myProgram.languageName;
        }
    };
    GatewayService.prototype.getLanguages = function () {
        return this.languages;
    };
    GatewayService.prototype.getMonthWiseAvailable = function (moduleName, firstDay) {
        var url = this.baseUrl + "GatewayService.svc/GetMonthWiseAvailableSessions";
        var body = {
            "startDate": firstDay,
            "module": moduleName
        };
        return this.postRequest(url, body);
    };
    GatewayService.prototype.getAvailableSession = function (moduleName, date) {
        var url = this.baseUrl + "GatewayService.svc/GetAvailableSessions";
        var body = {
            "startDate": date,
            "module": moduleName
        };
        return this.postRequest(url, body);
    };
    GatewayService.prototype.scheduleParticipant = function (coId, sessionId, moduleName, timezoneOffset, timezoneName) {
        if (timezoneOffset === void 0) { timezoneOffset = 0; }
        var url = this.baseUrl + "GatewayService.svc/ScheduleParticipant";
        var body = {
            "coId": coId,
            "sessionId": sessionId,
            "moduleName": moduleName,
            "timezoneOffset": timezoneOffset,
            "timezoneName": timezoneName
        };
        return this.postRequest(url, body);
    };
    GatewayService.prototype.dismissNotifications = function (notificationIds) {
        var url = this.baseUrl + "GatewayService.svc/DismissNotification";
        var body = {
            "notificationIds": notificationIds
        };
        return this.postRequest(url, body);
    };
    GatewayService.prototype.getAllCONames = function () {
        this.allCONames = [];
        if (this.myProgram && this.myProgram.contentObjects && this.myProgram.contentObjects.length > 0) {
            for (var i = 0; i < this.myProgram.contentObjects.length; i++) {
                this.traverseProgramCOs(this.myProgram.contentObjects[i]);
            }
        }
        return this.allCONames;
    };
    GatewayService.prototype.traverseProgramCOs = function (co) {
        this.allCONames.push({
            "value": co.metadata.title[0],
            "label": co.metadata.title[0],
            "name": co.name
        });
        if (co.contentObjects && co.contentObjects.length > 0) {
            for (var j = 0; j < co.contentObjects.length; j++) {
                this.traverseProgramCOs(co.contentObjects[j]);
            }
        }
    };
    GatewayService.prototype.configureGatewayService = function (configuration) {
        console.log('pulseutilities gateway service here');
        console.log(configuration);
        this.hostname = configuration.hostname;
        this.baseUrl = configuration.serviceUrl;
        this.eventsUrl = configuration.eventsUrl;
        this.wizerServer = configuration.wizerServer;
    };
    return GatewayService;
}());
GatewayService.decorators = [
    { type: core.Injectable },
];
/** @nocollapse */
GatewayService.ctorParameters = function () { return [
    { type: http.Http, },
]; };
GatewayService.propDecorators = {
    'stateChange': [{ type: core.Output },],
};

//import * as moment from 'moment/moment';
var SHOW_SCHEDULE_MODAL = 'show_schedule_modal';
var SHOW_ENROLLMODULE_MODAL = "show-enrollmodule-modal";
var HierarchyComponent = (function () {
    function HierarchyComponent(gws) {
        this.gws = gws;
        this.level = 0;
        this.filter = { isNew: '', favourite: '', selectedLevel: '', selectedType: '', selectedStatus: '', selectedStatusText: '' };
        this.contentChange = new core.EventEmitter();
        this.favouriteChange = new core.EventEmitter();
        this.iconsPath = this.gws.iconsPath;
        this.lvlNo = null;
        this.showControls = false;
        this.currentDate = new Date().toISOString();
        this.clsName1 = null;
        this.clsName2 = null;
        this.rescheduleStatus = false;
    }
    HierarchyComponent.prototype.ngOnInit = function () {
        this.lvlNo = this.level + 1;
        this.showControls = this.controls;
        if (this.lvlNo == 2) {
            this.clsName1 = "hi-list" + this.lvlNo + " " + "coLevel2CollapseContBG";
        }
        else {
            this.clsName1 = "hi-list" + this.lvlNo;
        }
        this.clsName2 = "level" + this.lvlNo + "Expand";
        /*setTimeout(function () {
            $('[data-toggle="tooltip"]').tooltip();
        }, 2000 * this.lvlNo);*/
    };
    HierarchyComponent.prototype.onCoChange = function (heo) {
        //console.log("onCoChange called", heo.action);
        this.contentChange.emit(heo);
    };
    HierarchyComponent.prototype.schedule = function (event, items) {
        event.stopPropagation();
        if (items.disabled) {
            return;
        }
        //$('.gw-scheduleModal').modal('show');
        this.gws.emitData(SHOW_SCHEDULE_MODAL, [items, event.currentTarget.innerText.trim()]);
    };
    HierarchyComponent.prototype.showReschedule = function (items) {
        var self = this;
        if (items && items.criterias) {
            var filteredArray = items.criterias.filter(function (element) {
                return element.CriteriaForState == exports.CriteriaForState.Scheduling && element.CriteriaType == exports.CriteriaType.AssessmentModuleId;
            });
            if (filteredArray.length > 0) {
                for (var i = 0; i < filteredArray.length; i++) {
                    var ResolvedCriteriaDate = new Date(filteredArray[i].ResolvedCriteriaValue).toISOString();
                    if (ResolvedCriteriaDate > self.currentDate) {
                        return true;
                    }
                }
            }
            return false;
        }
    };
    HierarchyComponent.prototype.toggleExpand = function (co) {
        co.expanded = !co.expanded;
        // if (!co.expanded && co.contentObjects.length > 0) {
        // 	for (var i = 0; i <= co.contentObjects.length - 1; i++) {
        // 		if (co.contentObjects[i].expanded == undefined) {
        // 			co.contentObjects[i]['expanded'] = false;
        // 		} else {
        // 			co.contentObjects[i].expanded = false;
        // 		}
        // 	}
        // }
        this.gws.emitData('REINIT_PROG', "");
    };
    HierarchyComponent.prototype.onFavChange = function ($event, items) {
        var opt = {};
        if ($event.newValue !== undefined) {
            items.fav = $event.newValue;
            opt = {
                action: "saveFavourite",
                data: items
            };
        }
        this.gws.emitData(this.gws.favouriteKey, opt);
    };
    HierarchyComponent.prototype.jumpToCO = function (co, i) {
        if (co.locked) {
            return;
        }
        var opt = new HierarchyEmmitOptions("contentPage", co, i);
        this.contentChange.emit(opt);
    };
    HierarchyComponent.prototype.editMe = function (levelNo, curNode, curIdx) {
        var editAction = null;
        if (curNode.contentObjects.length == 0 && curNode.section !== null && curNode.section.length > 0 && !curNode.parent.parent.parent) {
            levelNo = 3;
        }
        if (levelNo == 1) {
            editAction = "editModule";
        }
        else if (levelNo == 2) {
            editAction = "editTopic";
        }
        else if (levelNo == 3) {
            editAction = "editSection";
        }
        else {
            editAction = null;
        }
        this.hierarchyEmmit(editAction, curNode, curIdx);
    };
    HierarchyComponent.prototype.addTopic = function (mNode, mIdx) {
        this.hierarchyEmmit("addTopic", mNode, mIdx);
    };
    HierarchyComponent.prototype.addSection = function (pNode) {
        this.hierarchyEmmit("addSection", pNode, 0);
    };
    HierarchyComponent.prototype.moveUp = function (event, curNode, index) {
        event.stopPropagation();
        var newProgram = {
            contentObjects: []
        };
        for (var i = 0; i < curNode.parent.contentObjects.length; i++) {
            if (curNode.parent.contentObjects[i + 1] && curNode.parent.contentObjects[i + 1].id === curNode.id) {
                newProgram.contentObjects.push(curNode);
                newProgram.contentObjects.push(curNode.parent.contentObjects[i]);
                i++;
            }
            else {
                newProgram.contentObjects.push(curNode.parent.contentObjects[i]);
            }
        }
        curNode.parent.contentObjects = newProgram.contentObjects;
        this.hierarchyEmmit("saveSequence", curNode.parent, 0);
    };
    HierarchyComponent.prototype.moveDown = function (event, curNode, index) {
        event.stopPropagation();
        var newProgram = {
            contentObjects: []
        };
        for (var i = 0; i < curNode.parent.contentObjects.length; i++) {
            if (curNode.parent.contentObjects[i] && curNode.parent.contentObjects[i].id === curNode.id && i < curNode.parent.contentObjects.length - 1) {
                newProgram.contentObjects.push(curNode.parent.contentObjects[i + 1]);
                newProgram.contentObjects.push(curNode);
                i++;
            }
            else {
                newProgram.contentObjects.push(curNode.parent.contentObjects[i]);
            }
        }
        curNode.parent.contentObjects = newProgram.contentObjects;
        this.hierarchyEmmit("saveSequence", curNode.parent, 0);
    };
    HierarchyComponent.prototype.hierarchyEmmit = function (curAct, curNode, curIdx) {
        this.opt = {
            action: curAct,
            curNode: curNode,
            idx: curIdx
        };
        this.gws.emitData(this.gws.hierarchyKey, this.opt);
    };
    HierarchyComponent.prototype.enrollModule = function (event, items) {
        event.stopPropagation();
        if (items.disabled) {
            return;
        }
        this.gws.emitData(SHOW_ENROLLMODULE_MODAL, items);
    };
    return HierarchyComponent;
}());
HierarchyComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'co-hierarchy',
                template: "<div class=\"{{clsName1}}\" *ngFor=\"let items of hdata?.contentObjects | coFilter:filter; let i = index\" [class.show]=\"items.visible\" [class.hide]=\"!items.visible && !showControls\" [class.coLevel2ExpandContBG]=\"lvlNo==2 && items?.expanded\" [class.lastLevelCO]=\"lvlNo==2 && items?.contentObjects.length == 0\"> <!-- Menu Icons --> <div *ngIf=\"(lvlNo==1 || lvlNo>1 && hdata?.expanded) && showControls\" class=\"hi-list__menubar\"> <div class=\"hi-mIcon\" (click)=\"editMe(lvlNo, items, i)\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Edit\"> <i class=\"icon edit-01\"></i></div> <div class=\"hi-mIcon--disabled\" *ngIf=\"i==0\"><i class=\"icon move-up-01\"></i></div> <div *ngIf=\"i > 0\" class=\"hi-mIcon\" (click)=\"moveUp($event, items, i)\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Move Up\"> <i class=\"icon move-up-01\"></i></div> <div class=\"hi-mIcon--disabled\" *ngIf=\"i >= hdata.contentObjects.length-1\"> <i class=\"icon move-down-01\"></i></div> <div class=\"hi-mIcon\" (click)=\"moveDown($event, items, i)\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Move Down\" *ngIf=\"hdata.contentObjects.length >0 && i < hdata.contentObjects.length-1\"> <i class=\"icon move-down-01\"></i></div> </div> <header class=\"hi-list{{lvlNo}}_header\" [ngClass]=\"items?.expanded ? clsName2 : null\" (click)=\"toggleExpand(items)\" [class.level2Expand]=\"lvlNo==2 && items?.expanded && items?.contentObjects.length > 0\"> <!-- Level 1 Heading Content --> <div *ngIf=\"lvlNo==1\"> <span>{{items?.metadata.title}}</span> <div class=\"hi-list1_rightContent\"> <span *ngIf=\"items?.schedulable && !items?.enrollable && !showControls && !items?.scheduled\" class=\"hi-list1_schedule\" (click)=\"schedule($event, items)\"> {{rootMetadata?.scheduletext ? rootMetadata?.scheduletext : \"Schedule Now\"}} <i class=\"icon schedule\"></i> </span> <span *ngIf=\"items?.scheduled && !showControls && showReschedule(items)\" class=\"hi-list1_reschedule\" (click)=\"schedule($event, items)\"> {{rootMetadata?.rescheduletext ? rootMetadata?.rescheduletext : \"ReSchedule\"}} <i class=\"icon schedule\"></i> </span> <span *ngIf=\"items?.enrollable && !items?.schedulable && !showControls && !items?.enrolled\" [class.disabled]=\"items?.disabled\" class=\"hi-list1_enroll\" (click)=\"enrollModule($event, items)\"> {{rootMetadata?.enrolltext ? rootMetadata?.enrolltext : \"Enroll\"}} <i class=\"icon enroll\"></i> </span> <span *ngIf=\"items?.schedulable && items?.enrollable && !showControls && !items?.scheduled\" [class.disabled]=\"items?.disabled\" class=\"hi-list1_schedule\" (click)=\"schedule($event, items)\"> {{rootMetadata?.enrolltext ? rootMetadata?.enrolltext : \"Enroll\"}} <i class=\"icon enroll\"></i> </span> <div class=\"hi-list1_expCol icon expand-arrow\"></div> </div> </div> <!-- Level 2 Heading Content --> <div *ngIf=\"lvlNo==2 && items?.section?.length <=0\" class=\"hi-list2_header_nonmobile\"> <div class=\"hi-co_img\"> <img [ngClass]=\"(lvlNo==2 && items.metadata.icon=='') ? 'hi-list2_iconX':'hi-list2_icon'\" src=\"{{iconsPath}}{{items?.metadata?.icon}}\" alt=\"Topic Icon\" /> </div> <div class=\"hi-list2_title col-xs-4\"> <h3>{{items?.metadata.title}}</h3> <span class=\"hi-list2_duration_icon icon duration-clock\"></span> <span class=\"hi-list2_duration\">{{items?.metadata.duration}} {{this.rootMetadata?.minutestext ? this.rootMetadata?.minutestext : 'min'}}.</span> </div> <div class=\"hi-list2_expCol icon expand-arrow\"></div> <p class=\"hi-list2_description col-xs-5\">{{items?.metadata.description}}</p> <div *ngIf=\"items?.completed == 0 || items?.completed !== items?.contentObjects.length\" class=\"hi-list2_completionStatus notComplete\">{{items?.completed}}/{{items?.contentObjects.length}}</div> <div *ngIf=\"items?.completed != 0 && items?.completed === items?.contentObjects.length\" class=\"hi-list2_completionStatus complete icon checkmark\"></div> </div> <!-- Level 3 Heading Content --> <div *ngIf=\"lvlNo==3 || (lvlNo==2 && items?.section?.length >0)\" class=\"hi-list3_cont\"> <div *ngIf=\"items?.metadata.isnew == 'TRUE'\" class=\"hi-list3_new\"> <div class=\"hi-list3-icon_new\">{{this.rootMetadata?.newtext ? this.rootMetadata?.newtext : 'New'}}</div> </div> <div class=\"hi-co_img\"> <img [ngClass]=\"((lvlNo==2 || lvlNo==3) && items.metadata.icon=='') ? 'hi-list3_iconX':'hi-list3_icon'\" src=\"{{iconsPath}}{{items?.metadata?.icon}}\" alt=\"Section Icon\" /> </div> <div class=\"hi-list3_title\"> <ico-fav class=\"hi-fav_icon gw-brandTxt-primary\" [isFav]=\"items?.fav\" (chnge)=\"onFavChange($event, items)\"></ico-fav> <div class=\"hi-list3_locked icon lock-02\" *ngIf=\"items?.locked && !showControls\"></div> <h4>{{items?.metadata.title}}</h4> <div class=\"hi-list3_details\"> <span class=\"hi-list3_duration_icon icon duration-clock\"></span> <span class=\"hi-list3_duration\">{{items?.metadata.duration}} {{this.rootMetadata?.minutestext ? this.rootMetadata?.minutestext : 'min'}}.</span> <span class=\"hi-list3_level_icon icon\" [class.beginner]=\"items?.metadata.levelimage == 'Basic' || items?.metadata.level == 'Basic'\"  [class.intermediate]=\"(items?.metadata.levelimage == 'Intermediate') || (items?.metadata.level == 'Intermediate' || items?.metadata.level == 'Basic,Intermediate')\" [class.advanced]=\"items?.metadata.levelimage == 'Advanced' || items?.metadata.level == 'Advanced'\"> </span> <span *ngIf=\"items?.metadata.level\" class=\"hi-list3_level\">{{items?.metadata.level.join('/')}}</span> </div> <span *ngIf=\"items?.message\" class=\"hi-list3_lockMessage\" [class.removed]=\"items?.lockCondition == 'removed'\" [class.gw-brandTxt-primary]=\"items?.lockCondition == 'available' || items?.lockCondition == 'completed'\">{{items?.message}}</span> </div> <div class=\"hi-list3_right hi-list3_status gw-brandBg-primary\" [class.locked]=\"items?.locked && !showControls\" (click)=\"jumpToCO(items, i)\"> <span class=\"icon\" [class.not-started]=\"items?.status === 0\" [class.in-progress]=\"items?.status === 1\" [class.completed]=\"items?.status === 2\" [class.checkmark]=\"items?.status === 2\" [class.action-arrow]=\"items?.status < 2 || items?.status == null\"> </span> </div> </div> </header> <content class=\"hi-list{{lvlNo}}_body\" [class.show]=\"items?.expanded\"> <co-hierarchy [rootMetadata]=\"rootMetadata\" (contentChange)=\"onCoChange($event)\" *ngIf=\"items?.section?.length >0\" [hdata]=\"items\" [filter]=\"filter\" [level]=\"3\" [controls]=\"showControls\"></co-hierarchy> <co-hierarchy [rootMetadata]=\"rootMetadata\" (contentChange)=\"onCoChange($event)\" *ngIf=\"items?.section == null\" [hdata]=\"items\" [filter]=\"filter\" [level]=\"lvlNo\" [controls]=\"showControls\"></co-hierarchy> <div *ngIf=\"items?.section?.length <=0 && showControls\"> <!-- Buttons inside the Modules to add Topic / Section --> <div class=\"hi-btnLongBlack2--container\" *ngIf=\"lvlNo==1 && items?.contentObjects.length==0\"> <button type=\"button\" class=\"btn btn-default btn-xs hi-btnLongBlack\" (click)=\"addTopic(items, i)\">Add Topic</button> <button type=\"button\" class=\"btn btn-default btn-xs hi-btnLongBlack\" (click)=\"addSection(items)\">Add Section</button> </div> <div class=\"hi-btnLongBlack1--container\" *ngIf=\"lvlNo==1 && items?.contentObjects.length!=0\"> <!-- Button inside the Module to add Topic --> <button type=\"button\" class=\"btn btn-default btn-xs hi-btnLongBlack\" *ngIf=\"items?.contentObjects[0]?.section==null\" (click)=\"addTopic(items, i)\"> Add Topic </button> <!-- Button inside the Module to add Section --> <button type=\"button\" class=\"btn btn-default btn-xs hi-btnLongBlack\" *ngIf=\"items?.contentObjects[0]?.section!=null\" (click)=\"addSection(items)\"> Add Section </button> </div> <!-- Button inside the Topics to add Section --> <div class=\"hi-btnLongBlack1--container\" *ngIf=\"lvlNo==2\"> <button type=\"button\" class=\"btn btn-default btn-xs hi-btnLongBlack\" (click)=\"addSection(items, i, true)\"> Add Section </button> </div> </div> </content> </div>"
            },] },
];
/** @nocollapse */
HierarchyComponent.ctorParameters = function () { return [
    { type: GatewayService, },
]; };
HierarchyComponent.propDecorators = {
    'hdata': [{ type: core.Input },],
    'level': [{ type: core.Input },],
    'controls': [{ type: core.Input },],
    'filter': [{ type: core.Input },],
    'rootMetadata': [{ type: core.Input },],
    'contentChange': [{ type: core.Output },],
    'favouriteChange': [{ type: core.Output },],
};

var PulseUtilitiesModule = (function () {
    function PulseUtilitiesModule() {
    }
    return PulseUtilitiesModule;
}());
PulseUtilitiesModule.decorators = [
    { type: core.NgModule, args: [{
                imports: [],
                exports: [
                    LoggerService,
                    GatewayService
                ],
                declarations: [
                    HierarchyComponent
                ],
                providers: [
                    LoggerService,
                    GatewayService
                ]
            },] },
];
/** @nocollapse */
PulseUtilitiesModule.ctorParameters = function () { return []; };

var CoFilterPipe = (function () {
    function CoFilterPipe() {
    }
    CoFilterPipe.prototype.transform = function (allCos, filter) {
        var _this = this;
        if (allCos) {
            if (filter.selectedLevel == '' && filter.selectedType == '' && filter.selectedStatus == '' && filter.isNew == '' && filter.favourite == '') {
                return allCos;
            }
            else {
                return allCos.filter(function (co) { return _this.getLowestLevelContentObject(co, filter); });
            }
        }
    };
    CoFilterPipe.prototype.getLowestLevelContentObject = function (co, filter) {
        if (co.contentObjects == null || co.contentObjects.length == 0) {
            var matchLevel = true, matchType = true, matchStatus = true, matchFav = true, matchNew = true;
            matchLevel = filter.selectedLevel == '' ? true : (co.metadata != null && co.metadata.level != null && co.metadata.level.map(function (m) { return m.toLowerCase(); }).indexOf(filter.selectedLevel.toLowerCase()) != -1);
            matchType = filter.selectedType == '' ? true : (co.metadata != null && co.metadata.type != null && co.metadata.type.map(function (m) { return m.toLowerCase(); }).indexOf(filter.selectedType.toLowerCase()) != -1);
            matchStatus = filter.selectedStatus == '' ? true : (co.status != null && co.status.toString().toLowerCase() == filter.selectedStatus.toLowerCase());
            matchFav = filter.favourite == '' ? true : (co.fav != null && co.fav.toString().toLowerCase() == filter.favourite.toString().toLowerCase());
            matchNew = filter.isNew == '' ? true : (co.metadata != null && co.metadata.isnew != null && co.metadata.isnew.map(function (m) { return m.toLowerCase(); }).indexOf(filter.isNew.toLowerCase()) != -1);
            return matchLevel && matchType && matchStatus && matchFav && matchNew;
        }
        else {
            var childStatus = [];
            if (co.contentObjects)
                for (var i = 0; i < co.contentObjects.length; i++)
                    childStatus.push(this.getLowestLevelContentObject(co.contentObjects[i], filter));
            return childStatus.indexOf(true) != -1;
        }
    };
    return CoFilterPipe;
}());
CoFilterPipe.decorators = [
    { type: core.Pipe, args: [{ name: 'coFilter' },] },
];
/** @nocollapse */
CoFilterPipe.ctorParameters = function () { return []; };

var SAVE_FAVS = "save-favs";
var FavComponent = (function () {
    function FavComponent(gatewayService) {
        this.gatewayService = gatewayService;
        this.chnge = new core.EventEmitter();
    }
    FavComponent.prototype.changeFav = function () {
        this.isFav = !this.isFav;
        this.chnge.emit({ newValue: this.isFav });
        this.gatewayService.emitData(SAVE_FAVS, this.isFav);
    };
    return FavComponent;
}());
FavComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'ico-fav',
                template: "\n      <div [ngClass]=\"isFav?'icon favorite-fill':'icon favorite-outline'\" (click)=\"changeFav()\"></div>\n  ",
                styles: [""]
            },] },
];
/** @nocollapse */
FavComponent.ctorParameters = function () { return [
    { type: GatewayService, },
]; };
FavComponent.propDecorators = {
    'isFav': [{ type: core.Input },],
    'chnge': [{ type: core.Output },],
};

var SearchKeyPipe = (function () {
    function SearchKeyPipe() {
    }
    SearchKeyPipe.prototype.transform = function (keys, filter) {
        var _this = this;
        if (keys) {
            return keys.filter(function (key) { return _this.searchKeys(key, filter); });
        }
    };
    SearchKeyPipe.prototype.searchKeys = function (key, filter) {
        return key.Key.toLowerCase().indexOf(filter.toLowerCase()) != -1;
    };
    return SearchKeyPipe;
}());
SearchKeyPipe.decorators = [
    { type: core.Pipe, args: [{ name: 'searchKeys' },] },
];
/** @nocollapse */
SearchKeyPipe.ctorParameters = function () { return []; };

var SearchFilterOnObjectPipe = (function () {
    function SearchFilterOnObjectPipe() {
    }
    SearchFilterOnObjectPipe.prototype.transform = function (items, field, value) {
        var _this = this;
        if (!items) {
            return [];
        }
        return items.filter(function (item) { return _this.searchKeys(item, field, value); });
    };
    SearchFilterOnObjectPipe.prototype.searchKeys = function (item, field, filter) {
        return item[field].toLowerCase().indexOf(filter.toLowerCase()) != -1;
    };
    return SearchFilterOnObjectPipe;
}());
SearchFilterOnObjectPipe.decorators = [
    { type: core.Pipe, args: [{ name: 'searchFilterOnObjectKey' },] },
];
/** @nocollapse */
SearchFilterOnObjectPipe.ctorParameters = function () { return []; };

var SwitchComponent = (function () {
    function SwitchComponent() {
        this.chnge = new core.EventEmitter();
        this.rndID = "gwSwitch_" + Math.random();
    }
    SwitchComponent.prototype.changeSwitch = function () {
        this.isTrue = !this.isTrue;
        this.chnge.emit({ newValue: this.isTrue });
    };
    return SwitchComponent;
}());
SwitchComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'btn-switch',
                template: "\n    <div class=\"gw-switch\">\n        <input type=\"checkbox\" class=\"gw-switch-checkbox\" id=\"{{rndID}}\" (change)=\"changeSwitch()\" checked=\"{{isTrue?'checked':''}}\">\n        <label class=\"gw-switch-label\" for=\"{{rndID}}\">\n            <span class=\"gw-switch-inner\"></span>\n            <span class=\"gw-switch-switch\"></span>\n        </label>\n    </div>\n  "
            },] },
];
/** @nocollapse */
SwitchComponent.ctorParameters = function () { return []; };
SwitchComponent.propDecorators = {
    'isTrue': [{ type: core.Input },],
    'chnge': [{ type: core.Output },],
};

exports.LoggerService = LoggerService;
exports.GatewayService = GatewayService;
exports.PulseUtilitiesModule = PulseUtilitiesModule;
exports.HierarchyComponent = HierarchyComponent;
exports.CoFilterPipe = CoFilterPipe;
exports.FavComponent = FavComponent;
exports.SearchKeyPipe = SearchKeyPipe;
exports.SearchFilterOnObjectPipe = SearchFilterOnObjectPipe;
exports.SwitchComponent = SwitchComponent;
exports.ChannelEvent = ChannelEvent;
exports.ContentObject = ContentObject;
exports.COSection = COSection;
exports.HierarchyEmmitOptions = HierarchyEmmitOptions;
exports.Delivery = Delivery;
exports.XLSXParser = XLSXParser;
exports.ParticipantOverview = ParticipantOverview;
exports.VoteResponse = VoteResponse;
exports.Question = Question;
exports.Section = Section;

Object.defineProperty(exports, '__esModule', { value: true });

})));
