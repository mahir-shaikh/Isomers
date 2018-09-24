import { Injectable, EventEmitter, Output } from '@angular/core';
//import { AppConfig } from '../../app.config';
import { Response, Http, Headers, RequestOptions, ResponseOptions } from '@angular/http';
import { Observable, Observer } from 'rxjs/Rx';
import { ContentObject, COSection } from '../../common/classes/contentobject';

@Injectable()
export class GatewayService {

    //private baseUrl: string = '';
    private programKey: string = 'program';
    private stateKey: string = 'componentState';
    public loadingMyPrograms: boolean = false;
    public loadingEventConfig: boolean = false;
    private observable: Promise<any>;
    private rHObservable: Promise<any>;
    private tKObservable: Promise<any>;
    private eventConfigObservable: Promise<any>;
    public myProgram: ContentObject;
    public resources: ContentObject;
    public recentHistory: ContentObject[];
    public secActions: Array<COSection>;
    public selectedActions: Array<COSection> = [];
    private dashboardState: string;
    public newCOParent: ContentObject;
    public eventIcons: Array<string>;
    public modules: Array<any>;
    public iconsPath: string;
    public moduleList: Array<any> = [];
    public topicList: Array<any> = [];
    public currLanguage: string;
    public textConfig: any;
    public languages: Array<any>;
    public allCONames: Array<any>;
    public questions: Array<string>;
    public notifications: Array<any>;
    public eventConfig: any = null;

    public hierarchyKey = 'HIERARCHY';
    public moduleKey = 'MODULE';
    public topicKey = 'TOPIC';
    public sectionKey = 'SECTION';
    public favouriteKey = "FAVOURITE";

    public hostname: string = "http://localhost";
    public baseUrl: string = "http://localhost/PulseServices/";
    public eventsUrl: string = "http://localhost/Wizer/Pages/Events/";
    public wizerServer: string = "http://localhost/";

    @Output() stateChange = new EventEmitter<string>();

    constructor(private http: Http) {
        //var vlu = this.config.value;
        //this.baseUrl = vlu.serviceUrl;
    }

    get(url): Observable<Response> {
        let headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*');
        var options = new RequestOptions({ headers: headers });
        return this.http.get(url, options);
    }


    getMyPrograms(eventId: number, isAuthoring: boolean): Observable<ContentObject> {
        if (this.loadingMyPrograms) {
            return Observable.fromPromise(this.observable).debounceTime(1500);
        }
        // get the myProgram content objects from server
        else if (!this.myProgram) {
            this.loadingMyPrograms = true;
            
            let url = this.baseUrl + "GatewayService.svc/GetContentObjects";
            var body = {
                "eventId": eventId,
                "programKey": this.programKey,
                "stateKey": this.stateKey,
                "resolveCriterias": isAuthoring ? false : true
            }

            this.observable = this.postRequest(url, body)
                .map((data) => this.extractData(data))
                .toPromise()
                .catch(this.handleError);
            return Observable.fromPromise(this.observable);
        }
        else {
            //return cached data
            return this.createObservable(this.myProgram);
            //return this.myProgram;
        }
    }

    getRecentHistory(): Observable<ContentObject[]> {
        if (this.recentHistory && this.recentHistory.length > 0) {
            return this.createObservable(this.recentHistory);
        }
        else {
            let url = this.baseUrl + "GatewayService.svc/RecentHistory";
            this.rHObservable = this.postRequest(url, {})
                .map((data) => this.extractRecentHistory(data))
                .toPromise()
                .catch(this.handleError);
            return Observable.fromPromise(this.rHObservable);
        }
    }

    getEnrolledModuleCount() {
        var enrolledModuleCount = 0;

        for (var i = 0; i < this.myProgram.contentObjects.length; i++) {
            if (this.myProgram.contentObjects[i].enrolled) {
                enrolledModuleCount++;
            }
        }	

        return enrolledModuleCount;
    }

    changeLanguage(eventId: number, languageKey: string) {
        let url = this.baseUrl + "GatewayService.svc/ChangeLanguage";
        var body = {
            "eventId": eventId,
            "languageKey": languageKey
        }
        return this.postRequest(url, body);
    }

    private extractRecentHistory(res: Response): ContentObject[] {
        this.recentHistory = res.json().GetRecentHistoryResult.Contentobject;
        //this.exandDefault();
        for (var i = 0; i < this.recentHistory.length; i++) {
            this.initializeData(this.recentHistory[i]);
        }

        return this.recentHistory;
    }

    getResources() {
        return this.resources;
    }

    deleteCO(coId) {
        let url = this.baseUrl + "GatewayService.svc/DeleteContentObject";
        var body = {
            "contentObjectId": coId
        }
        this.postRequest(url, body).subscribe((c) => {
        });

    }

    saveCOSequence(program) {
        let url = this.baseUrl + "GatewayService.svc/SaveCOSequence";
        let coIds = [];
        for (var i = 0; i < program.contentObjects.length; i++) {
            coIds.push(program.contentObjects[i].id);
        }
        var body = {
            "parentCOId": program.id,
            "childCOIds": coIds
        }
        this.postRequest(url, body).subscribe((c) => {
        });
    }

    postRequest(url: string, body: any): Observable<any> {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var options = new RequestOptions({ headers: headers });
        var params = JSON.stringify(body);

        return this.http.post(url, params, options)
            .map((data) => data)
            .catch(this.handleError);
    }

    public saveCO(program: ContentObject, eventId: string, parentCoId: Number, languageId: Number): Observable<any> {
        let url = this.baseUrl + "GatewayService.svc/SaveContentObject";

        var contentObject = this.convertMetadataFormat(program);

        var body = {
            "contentObject": contentObject,
            "customerEventId": eventId,
            "parentCoId": parentCoId,
            "languageId": languageId
    }

        return this.postRequest(url, body);
    }

    convertMetadataFormat(program: ContentObject) {

        var metadata = [];
        for (var key in program.metadata) {
            metadata.push({
                "Key": key,
                "Value": program.metadata[key]
            })
        }

        var contentObject = {
            "id": program.id,
            "name": program.name,
            "metadata": metadata,
            "section": program.section
        }

        return contentObject;
    }

    private extractData(res: Response): ContentObject {
        let responseJson = res.json().GetContentObjectsResult;

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
    }

    public getNotifications() {
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
    }

    private setExpandedState(obj: ContentObject): void {
        var co = this.getCoById(this.myProgram, obj.id);

        if (co)
            co.expanded = obj.expanded;

        if (obj.contentObjects)
            for (var i = 0; i < obj.contentObjects.length; i++)
                this.setExpandedState(obj.contentObjects[i]);
    }

    setCOToLocalStorage(co: ContentObject) {
        var body = {
            "key": this.programKey,
            "value": JSON.stringify(co)
        };

        let cacheValueURL = this.baseUrl + "CachingService.svc/SetValue";
        // this.get(url)
        //         .map((data) => this.extractData(data))
        this.postRequest(cacheValueURL, body).subscribe(c => { });

        //localStorage.setItem("program", JSON.stringify(co));
    }

    setStateToLocalStorage(state: string) {
        var body = {
            "key": this.stateKey,
            "value": state
        };

        let cacheValueURL = this.baseUrl + "CachingService.svc/SetValue";
        this.postRequest(cacheValueURL, body).subscribe(c => { });
    }

    getCoById(co: ContentObject, id: number): ContentObject {
        var self = this;
        if (co.id === id) return co;
        if (co.contentObjects) {
            var coFound: ContentObject = null;
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
    }

    getCoByName(co: ContentObject, name: string): ContentObject {
        var self = this;
        if (!co) return null;
        if (co.name === name) return co;
        if (co.contentObjects) {
            var coFound: ContentObject = null;
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
    }

    getCoByPath(co: ContentObject, path: string): ContentObject {
        var self = this;
        if (co.path === path) return co;
        if (co.contentObjects) {
            var coFound: ContentObject = null;
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
    }

    setState(state: string) {
        this.dashboardState = state;
        this.stateChange.emit(this.dashboardState);
    }

    public initializeData(co: ContentObject, parentCO?: ContentObject): ContentObject {

        if (Array.isArray(co.metadata)) {
            var metadataObj = {};
            if (co.metadata) {
                for (let i = 0; i < co.metadata.length; i++) {
                    if (co.metadata[i].Value[0].indexOf('\"') !== -1) {
                        co.metadata[i].Value[0] = co.metadata[i].Value[0].replace(/\\\"/g, '\"')
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
    }

    htmlDecode(value: string) {
        var a = document.createElement( 'a' );
        a.innerHTML = value;
        return a.textContent;
    }

    createObservable(data: any): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            observer.next(data);
            observer.complete();
        });
    }

    private handleError(error: any) {
        console.log(error);
        return Observable.throw(error.json().error || 'Server error');
    }

    public loadEventConfig(eventName: string, eventId: number): Observable<any> {
        if (this.loadingEventConfig) {
            return Observable.fromPromise(this.eventConfigObservable).debounceTime(1500);
        }
        else if (!this.eventConfig) {
            this.loadingEventConfig = true;
            let url = this.baseUrl + "GatewayService.svc/GetGatewayConfiguration/" + eventId;
            this.eventConfigObservable = this.get(url)
                .map((data) => this.extractEventConfig(data))
                .toPromise()
                .catch(this.handleError);

            return Observable.fromPromise(this.eventConfigObservable);
        }
        else {
            return this.createObservable(this.eventConfig);
        }
    }

    extractEventConfig(data) {
        this.eventConfig = JSON.parse(data.json().configuration);
        this.eventConfig.wizerServer = this.wizerServer;
        this.eventConfig.eventsUrl = this.eventsUrl;
        this.loadingEventConfig = false;
        return this.eventConfig;
    }

    //Modules Active Data Structure
    modData = {
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
    topData = {
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
    secData = {
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

    testFunctionHere(): string {
        return "In service - " + this.baseUrl;
    }

    genUUID(optChar: string) {
        var d = new Date().getTime();
        var uuid = optChar + 'xxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 6) % 6 | 0;
            d = Math.floor(d / 6);

            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(6);
        });

        return uuid;
    }

    genUUStr(myStr: string) {
        var str = myStr;
        var s = str.toString().replace(/[^a-zA-Z0-9 ]/g, "");
        str = s.replace(/ /g, "_");
        return str.toLowerCase();
    }

    public _observableEmitter: any = {};

    emitData(key, opts) {
        if (this._observableEmitter[key])
            this._observableEmitter[key].emit(opts);
    }

    getEmitter(key) {
        if (key) {
            this._observableEmitter[key] = new EventEmitter();
            return this._observableEmitter[key];
        }
    }

    saveIcon(iconFile, eventId, name) {
        let url = this.baseUrl + "GatewayService.svc/Upload/" + eventId + "/" + name;

        return this.http.post(url, iconFile)
            .map((data) => data)
            .catch(this.handleError);
    }

    jumpToContent(path) {
        window.location.href = this.wizerServer + 'Wizer/MyGateway' + path + "?fromGateway=true";
    }

    logout() {
        localStorage.removeItem('currentUser');
        window.location.href = this.wizerServer + 'Wizer/Wizer/Logout'
    }
    public saveFavourite(coId: string, isFavourite: boolean): Observable<any> {
        let url = this.baseUrl + "GatewayService.svc/AddOrUpdateFavourites";
        var body = {
            "contentObjectId": coId,
            "IsFavourite": isFavourite,
        }

        return this.postRequest(url, body);
    }

    private extractTextConfig(res: Response): any {
        this.textConfig = res.json();
        return this.textConfig;
    }

    getTextConfig(eventId: number): any {
        if (this.textConfig) {
            return this.createObservable(this.textConfig);
        }
        else {
            let url = this.baseUrl + "GatewayService.svc/GetKeys/" + eventId;
            this.tKObservable = this.get(url)
                .map((data) => this.extractTextConfig(data))
                .toPromise()
                .catch(this.handleError);

            return Observable.fromPromise(this.tKObservable);
        }
    }

    saveTextConfig(textConfig: any, eventId: string) {
        let url = this.baseUrl + "GatewayService.svc/SaveKeys";
        var body = {
            "eventId": eventId,
            "coId": this.myProgram.id,
            "values": textConfig.Keys,
        }

        return this.postRequest(url, body);
    }

    saveEnrollScheduleCriterias(maxModules: Number, criterias: Array<any>, enrollable: boolean, schedulable: boolean, id: number) {
        let url = this.baseUrl + "GatewayService.svc/SaveLifeCycle";
        var body = {
            "coId": id,
            "maxModules": maxModules,
            "criterias": criterias,
            "enrollable": enrollable,
            "schedulable": schedulable
        }

        return this.postRequest(url, body);
    }

    saveModuleEnrolledState(id: number) {
        let url = this.baseUrl + "GatewayService.svc/EnrollParticipant";
        var body = {
            "coId": id,
        }
        
         return this.postRequest(url, body);
    }

    getLanguageName() {
      if (this.myProgram) {
          return this.myProgram.languageName;
      }
    }
    getLanguages() {
        return this.languages;
  }
  
  getMonthWiseAvailable(moduleName: string, firstDay: string) {
    
    let url = this.baseUrl + "GatewayService.svc/GetMonthWiseAvailableSessions";
    let body = {
        "startDate" : firstDay ,
        "module" : moduleName
    }
    return this.postRequest(url, body);
  }

  getAvailableSession(moduleName: string, date: string) {
    let url = this.baseUrl + "GatewayService.svc/GetAvailableSessions";
    let body = {
        "startDate" : date ,
        "module" : moduleName
    }
    return this.postRequest(url, body);
  }

  scheduleParticipant(coId: number, sessionId: number, moduleName: string, timezoneOffset: number=0, timezoneName: string) {
    let url = this.baseUrl + "GatewayService.svc/ScheduleParticipant";
    let body = {
        "coId" : coId,
        "sessionId" : sessionId,
        "moduleName" : moduleName,
        "timezoneOffset" : timezoneOffset,
        "timezoneName" : timezoneName
    }
    return this.postRequest(url, body);
  }

  dismissNotifications(notificationIds: Array<number>) {
    
    let url = this.baseUrl + "GatewayService.svc/DismissNotification";
    
    let body = {
        "notificationIds" : notificationIds
    }

    return this.postRequest(url, body);
  }

  getAllCONames(): Array<any> {
      this.allCONames = [];
      if (this.myProgram && this.myProgram.contentObjects && this.myProgram.contentObjects.length > 0) {
        for (let i = 0; i < this.myProgram.contentObjects.length; i++) {
            this.traverseProgramCOs(this.myProgram.contentObjects[i]);
        }
      }

      return this.allCONames;
  } 

  traverseProgramCOs(co) {
        this.allCONames.push({
            "value": co.metadata.title[0],
            "label": co.metadata.title[0],
            "name": co.name
        });

        if (co.contentObjects && co.contentObjects.length > 0) {
            for (let j = 0; j < co.contentObjects.length; j++) {
                this.traverseProgramCOs(co.contentObjects[j]);
            }
        }
    }

    configureGatewayService(configuration: GatewayServiceConfig) {
        console.log('pulseutilities gateway service here');
        console.log(configuration);
        this.hostname = configuration.hostname;
        this.baseUrl = configuration.serviceUrl;
        this.eventsUrl = configuration.eventsUrl;
        this.wizerServer = configuration.wizerServer;
    }
}

export interface GatewayServiceConfig {
    hostname: string;
    serviceUrl: string;
    eventsUrl: string;
    wizerServer: string;
}