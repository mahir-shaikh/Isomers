(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/http'), require('@angular/forms'), require('rxjs/Subject'), require('typescript-collections'), require('rxjs/add/operator/toPromise'), require('rxjs/observable/IntervalObservable'), require('rxjs/add/operator/debounceTime'), require('@btsdigital/jscalc/dist/jsCalc.min'), require('rxjs/add/operator/auditTime'), require('rxjs/BehaviorSubject'), require('@btsdigital/pulseutilities'), require('moment/moment'), require('@btsdigital/pulsesignalr'), require('numeral/numeral'), require('@angular/router'), require('nouislider'), require('ngx-bootstrap'), require('lodash'), require('highcharts/js/highcharts')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', '@angular/http', '@angular/forms', 'rxjs/Subject', 'typescript-collections', 'rxjs/add/operator/toPromise', 'rxjs/observable/IntervalObservable', 'rxjs/add/operator/debounceTime', '@btsdigital/jscalc/dist/jsCalc.min', 'rxjs/add/operator/auditTime', 'rxjs/BehaviorSubject', '@btsdigital/pulseutilities', 'moment/moment', '@btsdigital/pulsesignalr', 'numeral/numeral', '@angular/router', 'nouislider', 'ngx-bootstrap', 'lodash', 'highcharts/js/highcharts'], factory) :
	(factory((global['ngx-isomer-core'] = {}),global.core,global.common,global.http,global.forms,global.Subject,global.Collections,null,global.IntervalObservable,null,global.jsCalc,null,global.BehaviorSubject,global.pulseutilities,global.moment,global.pulsesignalr,global.numeral,global.router,global.noUiSlider,global.ngxBootstrap,global._,global._Highcharts));
}(this, (function (exports,core,common,http,forms,Subject,Collections,toPromise,IntervalObservable,debounceTime,jsCalc,auditTime,BehaviorSubject,pulseutilities,moment,pulsesignalr,numeral,router,noUiSlider,ngxBootstrap,_,_Highcharts) { 'use strict';

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

/**
 * The service that is responsible for all cross component/service communication using RxJs/Observables.
 *
 * The CommunicatorService makes use of rxjs/Subject to trigger events when needed.
 */
var CommunicatorService = (function () {
    /**
     * Constructor function for Communicator service
     *
     * @param {LoggerService} logger Logger service reference for any and all logging requirements
     *
     */
    function CommunicatorService(logger) {
        this.logger = logger;
        /**
         * Emitters dictionary for storing emitter keys and subject pair
         *
         */
        this.emitters = new Collections.Dictionary();
    }
    /**
     * Returns the emitter pair from the emitters dictionary.
     *
     * @param {string} emitterKey The key for emitter reference in emitters dictionary.
     *
     * @return {Subject<any>} The emitter reference for the given emitterKey.
     */
    CommunicatorService.prototype.getEmitter = function (emitterKey) {
        if (!this.emitterExists(emitterKey)) {
            this.createEmitter(emitterKey);
        }
        return this.emitters.getValue(emitterKey);
    };
    /**
     * Triggers an event on the emitter subject with optional data
     *
     * @param {string} emitterKey The key for emitter reference in emitters dictionary.
     *
     * @param {data} [data] Data to be passed along with the event trigger on the Subject
     */
    CommunicatorService.prototype.trigger = function (emitterKey, data) {
        // consider if we want to create an emitter and emit if its not created already
        // emit data/event if emitter exists
        if (this.emitterExists(emitterKey)) {
            this.emitters.getValue(emitterKey).next(data);
        }
    };
    /**
     * Create a new emitter pair and add it to the emitters dictionary
     *
     * @param {string} emitterKey The key for emitter reference in emitters dictionary.
     *
     */
    CommunicatorService.prototype.createEmitter = function (emitterKey) {
        if (this.emitterExists(emitterKey)) {
            this.logger.log('Emitter for ' + emitterKey + ' already exists!');
            return;
        }
        this.emitters.setValue(emitterKey, new Subject.Subject());
    };
    /**
     * Check if the emitter exists for the given dictionary key
     *
     * @param {string} emitterKey The key for emitter reference in emitters dictionary.
     *
     * @return {Boolean} True/False value depending on whether emitter exists
     */
    CommunicatorService.prototype.emitterExists = function (emitterKey) {
        return this.emitters.containsKey(emitterKey);
    };
    return CommunicatorService;
}());
CommunicatorService.decorators = [
    { type: core.Injectable },
];
/** @nocollapse */
CommunicatorService.ctorParameters = function () { return [
    { type: LoggerService, },
]; };

/**
 * List of constants to be used across the app
 *
 */
/* tslint:disable */
/**
 * List of constants to be used across the app
 *
 */ var Constants = {
    "APP_READY": "app_ready",
    "MODEL_LOADED": "model_loaded",
    "MODEL_LOAD_PROGRESS": "model_load_progress",
    "MODEL_CALC_COMPLETE": "model_calc_complete",
    "CONNECTION_MODE": {
        "POLL": "POLL",
        "PUSH": "PUSH"
    },
    "STORAGE_MODES": {
        "PULSE": "pulse",
        "LOCAL": "local",
        "MIXED": "mixed"
    },
    "PULSE_API": {
        "CALCBINDER": {
            "SET_VALUE": "/Wizer/CloudFront/SetCacheValue",
            "GET_VALUE": "/Wizer/CloudFront/GetCacheValue",
            "CLEAR_KEY": "/Wizer/CloudFront/ClearCacheKey",
            "CLEAR_CACHE": "/Wizer/CloudFront/ClearCache"
        },
        "PARTICIPANT": "/Wizer/CloudFront/Participant" // Participant Details
    },
    "RETURN_URL": "return_url",
    "CALC_SERVICE": {
        "EMIT_CHANGE_DELAY": 300,
        "SAVE_STATE_TO_STORAGE_DELAY": 5000,
        "CALC_COMPLETE": "calc_complete",
        "MODEL_STATE": "model_state:"
    },
    "TEXT_ENGINE": {
        "GENERAL": "GEN",
        "FILE_PATH": "./assets/content/",
        "FILE_NAME": "EventContent",
        "FILE_EXT": ".json",
        "DEFAULT_LANG": "en",
        "LANGUAGE_LOADED": "language_loaded"
    }
};

/**
 * HttpWrapper service used for sending Get/ Post requests to pulse server
 *
 */
var HttpWrapperService = (function () {
    /**
     * Constructor for HttpWrapper service
     *
     * @param {Http} http Angular Http service instance
     */
    function HttpWrapperService(http$$1) {
        this.http = http$$1;
        /**
         * Hostname of the remote pulse server to connect
         *
         */
        this.hostname = window.location.protocol + '//' + window.location.hostname;
    }
    /**
     * Unwrap function to parse response from pulse server as json data
     *
     * @return {JSON}
     */
    HttpWrapperService.unwrapBody = function (response) {
        try {
            return response.json();
        }
        catch (e) {
            return null;
        }
    };
    /**
     * Post json utility to send post request to pulse server. But this will not unwrap the response body
     * @param relativeUrl Relative url for the REST api to send request to
     * @param body Payload to be sent as part of post request
     */
    HttpWrapperService.prototype.postJsonWithNakedResponse = function (relativeUrl, body) {
        return this.http.post(this.hostname + relativeUrl, body, { withCredentials: true })
            .map(function (data) { return data; })
            .catch(function (error) { return error; });
    };
    /**
     * Post json utility to send post request to pulse server
     *
     * @param {string} relativeUrl Relative url for the REST api to send request to
     *
     * @param {any} body Payload to be sent as part of post request
     *
     * @return {Promise<any>}
     *
     */
    HttpWrapperService.prototype.postJson = function (relativeUrl, body) {
        var req = this.http.post(this.hostname + relativeUrl, body, { withCredentials: true });
        return req.toPromise().then(HttpWrapperService.unwrapBody);
    };
    /**
     * Get json utility to send get request to pulse server
     *
     * @param {string} relativeUrl Relative url for the REST api to send request to
     *
     * @param {any} params Payload to be sent as params with the request
     *
     * @return {Promise<any>}
     *
     */
    HttpWrapperService.prototype.getJson = function (relativeUrl, params) {
        var req = this.http.get(this.hostname + relativeUrl + (params ? '?' + params : ''), { withCredentials: true });
        return req.toPromise();
    };
    /**
     * Set hostname for the remote pulse server for making requests to
     *
     * @param {string} hostname Hostname of the remote pulse server
     */
    HttpWrapperService.prototype.setHostName = function (hostname) {
        this.hostname = hostname;
    };
    return HttpWrapperService;
}());
HttpWrapperService.decorators = [
    { type: core.Injectable },
];
/** @nocollapse */
HttpWrapperService.ctorParameters = function () { return [
    { type: http.Http, },
]; };

// import Collections = require('typescript-collections');
/**
 * Storage modes available to application. Can be either MODES.LOCAL | MODES.PUSE | MODES.MIXED
 *
 */
var MODES = Constants.STORAGE_MODES;
/**
 * Storage service is used to store data to localStorage and / or Pulse storage based on the mode set
 *
 */
var StorageService = (function () {
    /**
     * Constructor for the service
     *
     * @param {LoggerService} logger Instance of logger service
     *
     * @param {HttpWrapperService} httpWrapper Instance of httpWrapperService for data transmission to pulse
     *
     */
    function StorageService(logger, httpWrapper) {
        this.logger = logger;
        this.httpWrapper = httpWrapper;
        /**
         * Storage mode for the service.
         *
         * This can be either Constants.STORAGE_MODES.LOCAL | Constants.STORAGE_MODES.PULSE | Constants.STORAGE_MODES.MIXED
         */
        this.mode = MODES.LOCAL;
        /**
         * Model state dictionary for the service.
         *
         */
        this._state = new Collections.Dictionary();
    }
    /**
    * Fetch the value for key from storage.
    *
    * When using mixed mode, Pulse Storage will be preferred over localStorage.
    *
    * @param {string} key Key for which data is to be retrieved
    *
    * @param {boolean} [forceFromPersistentStorage] Force data retrieval from persistent storage even if its available in local store
    *
    * @return {Promise<any>} Returns promise which when resolves provides the value from data store.
    */
    StorageService.prototype.getValue = function (key, forceFromPersistentStorage) {
        if (forceFromPersistentStorage === void 0) { forceFromPersistentStorage = false; }
        // return null;
        var value = this._state.getValue(key);
        if (value && !forceFromPersistentStorage) {
            return Promise.resolve(value);
        }
        // if fetching from persistentstorage
        switch (this.mode) {
            case MODES.MIXED:
                return this.getValueFromPulse(key).catch(this.getValueFromLocal.bind(this, key));
            case MODES.PULSE:
                return this.getValueFromPulse(key);
            case MODES.LOCAL:
                return this.getValueFromLocal(key);
        }
    };
    /**
     * Set value for key to storage.
     *
     * @param {string} key Key for which data needs to be saved against in data store
     *
     * @param {value} value Value which needs to be saved in the data store
     *
     * @return {Promise<any>} Returns promise that is resolved when save operation is complete
     */
    StorageService.prototype.setValue = function (key, value) {
        this.updateState(key, value);
        switch (this.mode) {
            case MODES.PULSE:
                return this.setValueToPulse(key, value);
            case MODES.LOCAL:
                return this.setValueToLocal(key, value);
            case MODES.MIXED:
                return Promise.all([this.setValueToPulse(key, value),
                    this.setValueToLocal(key, value)]);
        }
    };
    /**
     * Clear data for given key from data store
     *
     * @param {string} key Key for which data needs to be cleared
     *
     * @return {Promise<any>} Returns promise that gets resolved when operation is completed
     */
    StorageService.prototype.clear = function (key) {
        this.updateState(key, null, true);
        switch (this.mode) {
            case MODES.PULSE:
                return this.clearKeyOnPulse(key);
            case MODES.LOCAL:
                return this.clearKeyOnLocal(key);
            case MODES.MIXED:
                return Promise.all([this.clearKeyOnPulse(key), this.clearKeyOnLocal(key)]);
        }
    };
    /**
     * Clear data store completely. This will __destroy__ and re-create the data store.
     *
     * @return {Promise<any>} Returns promise which is resolved when data-store is cleared
     *
     */
    StorageService.prototype.clearAll = function () {
        this._state = new Collections.Dictionary();
        switch (this.mode) {
            case MODES.PULSE:
                return this.clearAllOnPulse();
            case MODES.LOCAL:
                return this.clearAllOnLocal();
            case MODES.MIXED:
                return Promise.all([this.clearAllOnPulse(), this.clearAllOnLocal()]);
        }
    };
    /**
     * Force sync local data store to persistent storage
     *
     * @return {Promise<any>} Returns promise that is resolved once data-store is synced to persistent storage
     */
    StorageService.prototype.forceSync = function () {
        var _this = this;
        var promises = [];
        return new Promise(function (resolve, reject) {
            _this._state.forEach(function (key, value) {
                promises.push(_this.setValue(key, value));
            });
            Promise.all(promises)
                .then(resolve)
                .catch(reject);
        });
    };
    /**
     * Set the mode for storage service
     *
     * @param {string} mode Mode for the storage service
     *
     */
    StorageService.prototype.setMode = function (mode) {
        this.mode = mode;
    };
    /**
     * Get the mode for storage service
     *
     * @return {string} Returns storage mode for the service
     */
    StorageService.prototype.getMode = function () {
        return this.mode;
    };
    /**
    * Fetch the value for key from pulse storage.
    *
    * @param {string} key Key for which data is to be retrieved
    *
    * @return {Promise<any>} Returns promise which when resolves provides the value from data store.
    */
    StorageService.prototype.getValueFromPulse = function (key) {
        var _this = this;
        var data = 'key=' + key;
        return new Promise(function (resolve, reject) {
            _this.httpWrapper
                .getJson(Constants.PULSE_API.CALCBINDER.GET_VALUE, data)
                .then(function (response) {
                var jsonData = null;
                try {
                    // try and convert the response to json
                    jsonData = (response.json()) ? response.json() : null;
                }
                catch (err) {
                    // error converting response as a valid json
                    // reject(err);
                }
                resolve(jsonData);
            })
                .catch(function (err) {
                // this.logger.log('Error fetching value from Pulse', err);
                reject(err);
            });
        });
    };
    /**
     * Set value for key to pulse storage.
     *
     * @param {string} key Key for which data needs to be saved against in data store
     *
     * @param {value} value Value which needs to be saved in the data store
     *
     * @return {Promise<any>} Returns promise that is resolved when save operation is complete
     */
    StorageService.prototype.setValueToPulse = function (key, value) {
        var _this = this;
        var data = {
            key: key,
            value: value.toString()
        };
        return new Promise(function (resolve, reject) {
            _this.httpWrapper
                .postJson(Constants.PULSE_API.CALCBINDER.SET_VALUE, data)
                .then(function (response) {
                resolve(response);
            })
                .catch(function (err) {
                // this.logger.log('Error setting value to Pulse', err);
                reject(err);
            });
        });
    };
    /**
    * Fetch the value for key from local storage.
    *
    * @param {string} key Key for which data is to be retrieved
    *
    * @return {Promise<any>} Returns promise which when resolves provides the value from data store.
    */
    StorageService.prototype.getValueFromLocal = function (key) {
        return Promise.resolve(window.localStorage.getItem(key));
    };
    /**
     * Set value for key to local storage.
     *
     * @param {string} key Key for which data needs to be saved against in data store
     *
     * @param {value} value Value which needs to be saved in the data store
     *
     * @return {Promise<any>} Returns promise that is resolved when save operation is complete
     */
    StorageService.prototype.setValueToLocal = function (key, value) {
        try {
            window.localStorage.setItem(key, value);
            return Promise.resolve();
        }
        catch (err) {
            return Promise.reject(err);
        }
    };
    /**
     * Clear data for given key from pulse storage
     *
     * @param {string} key Key for which data needs to be cleared
     *
     * @return {Promise<any>} Returns promise that gets resolved when operation is completed
     */
    StorageService.prototype.clearKeyOnPulse = function (key) {
        // return Promise.resolve();
        var data = {
            key: key
        };
        return this.httpWrapper.postJson(Constants.PULSE_API.CALCBINDER.CLEAR_KEY, data);
    };
    /**
     * Clear data on pulse storage completely.
     *
     * @return {Promise<any>} Returns promise which is resolved when pulse storage is cleared
     *
     */
    StorageService.prototype.clearAllOnPulse = function () {
        // return Promise.resolve();
        return this.httpWrapper.postJson(Constants.PULSE_API.CALCBINDER.CLEAR_CACHE, {});
    };
    /**
     * Clear data for given key from localStorage
     *
     * @param {string} key Key for which data needs to be cleared
     *
     * @return {Promise<any>} Returns promise that gets resolved when operation is completed
     */
    StorageService.prototype.clearKeyOnLocal = function (key) {
        window.localStorage.removeItem(key);
        return Promise.resolve();
    };
    /**
     * Clear data on local storage completely.
     *
     * @return {Promise<any>} Returns promise which is resolved when local storage is cleared
     *
     */
    StorageService.prototype.clearAllOnLocal = function () {
        window.localStorage.clear();
        return Promise.resolve();
    };
    /**
     * Updates the state of local data-store for quick retrieval of data
     *
     * @param {string} key Key for which state needs to be updated
     *
     * @param {string} value Value which needs to be set to data store
     *
     * @param {Boolean} removeKey Whether the key should be removed from data-store. Defaults to __false__.
     */
    StorageService.prototype.updateState = function (key, value, removeKey) {
        if (removeKey === void 0) { removeKey = false; }
        if (removeKey) {
            this._state.remove(key);
        }
        else {
            this._state.setValue(key, value);
        }
    };
    return StorageService;
}());
StorageService.decorators = [
    { type: core.Injectable },
];
/** @nocollapse */
StorageService.ctorParameters = function () { return [
    { type: LoggerService, },
    { type: HttpWrapperService, },
]; };

/**
 * Delay for emitting change event
 *
 */
var EMIT_CHANGE_DELAY = Constants.CALC_SERVICE.EMIT_CHANGE_DELAY;
/**
 * Delay for saving data to storage
 *
 */
var SAVE_STATE_TO_STORAGE_DELAY = Constants.CALC_SERVICE.SAVE_STATE_TO_STORAGE_DELAY;
/**
 * Key for calc complete event trigger
 *
 */
var CALC_COMPLETE = Constants.CALC_SERVICE.CALC_COMPLETE;
/**
 * Key for model state saved in storage
 *
 */
var MODEL_STATE = Constants.CALC_SERVICE.MODEL_STATE;
/**
 * CalcService is responsible for building the model instace using jsCalc and setting / fetching data to it.
 *
 */
var CalcService = (function () {
    /**
     * Constructor function for service
     *
     * @param {CommunicatorService} communicator CommunicatorService instance
     *
     * @param {StorageService} storageService StorageService instance
     *
     * @param {LoggerService} logger LoggerService instance
     *
     */
    function CalcService(communicator, storageService, logger) {
        this.communicator = communicator;
        this.storageService = storageService;
        this.logger = logger;
    }
    /**
     * Function to check whether calcApi is ready for operations
     *
     * @return {Boolean}
     */
    CalcService.prototype.isApiReady = function () {
        return (this.api) ? true : false;
    };
    /**
     * GetApi function to initialize and get instance of Api
     *
     * @param {jsCalc.CalcOptions} options Options to initialize calcApi
     *
     * @return Promise<any>
     */
    CalcService.prototype.getApi = function (options) {
        if (this.api) {
            return Promise.resolve(this);
        }
        else if (this.modelLoadingPromise === undefined) {
            return this.modelLoadingPromise = this.initialize(options);
        }
        return this.modelLoadingPromise;
    };
    /**
     * Initialize model using jsCalc api. We also initialize subscribers to trigger model load / update events.
     *
     * @param {jsCalc.CalcOptions} options Options to initialize calcApi
     *
     * @return Promise<any>
     */
    CalcService.prototype.initialize = function (options) {
        var _this = this;
        // setup the calculation complete Observer that emits
        // when a calculation chain is completed in the model
        // we add a delay of EMIT_CHANGE_DELAY so as to trigger the event
        // at the end of the delay and not flood any UI element to re-render too frequently
        this.calculationCompleteEmitter = this.communicator
            .getEmitter(CALC_COMPLETE)
            .auditTime(EMIT_CHANGE_DELAY)
            .subscribe(function () {
            _this.triggerModelComplete();
        });
        this.saveStateEmitter = this.communicator
            .getEmitter(CALC_COMPLETE)
            .auditTime(SAVE_STATE_TO_STORAGE_DELAY)
            .subscribe(function () {
            // this.logger.log('save state emitter triggered');
            _this.saveStateToStorage();
        });
        this.buildOptions = options;
        return this.getStateFromStorage()
            .then(function (modelState) {
            return _this.loadModel(modelState);
        });
    };
    /**
     * Triggers model load complete event
     *
     */
    CalcService.prototype.triggerModelComplete = function () {
        this.communicator.trigger(Constants.MODEL_CALC_COMPLETE);
    };
    /**
     * Load calc model using jsCalc api
     *
     * @param {string|JSON} [modelData] Optional data to be appended to the model instance
     *
     * @return {Promise<any>}
     */
    CalcService.prototype.loadModel = function (modelData) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.buildModel()
                .then(function (api) {
                _this.api = api;
                _this.appendDataToModel(modelData)
                    .then(function () {
                    _this.communicator.trigger(Constants.MODEL_LOADED, true);
                    _this.saveStateToStorage()
                        .then(resolve)
                        .catch(function (err) {
                        _this.logger.log('Saving model state failed ', err);
                        reject(err); // return model api
                    });
                })
                    .catch(function (err) {
                    _this.logger.log('Failed - Could not append data to model', err);
                    reject(err);
                });
            })
                .catch(function (err) {
                _this.logger.log('Failed to build the model!', err);
                reject(err);
            });
        });
    };
    /**
     * Function to build/rebuild calc model using jsCalc
     *
     */
    CalcService.prototype.buildModel = function () {
        var _this = this;
        var options = this.buildOptions || { courseActions: null };
        return new Promise(function (resolve, reject) {
            try {
                options.loadCallback = function () {
                    resolve(this);
                };
                options.buildProgressCallback = function (progressOb) {
                    _this.onProgress(progressOb);
                };
                // tslint:disable-next-line
                new jsCalc(options);
            }
            catch (err) {
                _this.logger.log('Error building model', err);
                reject(err);
            }
        });
    };
    /**
     * On progress trigger to transmit progress to any subscribers
     *
     */
    CalcService.prototype.onProgress = function (progressOb) {
        var progress = progressOb.numComplete / progressOb.numTotal;
        // this.logger.log(progress);
        this.communicator.trigger(Constants.MODEL_LOAD_PROGRESS, progress);
    };
    /**
     * Get value from calcModel
     *
     * @param {string} refName Range ref for which value needs to be returned
     *
     * @param {Boolean} rawValue Fetch raw value instead of formatted value from model
     *
     * @return {string}
     */
    CalcService.prototype.getValue = function (refName, rawValue) {
        if (rawValue) {
            return this.api.getRawValue(refName);
        }
        return this.api.getValue(refName);
    };
    /**
     * Get value from calcModel with yearRef. Where year ref is a range ref that points to current year
     *
     * @param {string} refName Range ref for which value needs to be returned
     *
     * @param {string} yearRef This is the named range for current year/round, if it needs to be appended
     * to the named ranges in range ref array
     *
     * @param {Boolean} rawValue Fetch raw value instead of formatted value from model
     *
     * @return {string}
     */
    CalcService.prototype.getValueForYear = function (refName, yearRef, rawValue) {
        if (yearRef) {
            var year = this.getValue(yearRef, rawValue);
            if (typeof year !== 'undefined' && year !== '') {
                refName += '_R' + year;
            }
        }
        return this.getValue(refName, rawValue);
    };
    /**
     * Set value to calcModel
     *
     * @param {string} refName Range ref for which value needs to be returned
     *
     * @param {any} value Value that needs to be set to model
     *
     * @return {Promise<any>}
     */
    CalcService.prototype.setValue = function (refName, value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // added try catch so setValue doesnt throw jsCalc errors and now this will resolve to a rejected promise if failing
            try {
                _this.api.setValue(refName, value)
                    .then(function (emitEventOnComplete) {
                    if (emitEventOnComplete === void 0) { emitEventOnComplete = true; }
                    _this.communicator.trigger(CALC_COMPLETE);
                    _this.saveStateToStorage();
                    resolve();
                }, reject);
            }
            catch (e) {
                reject(e);
            }
        });
    };
    /**
     * Set value from calcModel with yearRef. Where year ref is a range ref that points to current year
     *
     * @param {string} refName Range ref for which value needs to be returned
     *
     * @param {any} value Value that needs to be set to model
     *
     * @param {string} yearRef This is the named range for current year/round, if it needs to be appended to
     * the named ranges in range ref array
     *
     * @param {Boolean} rawValue Fetch raw value instead of formatted value from model
     *
     * @return {Promise<any>}
     */
    CalcService.prototype.setValueForYear = function (refName, value, yearRef) {
        if (yearRef) {
            var year = this.getValue(yearRef);
            if (typeof year !== 'undefined') {
                refName += '_R' + year;
            }
        }
        return this.setValue(refName, value);
    };
    /**
     * Get the emitter for calc-updates
     * @deprecated
     *
     * @return {Observable<any>}
     */
    CalcService.prototype.getObservable = function () {
        return this.communicator.getEmitter(Constants.MODEL_CALC_COMPLETE);
    };
    /**
     * Append data to model state
     *
     * @param {string|JSON} stateOb Stringified json / json data that needs to be appended to model
     *
     * @return {Promise<any>}
     */
    CalcService.prototype.appendDataToModel = function (stateOb) {
        var _this = this;
        var jsonState;
        var arrPromises = [];
        // if stateobject is null / undefined nothing to append to model
        if (!stateOb) {
            return Promise.resolve();
        }
        // if stateobject is a string - try and parse as json object and append to model
        if (typeof stateOb === 'string') {
            try {
                jsonState = JSON.parse(stateOb);
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        // if stateobject is an object, use it as is and append to model
        if (typeof stateOb === 'object') {
            jsonState = stateOb;
        }
        return new Promise(function (resolve, reject) {
            Object.keys(jsonState)
                .forEach(function (key) {
                arrPromises.push(_this.setValue(key, jsonState[key]));
            });
            Promise.all(arrPromises)
                .then(resolve)
                .catch(reject);
        });
    };
    /**
     * Load model with an optional model state
     *
     * @param {string|JSON} [modelState] optional model state to instantiate model with
     *
     * @return {Promise<any>}
     */
    CalcService.prototype.setModelState = function (modelState) {
        return this.loadModel(modelState);
    };
    /**
     * Force recalculate model
     *
     * @return {Promise<any>}
     */
    CalcService.prototype.forceRecalculate = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.api.getBook().recalculate();
            _this.api.addCalculationCallback(function () {
                _this.communicator.trigger(CALC_COMPLETE);
                resolve();
            });
        });
    };
    /**
     * Save model state to data-store using {@link StorageService}
     *
     * @return {Promise<any>}
     */
    CalcService.prototype.saveStateToStorage = function () {
        return this.storageService.setValue(MODEL_STATE, this.getModelState());
    };
    /**
     * Get current calc model state as stringified json
     *
     * @return {string}
     */
    CalcService.prototype.getModelState = function () {
        return this.api.getJSONState();
    };
    /**
     * Fetch model state from data-store using {@link StorageService}
     *
     */
    CalcService.prototype.getStateFromStorage = function () {
        return this.storageService.getValue(MODEL_STATE);
    };
    /**
     * Export data from calc model as dictionary object
     *
     * @return {any}
     */
    CalcService.prototype.exportData = function (exp, flags) {
        var _this = this;
        flags = (!exp) ? 'i' : flags;
        exp = (exp) ? exp : '^tl(in|out)put.+$';
        var pattern = new RegExp(exp, flags), rangeNames = this.api.getNames(pattern), out = {};
        rangeNames.forEach(function (name) {
            try {
                var val = _this.api.getRawValue(name);
                out[name] = val;
            }
            catch (e) {
                // try next ref
            }
        });
        return out;
    };
    /**
     * Destroy function to unsubscribe existing emitters
     *
     */
    CalcService.prototype.destroy = function () {
        this.saveStateEmitter.unsubscribe();
        this.calculationCompleteEmitter.unsubscribe();
    };
    return CalcService;
}());
CalcService.decorators = [
    { type: core.Injectable },
];
/** @nocollapse */
CalcService.ctorParameters = function () { return [
    { type: CommunicatorService, },
    { type: StorageService, },
    { type: LoggerService, },
]; };

/**
  * This class is a wrapper for the manifest configuration which will be injected on app initilisation
  */
var ManifestService = (function () {
    function ManifestService() {
    }
    /**
     * This function will set the configuration for the various isomer services
     *
     * @param {Connect.Manifest} config config object typed to Connect.Manifest inteface
     *
     * @return nothing
     */
    ManifestService.prototype.setConfig = function (config) {
        this.configuration = config;
        this.validateManifest();
        this._state = new BehaviorSubject.BehaviorSubject(this.configuration);
        this.State = this._state.asObservable();
    };
    /**
    * This is a private function which is called internally to check if the configuration has correct structure and no null values
    * that could break the code later
    */
    ManifestService.prototype.validateManifest = function () {
        if (this.configuration.config.questionsToSend && this.configuration.config.questionsToReceive) {
            this.loopQuestions('questionsToSend');
            this.loopQuestions('questionsToReceive');
        }
        else {
            throw new Error('Both config.questionsToSend and config.questionsToReceive must be present in manifest');
        }
        if (!this.configuration.config.hostName || !this.configuration.config.eventTitle) {
            throw new Error('config.hostName and config.eventTitle must both be present in the manifest');
        }
    };
    /**
     *
     * This is a private function which is called internally to check if the configuration has correct structure and no null values
     * that could break the code later
     *
     * @param listName could be either questionsToSend or questionsToRecieve
     */
    ManifestService.prototype.loopQuestions = function (listName) {
        var list = listName === 'questionsToSend' ? this.configuration.config.questionsToSend : this.configuration.config.questionsToReceive;
        list.forEach(function (q, i) {
            if (!q.questionName || !q.rangeName) {
                throw new Error('Manifest inconsistency found at config.' + listName + ' at index: ' + i + ' (Missing rangeName or questionName)');
            }
        });
        for (var _i = 0, _a = Object.keys(list); _i < _a.length; _i++) {
            var i = _a[_i];
            var q = list[i];
            if (!q.questionName || !q.rangeName) {
                throw new Error('Manifest inconsistency found at config.' + listName + ' at index: ' + i + ' (Missing rangeName or questionName)');
            }
        }
    };
    /**
    * This function will set the current state of manifest configuration
    *
    * @param {Connect.Manifest} config config object typed to Connect.Manifest inteface.
    *
    * @return nothing
    */
    ManifestService.prototype.SetState = function (state) {
        this._state.next(state);
    };
    /**
    * This function will get the next state of configuration
    *
    * @return {Connect.Manifest} updated version of config object typed to Connect.Manifest inteface.
    *
    */
    ManifestService.prototype.Get = function () {
        return this._state.getValue();
    };
    return ManifestService;
}());
ManifestService.decorators = [
    { type: core.Injectable },
];
/** @nocollapse */
ManifestService.ctorParameters = function () { return []; };

/**
  * class defining the Authentication Failed error
  * This error is thrown when the api calls to pulse fail with invalid authentication
  * Main reasons are cloudfront cookies missing
  */
var AuthenticationError = (function () {
    /**
     * This is the object which contains error message and all other details about the error
     * @param object Any
     */
    function AuthenticationError(object) {
        this.originalObj = object;
        this.unauthenticated = true;
    }
    return AuthenticationError;
}());

/**
* class defining the Request Failed error
* This is thrown when the http request call fails
* reason could be an http error or netwrok error
*/
var RequestFailedError = (function () {
    /**
     * This is any object which would send the error message and any details related to the error
     * @param res Any
     * */
    function RequestFailedError(res) {
        this.message = res.errCode + ':' + (res.errMsg || res.message);
        this.success = res.success;
    }
    return RequestFailedError;
}());

/**
* This is the service which calls the api functions and returns values needed
*/
var ConnectService = (function () {
    /**
    * Constructor Connect service
    *
    * @param {HttpWrapperService} httpWrapperService HttpWrapperService instance
    *
    */
    function ConnectService(httpWrapperService) {
        var _this = this;
        this.httpWrapperService = httpWrapperService;
        /**
       * Get questions ids of the shornames mentioned in manifest configuration
       */
        this.getQuestionIds = function (state) {
            var options = {
                questionNames: ConnectService.getAllQuestionNames(state)
            };
            return _this.httpWrapperService.postJson('/Wizer/CloudFront/GetAllQuestions', options)
                .then(ConnectService.handleAuthenticationError)
                .then(function (questions) {
                // We always expect an array of questions
                if (Array.isArray(questions)) {
                    var questionIds = {};
                    for (var _i = 0, questions_1 = questions; _i < questions_1.length; _i++) {
                        var q = questions_1[_i];
                        questionIds[q.ShortName] = q.Id;
                    }
                    return ConnectService.mapAndValidateQuestionIds(state, questionIds);
                }
                else {
                    if (typeof questions.success !== 'undefined' && !questions.success) {
                        throw new RequestFailedError(questions);
                    }
                    throw new AuthenticationError(questions);
                }
            });
        };
        /**
       * Save the votes to the backed in bulk.
       * This is used by UploadQueue in connect throttler
       */
        this.voteManyQuestionsFromJson = function (state) {
            var responses = [];
            // Detect if questionIds have been fetched at all
            if (!state.questionIds) {
                throw new Error('Question Ids not fetched');
            }
            for (var _i = 0, _a = state.config.questionsToSend; _i < _a.length; _i++) {
                var q = _a[_i];
                responses.push({
                    questionId: parseInt(q.questionId, 10),
                    responseText: q.responseText
                });
            }
            if (responses.length === 0) {
                return Promise.resolve(state);
            }
            var payload = {
                votes: responses
            };
            return _this.httpWrapperService.postJson('/Wizer/CloudFront/VoteManyQuestionsFromJson', { votesJson: JSON.stringify(payload) })
                .then(ConnectService.handleAuthenticationError)
                .then(function (res) {
                if (!res.success) {
                    throw new RequestFailedError(res);
                }
                return state;
            });
        };
        /**
       * Fetch my votes from backend.
       * This is used by downloadQueue in connect throttler
       */
        this.getMyVotes = function (state) {
            var questionIds = {
                questionIds: ConnectService.getQuestionIdsToReceive(state)
            };
            if (questionIds.questionIds.length === 0) {
                state.votes = {};
                return Promise.resolve(state);
            }
            return _this.httpWrapperService.postJson('/Wizer/CloudFront/GetMyVotes', questionIds)
                .then(ConnectService.handleAuthenticationError)
                .then(function (res) {
                if (res.success) {
                    state.participantId = res.participantId;
                    state.votes = {};
                    for (var _i = 0, _a = res.votes; _i < _a.length; _i++) {
                        var vote = _a[_i];
                        state.votes[vote.QuestionId] = vote.ResponseText;
                    }
                    return state;
                }
                else {
                    throw new RequestFailedError(res);
                }
            });
        };
        /**
     * Fetch my foreman votes from backend.
     * This is used by downloadQueue in connect throttler
     */
        this.getMyForemanVotes = function (state) {
            var params = {
                questionIds: ConnectService.getForemanQuestionIdsToReceive(state),
                trackQuestionId: ConnectService.getTrackQuestionId(state)
            };
            if (params.questionIds.length === 0) {
                state.foremanvotes = {};
                return Promise.resolve(state);
            }
            return _this.httpWrapperService.postJson('/Wizer/CloudFront/GetMyForemanVotes', params)
                .then(ConnectService.handleAuthenticationError)
                .then(function (res) {
                if (res.success) {
                    state.foremanId = res.participantId;
                    state.foremanvotes = {};
                    for (var _i = 0, _a = res.votes; _i < _a.length; _i++) {
                        var vote = _a[_i];
                        state.foremanvotes[vote.QuestionId] = vote.ResponseText;
                    }
                    return state;
                }
                else {
                    throw new RequestFailedError(res);
                }
            });
        };
    }
    /**
 * loop throug the maniges and fetch all used question names from the questionsToReceive and questionsToSend nodes
 */
    ConnectService.getAllQuestionNames = function (state) {
        var names = [];
        for (var _i = 0, _a = state.config.questionsToSend; _i < _a.length; _i++) {
            var q = _a[_i];
            names.push(q.questionName);
        }
        for (var _b = 0, _c = state.config.questionsToReceive; _b < _c.length; _b++) {
            var q = _c[_b];
            names.push(q.questionName);
        }
        if (state.config.foremanquestionsToRecieve) {
            for (var _d = 0, _e = state.config.foremanquestionsToRecieve; _d < _e.length; _d++) {
                var q = _e[_d];
                names.push(q.questionName);
            }
        }
        if (state.config.trackQuestion) {
            names.push(state.config.trackQuestion.questionName);
        }
        return names;
    };
    /**
    * We recieve a list of questions ids from the api get questionIds
    * This function would substitute the correct id again the correct name in manifest
    */
    ConnectService.mapAndValidateQuestionIds = function (state, questionIds) {
        // Note: We are mutating the state object passed in.
        // Attach id to questions for convenience and later use
        // All names should exist, otherwise reject as some questions are invalid
        for (var _i = 0, _a = Object.keys(state.config.questionsToSend); _i < _a.length; _i++) {
            var i = _a[_i];
            var id = questionIds[state.config.questionsToSend[i].questionName];
            if (typeof id === 'undefined' || id === null) {
                throw new Error('No question id received for ' + state.config.questionsToSend[i].questionName);
            }
            state.config.questionsToSend[i].questionId = id;
        }
        for (var _b = 0, _c = Object.keys(state.config.questionsToReceive); _b < _c.length; _b++) {
            var i = _c[_b];
            var id = questionIds[state.config.questionsToReceive[i].questionName];
            if (typeof id === 'undefined' || id === null) {
                throw new Error('No question id received for ' + state.config.questionsToReceive[i].questionName);
            }
            state.config.questionsToReceive[i].questionId = id;
        }
        if (state.config.foremanquestionsToRecieve) {
            state.foremanQuestionIds = {};
            for (var _d = 0, _e = Object.keys(state.config.foremanquestionsToRecieve); _d < _e.length; _d++) {
                var i = _e[_d];
                var id = questionIds[state.config.foremanquestionsToRecieve[i].questionName];
                if (typeof id === 'undefined' || id === null) {
                    throw new Error('No question id received for ' + state.config.foremanquestionsToRecieve[i].questionName);
                }
                state.config.foremanquestionsToRecieve[i].questionId = id;
                state.foremanQuestionIds[state.config.foremanquestionsToRecieve[i].questionName] = id;
            }
        }
        if (state.config.trackQuestion) {
            var id = questionIds[state.config.trackQuestion.questionName];
            if (typeof id === 'undefined' || id === null) {
                throw new Error('No question id received for trackquestion ' + state.config.trackQuestion.questionName);
            }
            state.config.trackQuestion.questionId = id;
            state.trackQuestionId = id;
        }
        // Redundant assignment to keep complete list of questions
        // + be able to quickly see if they have been fetched
        state.questionIds = questionIds;
        return state;
    };
    /**
    * loop through the manifest and find the question ids of all the questionToRecieve
    */
    ConnectService.getQuestionIdsToReceive = function (state) {
        var ids = [];
        // Detect if questionIds have been fetched at all
        if (!state.questionIds) {
            return ids;
        }
        for (var _i = 0, _a = state.config.questionsToReceive; _i < _a.length; _i++) {
            var q = _a[_i];
            ids.push(q.questionId);
        }
        return ids;
    };
    /**
   * loop through the manifest and find the question ids of all the foremanquestionToRecieve
   */
    ConnectService.getForemanQuestionIdsToReceive = function (state) {
        var ids = [];
        // Detect if questionIds have been fetched at all
        if (!state.foremanQuestionIds) {
            return ids;
        }
        for (var _i = 0, _a = state.config.foremanquestionsToRecieve; _i < _a.length; _i++) {
            var q = _a[_i];
            ids.push(q.questionId);
        }
        return ids;
    };
    /**
   * loop through the manifest and find the track question id
   */
    ConnectService.getTrackQuestionId = function (state) {
        var trackQuestionId;
        // Detect if trackQuestionId have been fetched at all
        if (!state.trackQuestionId) {
            return trackQuestionId;
        }
        trackQuestionId = state.config.trackQuestion.questionId;
        return trackQuestionId;
    };
    /**
    * Handles authentication errors while api calls
    */
    ConnectService.handleAuthenticationError = function (response) {
        if (response.success === false && ConnectService.isAuthenticationMessage(response.message)) {
            throw new AuthenticationError();
        }
        return response;
    };
    /**
    * Check if the error thron by api call is an authentication error
    */
    ConnectService.isAuthenticationMessage = function (message) {
        return message === 'Authentication fails or insufficient privileges.' || message === 'Not authenticated.' || message === 'You must be authorized first.';
    };
    return ConnectService;
}());
ConnectService.decorators = [
    { type: core.Injectable },
];
/** @nocollapse */
ConnectService.ctorParameters = function () { return [
    { type: HttpWrapperService, },
]; };

// Ordered in the order of importance to display
// Ordered in the order of importance to display
var SyncStatus;
(function (SyncStatus) {
    SyncStatus[SyncStatus["InSync"] = 0] = "InSync";
    SyncStatus[SyncStatus["OutOfSync"] = 1] = "OutOfSync";
    SyncStatus[SyncStatus["SyncError"] = 2] = "SyncError";
    SyncStatus[SyncStatus["NetworkError"] = 3] = "NetworkError";
    SyncStatus[SyncStatus["Syncing"] = 4] = "Syncing";
})(SyncStatus || (SyncStatus = {}));

/**
 * This class is responsible for setting and updatingk THE UPLOAD and DOWNLOAD statuses
 */
var SyncStatusService = (function () {
    function SyncStatusService() {
        /**
       * last sync time of the aggregated status private variable for LastSyncTime
       */
        this._lastSyncTime = new BehaviorSubject.BehaviorSubject(null);
        /**
       * current active status private variable for Status
       */
        this._status = new BehaviorSubject.BehaviorSubject(SyncStatus.OutOfSync);
        /**
       * current status of download & private variable for DownloadStatus
       */
        this._downloadStatus = new BehaviorSubject.BehaviorSubject(SyncStatus.OutOfSync);
        /**
       * current status of model state & private variable for ModelStateStatus
       */
        this._modelStateStatus = new BehaviorSubject.BehaviorSubject(SyncStatus.OutOfSync);
        /**
       * current active status
       */
        this.Status = this._status.asObservable();
        /**
      * current status of download
      */
        this.DownloadStatus = this._downloadStatus.asObservable();
        /**
      * current status of model state
      */
        this.ModelStateStatus = this._modelStateStatus.asObservable();
        /**
      * last sync time of the aggregated status
      */
        this.LastSyncTime = this._lastSyncTime.asObservable();
        /**
       * Final aggregated status and private variable for AggregatedStatus
       */
        this._aggregatedStatus = new BehaviorSubject.BehaviorSubject(SyncStatus.OutOfSync);
        /**
       * Final aggregated status
       */
        this.AggregatedStatus = this._aggregatedStatus.asObservable();
    }
    /**
     * set upload status and recalculate/set the aggregated status
     * @param status SyncStatus the new status to be set
     */
    SyncStatusService.prototype.SetStatus = function (status) {
        this._status.next(status);
        this.SetAggregatedStatus();
    };
    /**
     * set download status and recalculate/set the aggregated status
     * @param status SyncStatus the new status to be set
     */
    SyncStatusService.prototype.SetDownloadStatus = function (status) {
        this._downloadStatus.next(status);
        this.SetAggregatedStatus();
    };
    /**
     * set model status and recalculate/set the aggregated status
     * @param status SyncStatus the new status to be set
     */
    SyncStatusService.prototype.SetModelStateStatus = function (status) {
        this._modelStateStatus.next(status);
        this.SetAggregatedStatus();
    };
    /**
   * get current aggregated status
   */
    SyncStatusService.prototype.GetCurrentStatus = function () {
        return this._status.getValue();
    };
    /**
   * This is a fucntion used to calculate the agrregated status from all 3 ie upload/download/model
   */
    SyncStatusService.prototype.SetAggregatedStatus = function () {
        var status = [
            this._status.getValue(),
            this._modelStateStatus.getValue(),
            this._downloadStatus.getValue()
        ].sort();
        var highest = status[2];
        this._aggregatedStatus.next(highest);
        this.UpdateSyncTime();
    };
    /**
    * update the last sync time when the status is IN SYNC
    */
    SyncStatusService.prototype.UpdateSyncTime = function () {
        var _moment = moment;
        if (this._aggregatedStatus.getValue() === SyncStatus.InSync) {
            this._lastSyncTime.next(_moment());
        }
    };
    return SyncStatusService;
}());
SyncStatusService.decorators = [
    { type: core.Injectable },
];
/** @nocollapse */
SyncStatusService.ctorParameters = function () { return []; };

/**
 * ConnectThrottlerService balances the upload functionality from the connect module
 * It also download the data after every x seconds from the backend as per configuration
 * It queues up all change requests and then after every 3 seconds syncs them up with the server
 * It takes care that the same values are not syncronised twice. So if the same value is changed twice the latest is synced
 */
var ConnectThrottlerService = (function () {
    /**
    * Constructor connect-throttler service
    *
    * @param {Connect} connect Connect instance
    *
    * @param {SyncStatusService} syncStatusService SyncStatusService instance
    *
    */
    function ConnectThrottlerService(connect, syncStatusService) {
        var _this = this;
        this.connect = connect;
        this.syncStatusService = syncStatusService;
        /**
        * The configuration that is emitted back after a sync is successfull
        */
        this.syncEmitter = new Subject.Subject();
        /**
        * Emits errors that are found while sync
        */
        this.errorEmitter = new Subject.Subject();
        /**
         * public variable which defines the sync emitter
         */
        this.SyncEmitter = this.syncEmitter.asObservable();
        /**
         * public variable which defines the error emitter
         */
        this.ErrorEmitter = this.errorEmitter.asObservable();
        /**
        * set state to out of sync
        * upload the data in queue to backend
        * set the status to syncing
        * change it back to in sync when complete
        * In case any request come when u already have data in que, merge it with the data in queue
        */
        this.QueueUpload = function (state) {
            try {
                _this.syncStatusService.SetStatus(SyncStatus.OutOfSync);
                if (!_this.isInitialized && _this.activeRequest == null) {
                    _this.Init(state).then(_this.QueueUpload).catch(function (_$$1) { });
                    return;
                }
                if (_this.activeRequest != null) {
                    _this.waitingToSync = state;
                    return;
                }
                _this.syncStatusService.SetStatus(SyncStatus.Syncing);
                var stateCopy = _this.clone(state);
                var currentQuestionsToSend_1 = stateCopy.config.questionsToSend;
                if (_this.lastSuccessfulSync) {
                    var diff = stateCopy.config.questionsToSend.filter(function (question, idx) {
                        return question.responseText !== _this.lastSuccessfulSync.config.questionsToSend[idx].responseText;
                    });
                    stateCopy.config.questionsToSend = diff;
                }
                _this.activeRequest = _this.connect.voteManyQuestionsFromJson(stateCopy)
                    .then(function (statenew) {
                    if (!_this.waitingToSync) {
                        _this.syncStatusService.SetStatus(SyncStatus.InSync);
                    }
                    var mergedManifest = _this.clone(statenew);
                    mergedManifest.config.questionsToSend = currentQuestionsToSend_1;
                    _this.lastSuccessfulSync = mergedManifest;
                    _this.activeRequest = null;
                    _this.syncEmitter.next(mergedManifest);
                })
                    .catch(function (err) {
                    _this.activeRequest = null;
                    _this.waitingToSync = null;
                    throw err;
                })
                    .catch(_this.SetErrorStatus);
            }
            catch (unexpectedError) {
                _this.SetErrorStatus(unexpectedError);
            }
        };
        /**
       * Set the download status to syncing and the download the data
       * set it back to in sync when completed
       */
        this.QueueDownload = function (state) {
            if (!_this.isInitialized) {
                return _this.Init(state).then(_this.QueueDownload).catch(function (_$$1) { });
            }
            _this.syncStatusService.SetDownloadStatus(SyncStatus.Syncing);
            return _this.connect.getMyVotes(state)
                .then(function (statenew) {
                return _this.connect.getMyForemanVotes(statenew)
                    .then(function (statenewest) {
                    _this.syncStatusService.SetDownloadStatus(SyncStatus.InSync);
                    return statenewest;
                }).catch(_this.SetDownloadErrorStatus);
            })
                .catch(_this.SetDownloadErrorStatus);
        };
        /**
       * update votes returned by the signalr
       * set it back to in sync when completed
       */
        this.updateMyVotes = function (state, result) {
            if (!_this.isInitialized) {
                return _this.Init(state).then(_this.QueueDownload).catch(function (_$$1) { });
            }
            var promise = new Promise(function (resolve, reject) {
                _this.syncStatusService.SetDownloadStatus(SyncStatus.Syncing);
                // upate state
                Object.keys(state.questionIds).forEach(function (key) {
                    var questionId = state.questionIds[key];
                    // check if the vote.QuestionId is indeed requested by our configuration
                    var voteRecord = result.votes.filter(function (e) { return e.QuestionId === questionId; });
                    if (voteRecord.length > 0) {
                        state.votes[questionId] = voteRecord[0].ResponseText;
                    }
                });
                _this.syncStatusService.SetDownloadStatus(SyncStatus.InSync);
                resolve(state);
            });
            return promise;
        };
        /**
      * update votes returned by the signalr
      * set it back to in sync when completed
      */
        this.updateMyForemanVotes = function (state, result) {
            if (!_this.isInitialized) {
                return _this.Init(state).then(_this.QueueDownload).catch(function (_$$1) { });
            }
            var promise = new Promise(function (resolve, reject) {
                _this.syncStatusService.SetDownloadStatus(SyncStatus.Syncing);
                // upate state
                Object.keys(state.foremanQuestionIds).forEach(function (key) {
                    var questionId = state.foremanQuestionIds[key];
                    // check if the vote.QuestionId is indeed requested by our configuration
                    var voteRecord = result.votes.filter(function (e) { return e.QuestionId === questionId; });
                    if (voteRecord.length > 0) {
                        state.foremanvotes[questionId] = voteRecord[0].ResponseText;
                    }
                });
                _this.syncStatusService.SetDownloadStatus(SyncStatus.InSync);
                resolve(state);
            });
            return promise;
        };
        /**
        * Set the status to error when any errors are met during upload
        */
        this.SetErrorStatus = function (err) {
            _this.syncStatusService.SetStatus(_this.getErrorStatus(err));
            _this.errorEmitter.next(err);
        };
        /**
        * Set the status to error when any errors are met during download
        */
        this.SetDownloadErrorStatus = function (err) {
            _this.syncStatusService.SetDownloadStatus(_this.getErrorStatus(err));
            _this.errorEmitter.next(err);
        };
        /**
         * This function will return the error status if any
         */
        this.getErrorStatus = function (err) {
            return err.status === 0 ? SyncStatus.NetworkError : SyncStatus.SyncError;
        };
        /**
         * This function will clone the state object and return a copy
         */
        this.clone = function (state) {
            return JSON.parse(JSON.stringify(state));
        };
        this.SyncEmitter.subscribe(function (state) {
            if (_this.waitingToSync) {
                var nextState = _this.waitingToSync;
                _this.waitingToSync = null;
                _this.QueueUpload(nextState);
            }
        });
    }
    /**
    * Initialise the sync connector and then set the state to initialisation complete
    */
    ConnectThrottlerService.prototype.Init = function (state) {
        var _this = this;
        this.activeRequest = this.connect.getQuestionIds(state)
            .then(function (statenew) {
            _this.isInitialized = true;
            _this.activeRequest = null;
            return statenew;
        })
            .catch(function (err) {
            _this.SetErrorStatus(err);
            throw err;
        });
        return this.activeRequest;
    };
    return ConnectThrottlerService;
}());
ConnectThrottlerService.decorators = [
    { type: core.Injectable },
];
/** @nocollapse */
ConnectThrottlerService.ctorParameters = function () { return [
    { type: ConnectService, },
    { type: SyncStatusService, },
]; };

/**
 * This is a wrapper class for the JScalc module
 * This will give us an easy access to directly call the jsCalc functions for reading and writing in typescript
 */
var JsCalcConnectorService = (function () {
    /**
    * Constructor connect-throttler service
    *
    * @param {CalcService} jsCalcApi CalcService instance
    *
    */
    function JsCalcConnectorService(jsCalcApi) {
        var _this = this;
        this.jsCalcApi = jsCalcApi;
        /**
        * Read a value from jsCalcApi which would in turn read it from model
        */
        this.readValues = function (state) {
            return Promise.resolve().then(function () {
                for (var _i = 0, _a = Object.keys(state.config.questionsToSend); _i < _a.length; _i++) {
                    var i = _a[_i];
                    var q = state.config.questionsToSend[i];
                    q.responseText = _this.jsCalcApi.getValue(q.rangeName);
                    if (typeof q.responseText === 'undefined') {
                        throw new Error('jsCalc did not return a suitable response for question ' + q.questionName + ' with range ' + q.rangeName);
                    }
                }
                return state;
            });
        };
        /**
       * Write a value to jsCalcApi which would in turn write it to model
       */
        this.writeValues = function (state) {
            return Promise.resolve().then(function () {
                if (!state.votes) {
                    throw new Error('State should contain a votes object with questionIds and responseText');
                }
                var promises = [];
                var question;
                for (var _i = 0, _a = Object.keys(state.config.questionsToReceive); _i < _a.length; _i++) {
                    var i = _a[_i];
                    question = state.config.questionsToReceive[i];
                    question.responseText = state.votes[question.questionId];
                    // Only write values actually returned in the votes array.
                    if (typeof question.responseText !== 'undefined') {
                        var valuePromise = _this.jsCalcApi.setValue(question.rangeName, question.responseText);
                        promises.push(valuePromise);
                    }
                }
                if (state.config.foremanquestionsToRecieve) {
                    for (var _b = 0, _c = Object.keys(state.config.foremanquestionsToRecieve); _b < _c.length; _b++) {
                        var i = _c[_b];
                        question = state.config.foremanquestionsToRecieve[i];
                        if (state.foremanvotes) {
                            question.responseText = state.foremanvotes[question.questionId];
                            // Only write values actually returned in the fore man votes array.
                            if (typeof question.responseText !== 'undefined') {
                                var valuePromise = _this.jsCalcApi.setValue(question.rangeName, question.responseText);
                                promises.push(valuePromise);
                            }
                        }
                    }
                }
                return Promise.all(promises).then(function () {
                    return state;
                });
            });
        };
    }
    return JsCalcConnectorService;
}());
JsCalcConnectorService.decorators = [
    { type: core.Injectable },
];
/** @nocollapse */
JsCalcConnectorService.ctorParameters = function () { return [
    { type: CalcService, },
]; };

/*
* This service is responsible for maintaining a signalR connection via websockets to the pulse backend
* This will enable it to listen for any pushes from the server
*/
var SignalRWrapperService = (function () {
    /**
    * Constructor for the service
    *
    * @param {SignalRService} signalR Instance of SignalRService
    *
    * @param {LoggerService} logger Instance of LoggerService
    */
    function SignalRWrapperService(signalR, logger) {
        this.signalR = signalR;
        this.logger = logger;
        /**
         * local variable which stores if the application is in pull or push mode
         */
        this.usePush = true;
    }
    /**
     * This function initialises the signalR connection
     * @param participantId The id of the participant in backend
     * @param signalRServiceConfig The config of signalR containing the hostname etc
     */
    SignalRWrapperService.prototype.init = function (participantId, signalRServiceConfig) {
        if (participantId != null && this.usePush) {
            this.signalR.setUser(participantId);
            this.signalR.configureSignalRService(signalRServiceConfig);
            try {
                return this.signalR.initialiseConnection();
            }
            catch (ex) {
                this.logger.log(ex);
                return Promise.resolve({ success: false });
            }
        }
        else {
            this.logger.log('Invalid participant Id. Hence cannot initialise signalR connection');
            throw new Error('Invalid participant Id. Hence cannot initialise signalR connection');
        }
    };
    /**
     * This function will disable the push functionality during init
     */
    SignalRWrapperService.prototype.disablePush = function () {
        this.usePush = false;
    };
    /**
     * This function will enable the push functionality during init
     */
    SignalRWrapperService.prototype.enablePush = function () {
        this.usePush = true;
    };
    /**
     *
     * This function helps us to subscribe for my event changed.
     * Once we subscribe we get a callback when my vote is changed for the list of questions i am listening for
     */
    SignalRWrapperService.prototype.subscribeForMyVoteChanged = function () {
        if (this.signalR && this.signalR.connectionExists) {
            this.signalRsubscription = this.signalR.subscribeToEvent(pulseutilities.ChannelEventName.MyVoteChanged);
        }
        return this.signalRsubscription;
    };
    return SignalRWrapperService;
}());
SignalRWrapperService.decorators = [
    { type: core.Injectable },
];
/** @nocollapse */
SignalRWrapperService.ctorParameters = function () { return [
    { type: pulsesignalr.SignalRService, },
    { type: LoggerService, },
]; };

/**
  * This service is responsible for syncronizing the status of various uplaod and download processes
  * This also takes care of the aggregated status of sync
  */
var SyncService = (function () {
    /**
   * Constructor sync service
   *
   * @param {ConnectThrottlerService} connectThrottler ConnectThrottlerService instance
   *
   * @param {CalcService} syncStatusService CalcService instance
   *
   * @param {JsCalcConnectorService} jsCalc JsCalcConnectorService instance
   *
   * @param {ManifestService} manifestService ManifestService instance
   *
   * @param {SignalRWrapperService} signalRwrapperService SignalRWrapperService instance
   *
   */
    function SyncService(connectThrottler, calcService, manifestService, jsCalc$$1, signalRwrapperService) {
        var _this = this;
        this.connectThrottler = connectThrottler;
        this.calcService = calcService;
        this.manifestService = manifestService;
        this.jsCalc = jsCalc$$1;
        this.signalRwrapperService = signalRwrapperService;
        /**
         * a variable which defines if connectiing to pulse is on or off
         */
        this.connectToPulse = true;
        /**
         * by default we will use the connect module to fetch the participant votes
         * If we want to use signalR instead, we will say usePush to true
         */
        this.usePush = false;
        /**
        * Download whatever is pending in download queue and then write the value to jscal connector
        */
        this.Download = function () {
            if (_this.usePush === false) {
                return _this.connectThrottler.QueueDownload(_this.state)
                    .then(_this.jsCalc.writeValues);
            }
            else {
                return null;
            }
        };
        /**
        * Read the values from jscalc connector and then add to the upload queue
        */
        this.Upload = function () {
            return _this.jsCalc.readValues(_this.state)
                .then(_this.connectThrottler.QueueUpload);
        };
        /**
       * By default connecting to pulse is always true. we can use this function we want to explicitly turn it off
       */
        this.disableConnectToPulse = function () {
            _this.connectToPulse = false;
        };
        /**
        * by default we will use the connect module polling to fetch the participant votes
        * If we want to use signalR instead, we will say usePush to true
        */
        this.setMode = function (mode) {
            if (mode === Constants.CONNECTION_MODE.PUSH) {
                _this.usePush = true;
                _this.signalRwrapperService.enablePush();
                // do a forced download and then init the signalr
                return _this.connectThrottler.QueueDownload(_this.state)
                    .then(function (result) {
                    _this.jsCalc.writeValues(_this.state);
                    var signalrConfig = {
                        hostname: _this.manifestService.Get().config.hostName,
                        serviceUrl: _this.manifestService.Get().config.hostName + '/PulseServices/'
                    };
                    _this.signalRwrapperService.init(_this.state.participantId, signalrConfig).then(function (res) {
                        _this.signalRwrapperService.subscribeForMyVoteChanged()
                            .subscribe(function (jsondata) {
                            if (jsondata.EventName === pulseutilities.ChannelEventName[pulseutilities.ChannelEventName.MyVoteChanged]) {
                                var pid = jsondata.TargetParticipationId;
                                if (pid === _this.state.foremanId || pid === result.foremanId) {
                                    _this.connectThrottler.updateMyForemanVotes(_this.state, jsondata.Data)
                                        .then(function (statenew) {
                                        _this.jsCalc.writeValues(statenew);
                                    });
                                }
                                else if (pid === _this.state.participantId || pid === result.participantId) {
                                    var data = void 0;
                                    if (jsondata.Data) {
                                        data = jsondata.Data['Data'];
                                    }
                                    _this.connectThrottler.updateMyVotes(_this.state, data)
                                        .then(function (statenew) {
                                        _this.jsCalc.writeValues(statenew);
                                    });
                                }
                            }
                        });
                    });
                });
            }
            else {
                _this.usePush = false;
                _this.signalRwrapperService.disablePush();
            }
        };
        this.state = this.manifestService.Get();
        this.manifestService.State.subscribe(function (newState) {
            _this.state = newState;
        });
        this.connectThrottler.ErrorEmitter.subscribe(SyncService.handleSyncErrors);
    }
    /**
    * Handle errors that occur during syncronisation requests
    */
    SyncService.handleSyncErrors = function (err) {
        if (err instanceof AuthenticationError) {
            SyncService.clearCookiesAndReload();
        }
        else if (err instanceof RequestFailedError) {
            console.error(err.message);
        }
        else {
            err.stack ? console.error(err.message, err.stack) : console.error(err);
        }
    };
    /**
    * clear browser cookies anmd reload the page
    */
    SyncService.clearCookiesAndReload = function () {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].split('=')[0].trim();
            if (cookie.length > 0) {
                document.cookie = cookie + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
            }
        }
        // console.log("Cookies cleared.");
        SyncService.reloadWindow();
    };
    /**
    * Simply seperating out window.reload to save the unit tests reloading and it can be stubbed
    */
    SyncService.reloadWindow = function () {
        window.location.reload(true);
    };
    /**
    * Initialize to sync automatically on change
    */
    SyncService.prototype.initializeSync = function () {
        var _this = this;
        // If in connect mode, sync automatically on change
        if (this.connectToPulse) {
            var calcPromise_1 = this.calcService.getApi();
            calcPromise_1.then(function (api) {
                var debouncetime = _this.calcService.getObservable().debounceTime(3000);
                _this.subscription = debouncetime.subscribe(_this.Upload);
                _this.dlSubscription = new IntervalObservable.IntervalObservable(30000).subscribe(_this.Download);
            });
            this.connectThrottler.Init(this.state)
                .then(function () {
                calcPromise_1.then(_this.Download);
            }).catch(function (_$$1) {
                // Just catch. Error emitter handles the error.
            });
        }
    };
    return SyncService;
}());
SyncService.decorators = [
    { type: core.Injectable },
];
/** @nocollapse */
SyncService.ctorParameters = function () { return [
    { type: ConnectThrottlerService, },
    { type: CalcService, },
    { type: ManifestService, },
    { type: JsCalcConnectorService, },
    { type: SignalRWrapperService, },
]; };

/**
 * SyncComponent component let's user see the sync stus with backend in the top right corner
 * It lets the user know if his calc model decisions are syncronised with backedn at any given time
 *
 */
var SyncComponent = (function () {
    /**
    * Constructor sync component
    *
    * @param {SyncStatusService} syncStatusService SyncStatusService instance
    *
    * @param {SyncService} syncService SyncService instance
    *
    * @param {CalcService} calcService CalcService instance
    *
    */
    function SyncComponent(syncStatusService, syncService, calcService) {
        this.syncStatusService = syncStatusService;
        this.syncService = syncService;
        this.calcService = calcService;
        /**
        * enum of the status texts
        */
        this.statusLookup = {
            'InSync': 'In Sync',
            'OutOfSync': 'Out of sync',
            'SyncError': 'Synchronization error',
            'NetworkError': 'Network error (failed to connect to server)',
            'Syncing': 'Synchronizing'
        };
    }
    /**
    * force sync with backend by downloading and uploading stuff and save it to lo9cal storage
    */
    SyncComponent.prototype.ForceSync = function () {
        this.syncService.Download();
        this.syncService.Upload();
        this.calcService.saveStateToStorage();
    };
    /**
    * Get status message of the current sttaus in memory
  */
    SyncComponent.prototype.GetStatusMessage = function (status) {
        // Translate first to string SyncStatus, and then get the message.
        // console.log(status, SyncStatus[status], this.statusLookup[SyncStatus[status]]);
        // return this.statusLookup[SyncStatus[status]];
        return this.statusLookup[this.GetHighestStatus()];
    };
    /**
    * Get message last status in memory
    */
    SyncComponent.prototype.GetHighestStatus = function () {
        if (this.modelStateStatus >= this.status) {
            return SyncStatus[this.modelStateStatus];
        }
        else {
            return SyncStatus[this.status];
        }
    };
    /**
    * Initialise the sync service module by subscribing to the sync status setrvice
    * Listen for changes in model state status
    * listen for changes in last sync time
    */
    SyncComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.syncStatusService.Status.subscribe(function (status) {
            _this.status = status;
        });
        this.syncStatusService.ModelStateStatus.subscribe(function (status) {
            _this.modelStateStatus = status;
        });
        this.syncStatusService.LastSyncTime.subscribe(function (timestamp) {
            if (timestamp != null) {
                _this.lastStatus = 'Last successful sync: ' + timestamp.format('HH:mm:ss');
            }
            else {
                _this.lastStatus = 'No successful syncs yet';
            }
        });
    };
    return SyncComponent;
}());
SyncComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'ism-sync-status',
                template: "<span class=\"sync-status  status-{{GetHighestStatus()}}\" id=\"sync-status-circle\" title=\"{{GetStatusMessage(status)}}, {{lastStatus}}, Click to force a resync\" (click)=\"ForceSync()\"></span> ",
                styles: [".sync-status { font-family: 'wib-icomoon' } .sync-status.status-InSync:before { content:'\e941'; } .sync-status.status-OutOfSync:before { content:'\e942'; } .sync-status.status-Syncing:before { content:'\e943'; } .sync-status.status-SyncError:before { content:'\e943'; color: #f00; } .sync-status.status-NetworkError:before { color: #f00; content:'\e944'; } "]
            },] },
];
/** @nocollapse */
SyncComponent.ctorParameters = function () { return [
    { type: SyncStatusService, },
    { type: SyncService, },
    { type: CalcService, },
]; };

/**
 * Connect module to provide services to be able to sync data to remote pulse server
 *
 */
var ConnectModule = (function () {
    function ConnectModule() {
    }
    return ConnectModule;
}());
ConnectModule.decorators = [
    { type: core.NgModule, args: [{
                imports: [common.CommonModule, http.HttpModule],
                declarations: [SyncComponent],
                exports: [SyncComponent],
                providers: [
                    SyncService,
                    SyncStatusService,
                    HttpWrapperService,
                    ConnectThrottlerService,
                    ConnectService
                ],
            },] },
];
/** @nocollapse */
ConnectModule.ctorParameters = function () { return []; };

/**
 * NumberFormatting utility that uses momentjs / numeraljs to format numbers as date / various number formats
 *
 */
var NumberFormatting = (function () {
    function NumberFormatting() {
    }
    // private static customFormatFunctions = {}
    //   "Date": function (value) {
    //     const _moment = moment;
    //     return _moment('18991231', 'YYYYMMDD').add('days', value).format('l');
    //   },
    //   "ExpextedLaunchDays": function (value) {
    //     const _moment = moment;
    //     return _moment('18991231', 'YYYYMMDD').add('days', value).format('DD-MMM');
    //   }
    // }
    /**
     * Format function to format a number to desired format
     *
     * @param {any} value Numeric Value to be formatted
     *
     * @param {string} format String value specifying the format what needs to be applied
     *
     * @param {number} [scaler] optional scaler to be applied when formatting
     */
    NumberFormatting.format = function (value, format, scaler) {
        var _numeral = numeral, _moment = moment;
        if (!format) {
            return value;
        }
        if (format.toLowerCase() === 'string') {
            return value.toString();
        }
        scaler = scaler ? scaler : 1;
        var temp = _numeral(value).value();
        if (isNaN(temp)) {
            return value; // return NAN value
        }
        value = temp / scaler;
        var formatString = format;
        if (NumberFormatting.formatStrings.hasOwnProperty(formatString)) {
            formatString = NumberFormatting.formatStrings[format];
        }
        if (formatString.substring(0, 5) === 'date:') {
            formatString = formatString.substring(5);
            return _moment('18991231', 'YYYYMMDD').add(value, 'days').format(formatString);
        }
        else if (formatString.toLowerCase() === 'expectedlaunchdays') {
            return _moment('19000101', 'YYYYMMDD').add(value, 'days').format('DD-MMM');
        }
        else if (format.toLowerCase() === 'millions' || format.toLowerCase() === 'millionsnodecimal') {
            return _numeral((_numeral(value).value() / 1000000)).format(formatString);
        }
        else {
            return _numeral(value).format(formatString);
        }
    };
    /**
     * UnFormat function to format a value to its numeric equivalent
     *
     * @param {any} value Numeric Value to be formatted
     *
     * @param {number} [scaler] optional scaler to be applied when formatting
     */
    NumberFormatting.unformat = function (value, scaler) {
        var _numeral = numeral;
        // fix scaler = 0 and scaler not provided
        scaler = scaler ? scaler : 1;
        // numeral unformatted value is 0, but direct conversion to number fails
        // maybe encountering a string value so send ahead unprocessed but isnt a % value
        // numeral processed obj value processes parsed strings
        if (_numeral(value).value() === 0 && Number(value) !== 0 && String(value).indexOf('%') === -1) {
            return value;
        }
        var temp = _numeral(value).value();
        if (isNaN(temp)) {
            return value;
        }
        value = temp * scaler;
        return value;
    };
    return NumberFormatting;
}());
/**
 * Default formatStrings that can be passed as a valid format type
 *
 */
NumberFormatting.formatStrings = {
    AbbreviatedDollars: '($0.00a)',
    Date: 'date:l',
    ExpectedLaunchDays: 'expectedlaunchdays',
    DecimalWithCommas: '0,0',
    Percent: '0.0%',
    Millions: '0,0.0',
    MillionsNoDecimal: '0,0'
};

/**
 * Numberformatting Pipe for formatting numeric outputs into desired format
 *
 * __Usage :__
 * value | numFormat:format:scaler
 *
 * __Example :__
 * {{ value | numFormat:0.00a}}
 * Formats value to thousands / millions / billions format eg: 2.34b
 *
 */
var NumberFormattingPipe = (function () {
    function NumberFormattingPipe() {
        /**
         * Numberformatting Class reference
         *
         */
        this.numberFormatting = NumberFormatting;
    }
    /**
     * Transform function to format a given number to the desired format
     *
     * @param {(string|number)} value The value to be transformed
     *
     * @param {string} format The numberformatting to be applied
     *
     * @param {number} [scaler] The scaler value to be applied before formatting the number
     *
     */
    NumberFormattingPipe.prototype.transform = function (value, format, scaler) {
        if (!(value && format)) {
            return value;
        }
        value = String(value);
        var out = String(this.numberFormatting.format(value, format, scaler));
        return (out === 'NaN') ? '' : out;
    };
    /**
     * Parse function to unformat a formatted value to its numerical value
     *
     * @param {(string|number)} value The formatted value to be parsed to a number
     *
     * @param {number} [scaler] The scaler value to be applied before unformatting the number
     */
    NumberFormattingPipe.prototype.parse = function (value, scaler) {
        if (!value) {
            return value;
        }
        value = String(value);
        return this.numberFormatting.unformat(value, scaler);
    };
    return NumberFormattingPipe;
}());
NumberFormattingPipe.decorators = [
    { type: core.Pipe, args: [{
                name: 'numFormat'
            },] },
];
/** @nocollapse */
NumberFormattingPipe.ctorParameters = function () { return []; };

/**
 * The module that provides shared services like {@link CommunicatorService}, {@link StorageService}, ...
 *
 */
var ServicesModule = (function () {
    function ServicesModule() {
    }
    return ServicesModule;
}());
ServicesModule.decorators = [
    { type: core.NgModule, args: [{
                imports: [
                    http.HttpModule,
                    common.CommonModule,
                    ConnectModule,
                    pulsesignalr.SignalRModule
                ],
                declarations: [NumberFormattingPipe],
                exports: [NumberFormattingPipe],
                providers: [CommunicatorService, LoggerService, StorageService, NumberFormattingPipe, SignalRWrapperService, ManifestService]
            },] },
];
/** @nocollapse */
ServicesModule.ctorParameters = function () { return []; };

/**
 * A route guard to validate that calc model is ready before activating the route
 *
 */
var CalcModelLoadedGuard = (function () {
    /**
     * Constructor for Guard
     *
     * @param {CalcService} calcService CalcService instance
     *
     * @param {Router} router RouterService instance
     *
     * @param {StorageService} storageService StorageService instance
     */
    function CalcModelLoadedGuard(calcService, router$$1, storageService) {
        this.calcService = calcService;
        this.router = router$$1;
        this.storageService = storageService;
    }
    /**
     * CanActivate method implementation
     *
     * @param {ActivatedRouteSnapshot} next
     *
     * @param {RouterStateSnapshot} state
     *
     * @return {Observable<boolean>|Promise<boolean>|boolean}
     */
    CalcModelLoadedGuard.prototype.canActivate = function (next, state) {
        if (this.calcService.isApiReady()) {
            return true;
        }
        else {
            this.storageService.setValue(Constants.RETURN_URL, state.url);
            this.router.navigateByUrl('/splash');
            return false;
        }
    };
    return CalcModelLoadedGuard;
}());
CalcModelLoadedGuard.decorators = [
    { type: core.Injectable },
];
/** @nocollapse */
CalcModelLoadedGuard.ctorParameters = function () { return [
    { type: CalcService, },
    { type: router.Router, },
    { type: StorageService, },
]; };

/**
 * CalcOutput component displays value from calc model for a given range ref.
 *
 */
var CalcOutputComponent = (function () {
    /**
     * Constructor for calc-output component
     *
     * @param {CalcService} calcService CalcService instance
     *
     * @param {CommunicatorService} communicator CommunicatorService instance
     *
     * @param {ChangeDetectorRef} cdRef ChangeDetectorRef instance
     *
     */
    function CalcOutputComponent(calcService, communicator, cdRef) {
        this.calcService = calcService;
        this.communicator = communicator;
        this.cdRef = cdRef;
        /**
         * Input binding for rawValue flag
         *
         */
        this.rawValue = false;
    }
    /**
     * OnInit function
     *
     */
    CalcOutputComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscriber = this.communicator.getEmitter(Constants.MODEL_CALC_COMPLETE)
            .subscribe(function () {
            _this.update();
        });
        this.update();
    };
    /**
     * Function to fetch updated value from calc model
     *
     */
    CalcOutputComponent.prototype.update = function () {
        var value = this.calcService.getValueForYear(this.ref, this.yearRef, this.rawValue);
        if (this.value !== value) {
            this.value = value;
            this.cdRef.markForCheck();
        }
    };
    /**
     * Update the value when any Input binding is changed
     *
     */
    CalcOutputComponent.prototype.ngOnChanges = function () {
        this.update();
    };
    /**
     * Destroy any subscription when component instance is destroyed
     *
     */
    CalcOutputComponent.prototype.ngOnDestroy = function () {
        this.subscriber.unsubscribe();
    };
    return CalcOutputComponent;
}());
CalcOutputComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'ism-calc-output',
                template: "{{value | numFormat:format:scaler}}",
                styles: [""],
                changeDetection: core.ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
CalcOutputComponent.ctorParameters = function () { return [
    { type: CalcService, },
    { type: CommunicatorService, },
    { type: core.ChangeDetectorRef, },
]; };
CalcOutputComponent.propDecorators = {
    'ref': [{ type: core.Input },],
    'yearRef': [{ type: core.Input },],
    'format': [{ type: core.Input },],
    'scaler': [{ type: core.Input },],
    'rawValue': [{ type: core.Input },],
};

/**
 * CalcInput component let's user set/update values in calc model
 *
 */
var CalcInputComponent = (function () {
    /**
     * Constructor for calc-input component
     *
     * @param {CalcService} calcService CalcService instance
     *
     * @param {CommunicatorService} communicator CommunicatorService instance
     *
     * @param {NumberFormattingPipe} numberFormatter NumberFormattingPipe instance
     *
     * @param {ChangeDetectorRef} cdRef ChangeDetectorRef instance
     *
     */
    function CalcInputComponent(calcService, communicator, numberFormatter, cdRef) {
        this.calcService = calcService;
        this.communicator = communicator;
        this.numberFormatter = numberFormatter;
        this.cdRef = cdRef;
        /**
         * Is input field dirty i.e. initial value is changed by user
         *
         */
        this.isDirty = false;
        /**
         * Input binding for Type for input element
         */
        this.type = 'number';
    }
    /**
     * Initialize subscribers and component with value from calc model
     *
     */
    CalcInputComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscription = this.communicator.getEmitter(Constants.MODEL_CALC_COMPLETE)
            .subscribe(function () {
            _this.update();
            _this.cdRef.markForCheck();
        });
        this.update();
    };
    /**
     * Update comonent when any input bindings are changed
     *
     */
    CalcInputComponent.prototype.ngOnChanges = function () {
        this.update();
    };
    /**
     * Removes any subscribers when component instance is destroyed
     *
     */
    CalcInputComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    /**
     * Fetch updated value from calc model and set formatted value to component
     *
     */
    CalcInputComponent.prototype.update = function () {
        this.min = !isNaN(Number(this.min)) ? Number(this.min) : Number(this
            .calcService.getValueForYear(this.min + '', this.yearRef, this.rawValue));
        this.max = !isNaN(Number(this.max)) ? Number(this.max) : Number(this
            .calcService.getValueForYear(this.max + '', this.yearRef, this.rawValue));
        this.value = this.numberFormatter.transform(this.calcService.getValueForYear(this.ref, this.yearRef, this.rawValue), this.format);
    };
    /**
     * Saves updated value to calc model once onBlur event is triggered on input field
     *
     * @param {any} $event Blur event
     */
    CalcInputComponent.prototype.saveDataToModel = function ($event) {
        if (typeof this.dirtyValue === 'undefined') {
            return;
        }
        if (Number(this.dirtyValue) < this.min) {
            this.dirtyValue = this.min;
        }
        else if (Number(this.dirtyValue) > this.max) {
            this.dirtyValue = this.max;
        }
        this.value = this.numberFormatter.transform(this.dirtyValue, this.format, this.scaler);
        // update model now that we have processed the input value
        var val;
        if (!this.format) {
            val = this.value;
        }
        else {
            val = this.numberFormatter.parse(this.numberFormatter.transform(this.dirtyValue, this.format, this.scaler));
        }
        if (this.isDirty) {
            this.calcService.setValueForYear(this.ref, val, this.yearRef);
        }
        this.isDirty = false;
    };
    /**
     * Change event listener when user changes the input value
     *
     */
    CalcInputComponent.prototype.onModelChange = function (val) {
        if (val === '') {
            return;
        }
        if (this.value !== this.numberFormatter.transform(val, this.format, this.scaler)) {
            this.isDirty = true;
            this.dirtyValue = val;
        }
    };
    return CalcInputComponent;
}());
CalcInputComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'ism-calc-input',
                template: "<span class=\"calc-input-control\"> <input class=\"calc-input calc-input--{{type}}\" type=\"text\" [ngModel]=\"value\" (ngModelChange)=\"onModelChange($event)\" name=\"{{ref}}\" (blur)=\"saveDataToModel($event)\" value=\"{{value}}\" ismNumberformatter [format]=\"format\" [scaler]=\"scaler\" step=\"{{step}}\" min={{min}} max=\"{{max}}\" [readonly]=\"isReadOnly\"/> </span> ",
                styles: [""],
                changeDetection: core.ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
CalcInputComponent.ctorParameters = function () { return [
    { type: CalcService, },
    { type: CommunicatorService, },
    { type: NumberFormattingPipe, },
    { type: core.ChangeDetectorRef, },
]; };
CalcInputComponent.propDecorators = {
    'ref': [{ type: core.Input },],
    'yearRef': [{ type: core.Input },],
    'format': [{ type: core.Input },],
    'scaler': [{ type: core.Input },],
    'type': [{ type: core.Input },],
    'step': [{ type: core.Input },],
    'min': [{ type: core.Input },],
    'max': [{ type: core.Input },],
    'rawValue': [{ type: core.Input },],
    'readOnly': [{ type: core.Input },],
};

/**
 * Formatter directive to format value on input field
 *
 * __Usage :__
 * &lt;input ismNumberFormatter format="0.0a" /&gt;
 */
var CalcFormatterDirective = (function () {
    // @Input() type: string;
    /**
     * Constructor for directive
     *
     * @param {ElementRef} element Element ref instance
     *
     * @param {NumberformattingPipe} numberFormatter NumberFormattingPipe instance
     *
     */
    function CalcFormatterDirective(element, numberFormatter) {
        this.element = element;
        this.numberFormatter = numberFormatter;
        /**
         * Flag whether listening to blur events
         *
         */
        this.listenToBlur = false;
        /**
         * Flag whether input is already formatted, so we dont format it again accidentally
         *
         */
        this.inputFormatted = false;
        this.el = this.element.nativeElement;
    }
    /**
     * Hostlistener function for onFocus event on input element
     *
     * @param {string} value Initial value of input field on focus event
     */
    CalcFormatterDirective.prototype.onFocus = function (value) {
        var _this = this;
        if (!this.format) {
            return;
        }
        // added this condition as on firefox the input gets triggered twice so the scaler is applied 2x
        if (!this.inputFormatted) {
            this.el.value = this.numberFormatter.parse(value, this.scaler) + '';
            this.inputFormatted = true;
        }
        // console.log(this.numberFormatter.parse(value, this.scaler));
        if (this.initialInputType === undefined) {
            this.initialInputType = this.el.attributes['type'].value;
            this.el.attributes['type'].value = 'number';
        }
        else {
            this.el.attributes['type'].value = 'number';
        }
        /* hack for firefox because blur seems to get triggeed when we change from text to number */
        setTimeout(function () {
            _this.listenToBlur = true;
        }, 300);
    };
    /**
     * Hostlistener function for onBlur event on input element
     *
     * @param {string} value Value of input field on blur event
     */
    CalcFormatterDirective.prototype.onBlur = function (value) {
        if (!this.format) {
            return;
        }
        if (!this.listenToBlur) {
            return;
        }
        this.el.attributes['type'].value = this.initialInputType;
        // console.log('setting value' + this.numberFormatter.transform(value + '', this.format, this.scaler));
        this.el.value = this.numberFormatter.transform(value, this.format, this.scaler) + '';
        this.listenToBlur = false;
        this.inputFormatted = false;
    };
    return CalcFormatterDirective;
}());
CalcFormatterDirective.decorators = [
    { type: core.Directive, args: [{
                selector: '[ismNumberformatter]',
                providers: [NumberFormattingPipe]
            },] },
];
/** @nocollapse */
CalcFormatterDirective.ctorParameters = function () { return [
    { type: core.ElementRef, },
    { type: NumberFormattingPipe, },
]; };
CalcFormatterDirective.propDecorators = {
    'scaler': [{ type: core.Input },],
    'format': [{ type: core.Input },],
    'onFocus': [{ type: core.HostListener, args: ['focus', ['$event.target.value'],] },],
    'onBlur': [{ type: core.HostListener, args: ['blur', ['$event.target.value'],] },],
};

/**
 * Calc Slider component, allows the user to update inputs using a slider instead of a standard text input box
 *
 */
var CalcSliderComponent = (function () {
    /**
     * Constructor for calc-slider component
     *
     * @param {CalcService} calcService CalcService instance
     *
     */
    function CalcSliderComponent(calcService) {
        this.calcService = calcService;
        /**
         * Input binding for Min value for input element
         *
         */
        this.min = 0;
        /**
         * Input binding for Max value for input element
         *
         */
        this.max = 9999999999999999;
        /**
         * Input binding flag to show / hide slider buttons
         *
         */
        this.showButtons = false;
        /**
         * Input binding flag to show / hide slider buttons
         *
         */
        this.scaler = 1;
        /**
         * Flag value to check whether slider value was changed from initial value
         *
         */
        this.isDirty = false;
    }
    /**
     * OnInit lifecycle function to instantiate component
     *
     */
    CalcSliderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.value = this.calcService.getValueForYear(this.ref, this.yearRef);
        this.value = NumberFormatting.unformat(this.value);
        var slider = this.elRef.nativeElement, opt = {
            start: [Number(this.value) || Number(this.min)],
            range: {
                'min': Number(this.min),
                'max': Number(this.max)
            },
            step: (this.step) ? Number(this.step) : undefined,
            pips: {
                mode: 'steps',
                density: 1
            },
            behaviour: 'tap',
            format: {
                to: function (value) {
                    return NumberFormatting.format(value, _this.format, _this.scaler);
                },
                from: function (value) {
                    return NumberFormatting.unformat(value, _this.scaler);
                }
            }
        };
        noUiSlider.create(slider, opt);
        this.bindEvents(slider);
    };
    /**
     * Function to bind events to slider
     *
     * @param {any} slider Slider element reference
     */
    CalcSliderComponent.prototype.bindEvents = function (slider) {
        var _this = this;
        if (slider && slider.noUiSlider) {
            slider.noUiSlider.on('set', function () {
                var curVal = slider.noUiSlider.get();
                _this.saveDataToModel(curVal);
            });
        }
    };
    /**
     * Function to save component value back to model
     *
     * @param {any} value Value to be saved to model
     */
    CalcSliderComponent.prototype.saveDataToModel = function (val) {
        this.calcService.setValueForYear(this.ref, val, this.yearRef);
    };
    return CalcSliderComponent;
}());
CalcSliderComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'ism-calc-slider',
                template: "<span class=\"calc-slider-control\"> <div class=\"calc-slider\" #calcSliderEl></div> <div class=\"pip-steps\"></div> </span> ",
                styles: [":host { display: inline-block; width: 100%; padding: 15px 20px 45px; } "]
            },] },
];
/** @nocollapse */
CalcSliderComponent.ctorParameters = function () { return [
    { type: CalcService, },
]; };
CalcSliderComponent.propDecorators = {
    'ref': [{ type: core.Input },],
    'yearRef': [{ type: core.Input },],
    'step': [{ type: core.Input },],
    'min': [{ type: core.Input },],
    'max': [{ type: core.Input },],
    'showButtons': [{ type: core.Input },],
    'format': [{ type: core.Input },],
    'scaler': [{ type: core.Input },],
    'elRef': [{ type: core.ViewChild, args: ['calcSliderEl',] },],
};

/**
 * TextService provides ability to fetch text content from the content json using text keys as tokens for text-data
 *
 */
var TextService = (function () {
    /**
     * Constructor for text service
     *
     * @param {Http} http Angular Http instance to load content json
     *
     * @param {LoggerService} logger LoggerService instance
     *
     * @param {CommunicatorService} communicator CommunicatorService instance
     *
     */
    function TextService(http$$1, calcService, logger, communicator) {
        this.http = http$$1;
        this.calcService = calcService;
        this.logger = logger;
        this.communicator = communicator;
        /**
         * Dictionary object for storing text content as key-pair value
         *
         */
        this.textContent = new Collections.Dictionary();
        /**
         * Language of currently loaded text content
         *
         */
        this._language = Constants.TEXT_ENGINE.DEFAULT_LANG;
        /**
         * Whether text service is ready for use
         *
         */
        this.isReady = false;
    }
    Object.defineProperty(TextService.prototype, "language", {
        /**
         * Getter for {@link _language}
         *
         */
        get: function () {
            return this._language;
        },
        /**
         * Setter for {@link _language}
         *
         */
        set: function (lang) {
            this._language = lang;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextService.prototype, "isApiReady", {
        /**
         * Getter for {@link isReady}
         *
         */
        get: function () {
            return this.isReady;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Process content json
     *
     * @param {any} json Json content data to be processed
     *
     * @return {Promise<any>}
     */
    TextService.prototype.processContent = function (json) {
        var _this = this;
        var scenes;
        if (typeof json === 'object' && json.scenes instanceof Array) {
            scenes = json.scenes;
            scenes.forEach(function (scene) { return _this.processScene(scene); });
        }
        return Promise.resolve(this.textContent);
    };
    /**
     * Process scene data in content json
     *
     * @param {any} scene Scene data to be parsed
     *
     */
    TextService.prototype.processScene = function (scene) {
        if (typeof scene === 'object' && scene.hasOwnProperty('ID')) {
            // this.textContent.setValue(scene.ID, scene);
            this.addScene(scene);
        } /* else {
          // GENERAL keys (scene does not have an id)
          if (typeof scene === 'object') {
            Object.keys(scene)
              .forEach(key => {
                this.addGeneralKey(key, scene[key]);
              });
          }
        }*/
    };
    /**
     * Add scene data to data-store
     *
     * @param {any} scene Scene data to be parsed
     */
    TextService.prototype.addScene = function (scene) {
        this.textContent.setValue(scene.ID, new Collections.Dictionary());
        var sceneDict = this.textContent.getValue(scene.ID);
        Object.keys(scene).forEach(function (key) {
            sceneDict.setValue(key, scene[key]);
        });
    };
    /*
      private addGeneralKey(key: string, value: string) {
        if (typeof key !== 'undefined' && key && typeof value !== 'undefined' && value) {
          const general: Collections.Dictionary<string, string> = this.textContent.getValue(Constants.TEXT_ENGINE.GENERAL);
          general.setValue(key, value);
        }
      }*/
    /**
     * Function to initialize text service defaults
     *
     * @return {Promise<any>}
     *
     */
    TextService.prototype.init = function () {
        // initialize GEN scene
        this.textContent.setValue(Constants.TEXT_ENGINE.GENERAL, new Collections.Dictionary());
        this.communicator.createEmitter(Constants.TEXT_ENGINE.LANGUAGE_LOADED);
        return this.loadLanguage(this.language);
    };
    /**
     * Function to load a language json
     *
     * @param {string} lang Language key for json to be loaded
     *
     * @return {Promise<any>}
     */
    TextService.prototype.loadLanguage = function (lang) {
        var _this = this;
        if (!lang) {
            return Promise.reject('Lang not provided');
        }
        this.isReady = false;
        return this.loadJson(lang).then(this.processContent.bind(this)).then(function () {
            _this.communicator.trigger(Constants.TEXT_ENGINE.LANGUAGE_LOADED);
            _this.isReady = true;
        }).catch(function (err) {
            // this.logger.log('Error loading json ' + err);
            throw err;
        });
    };
    /**
     *
     * Function to load content json from server
     *
     * @return {Promise<any>}
     *
     */
    TextService.prototype.loadJson = function (lang) {
        lang = (lang) ? lang : Constants.TEXT_ENGINE.DEFAULT_LANG; // if no language is passed use default lang
        var filePath = Constants.TEXT_ENGINE.FILE_PATH + Constants.TEXT_ENGINE.FILE_NAME + '_' + lang + Constants.TEXT_ENGINE.FILE_EXT;
        return this.http.get(filePath).toPromise().then(function (response) {
            try {
                return Promise.resolve(response.json());
            }
            catch (err) {
                return Promise.reject(err);
            }
        }).catch(function (err) {
            throw err;
        });
    };
    /**
     *
     * Function to get text from dictionary
     *
     * @param {string} key Text content key to fetch data from store
     *
     * @param {string} [sceneId] SceneID from which data needs to be fetched. Defaults to __GEN__
     *
     * @return {any}
     */
    TextService.prototype.getText = function (key, sceneId) {
        if (sceneId === void 0) { sceneId = Constants.TEXT_ENGINE.GENERAL; }
        if (!this.isApiReady) {
            return;
        }
        return this.textContent.getValue(sceneId).getValue(key);
    };
    /**
     *
     * Function to get text from dictionary where key is appended with yearref in json
     *
     * @param {string} key Text content key to fetch data from store
     *
     * @param {string} yearRef This is the named range for current year/round,
     *   if it needs to be appended to the named ranges in range ref array
     *
     * @param {string} [sceneId] SceneID from which data needs to be fetched. Defaults to __GEN__
     *
     * @return {any}
     */
    TextService.prototype.getTextForYear = function (key, yearRef, sceneId) {
        /* If year is specified - append range name with _R + YearNo */
        // if calcService api is not ready - ignore the year ref
        if (yearRef && this.calcService.isApiReady()) {
            var year = this.calcService.getValue(yearRef);
            if (year) {
                key += '_R' + year;
            }
        }
        return this.getText(key, sceneId);
    };
    /**
     * Function to fetch dictionary object for a scene
     *
     * @param {string} sceneId SceneId to fetch data for
     *
     * @return {Collections.Dictionary}
     *
     */
    TextService.prototype.getScene = function (sceneId) {
        return this.textContent.getValue(sceneId);
    };
    /**
     * Function to fetch all sceneIds in content json
     *
     * @return {Array<string>}
     */
    TextService.prototype.getSceneIds = function () {
        return this.textContent.keys();
    };
    return TextService;
}());
TextService.decorators = [
    { type: core.Injectable },
];
/** @nocollapse */
TextService.ctorParameters = function () { return [
    { type: http.Http, },
    { type: CalcService, },
    { type: LoggerService, },
    { type: CommunicatorService, },
]; };

/**
 * Calcdropdown component allows to make inputs to the calc model using a dropdown box.
 * Dropdown box is rendered using dropdown directive provided by ngx-bootstrap & bootstrap v4
 *
 */
var CalcDropdownComponent = (function () {
    /**
     * Constructor for component
     *
     * @param {CalcService} calcService Instance of CalcService
     *
     * @param {TextService} textService Instance of TextService
     *
     * @param {TextService} textService Instance of TextService
     *
     * @param {NumberFormattingPipe} numberFormatting Instance of NumberFormattingPipe
     *
     * @param {CommunicatorService} communicator Instance of CommunicatorService
     *
     */
    function CalcDropdownComponent(calcService, textService, numberFormatting, communicator) {
        this.calcService = calcService;
        this.textService = textService;
        this.numberFormatting = numberFormatting;
        this.communicator = communicator;
        /**
         * To enable disable the dropdown
         */
        this.disabled = false;
        // private status: { isOpen: boolean} = { isOpen : false };
        /**
         * Internal flag to check if dropdown component is initialized
         *
         */
        this.initFinished = false;
        /**
         * Subscription object for listening to calc model updates
         *
         */
        this.observer = null;
        /**
         * Items to be populated in the droplist
         *
         */
        this._items = [];
        /**
         * Input binding to set a recheck flag. If set to true, the items list will be checked
         * to validate if the currently selected item is still a part of (updated) items list.
         *
         */
        this.recheck = false;
        /**
         * Event emitter to emit droplist change event
         *
         */
        this.onChange = new core.EventEmitter();
        /**
         * Event emitter to emit droplist select event
         *
         */
        this.onSelect = new core.EventEmitter();
    }
    /**
     * Initialize subscribers and component with value from calc model
     *
     */
    CalcDropdownComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.observer = this.communicator.getEmitter(Constants.MODEL_CALC_COMPLETE).subscribe(function () {
            _this.onModelUpdate();
        });
        this.onModelUpdate();
        this.initFinished = true;
    };
    /**
     * Function to fetch updated value from calc model, and set it as selected item
     *
     */
    CalcDropdownComponent.prototype.onModelUpdate = function () {
        var modelVal;
        modelVal = this.numberFormatting.transform(this.calcService.getValueForYear(this.ref, this.yearRef, true), this.format, this.scaler);
        this.processItems();
        this.selectedItem = (modelVal.toString().length > 0) ? modelVal + '' : this.placeHolder;
    };
    /**
     * Get currently selected item on the dropdown
     *
     */
    CalcDropdownComponent.prototype.getSelectedItem = function () {
        return this.selectedItem;
    };
    /**
     * Handler function when a new item is selected on the droplist
     *
     * @param {string} $item New item selected on the droplist
     */
    CalcDropdownComponent.prototype.dropdownChanged = function ($item) {
        var _this = this;
        // const self = this;
        var value;
        this.selectedItem = $item;
        this.onSelect.emit();
        // only parse value if num format is provided
        if (this.format) {
            value = this.numberFormatting.parse(this.numberFormatting.transform($item, this.format, this.scaler), this.scaler);
        }
        this.calcService.setValueForYear(this.ref, value, this.yearRef).then(function () {
            _this.onChange.emit($item);
        });
    };
    /**
     * Function to check if the currently selected item is still a part of the items array.
     * If not, then select the first item on the droplist instead.
     *
     */
    CalcDropdownComponent.prototype.recheckItems = function () {
        if (this.recheck && this.items.indexOf(this.selectedItem) === -1) {
            this.dropdownChanged(this.items[0].toString());
        }
    };
    /**
     * Process items and check if they are a token for the textService. After processing populate the items array to add to droplist.
     *
     */
    CalcDropdownComponent.prototype.processItems = function () {
        var _this = this;
        var items = this.items;
        this._items = [];
        if (items && items.length) {
            items.forEach(function (val, index) {
                var itemName = _this.textService.getText(val) || val;
                if (itemName) {
                    _this._items.push(itemName);
                }
            });
        }
    };
    /**
     * OnChange lifecycle function for component. This checks if the items array is updated and updates component accordingly
     *
     * @param {SimpleChanges} changes SimpleChanges object that contains any Input properties that were updated
     */
    CalcDropdownComponent.prototype.ngOnChanges = function (changes) {
        this.processItems();
        if (this.recheck && this.initFinished) {
            var flag = false;
            if (changes['items'].currentValue.length !== changes['items'].previousValue.length) {
                flag = true;
            }
            else {
                for (var i = 0, len = changes['items'].currentValue.length; i < len; i++) {
                    if (changes['items'].currentValue[i] !== changes['items'].previousValue[i]) {
                        flag = true;
                        break;
                    }
                }
            }
            if (flag) {
                this.recheckItems();
            }
        }
    };
    /**
     * OnDestroy lifecycle function for component. This destroys any active subscriptions to calcservice.
     *
     */
    CalcDropdownComponent.prototype.ngOnDestroy = function () {
        this.observer.unsubscribe();
    };
    return CalcDropdownComponent;
}());
CalcDropdownComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'ism-calc-dropdown',
                template: "<div class=\"btn-group\" dropdown> <button dropdownToggle type=\"button\" class=\"btn btn-primary dropdown-toggle\" [disabled]=\"disabled\"> <span class=\"dropdown-text\">{{getSelectedItem() | numFormat:format:scaler}}</span> <span class=\"caret\"></span> </button> <ul *dropdownMenu class=\"dropdown-menu\" role=\"menu\"> <li *ngFor=\"let item of _items\" role=\"menuitem\"> <a class=\"dropdown-item\" href=\"javascript:void(0)\" (click)=\"dropdownChanged(item)\">{{item | numFormat:format:scaler}}</a> </li> </ul> </div>",
                styles: [""]
            },] },
];
/** @nocollapse */
CalcDropdownComponent.ctorParameters = function () { return [
    { type: CalcService, },
    { type: TextService, },
    { type: NumberFormattingPipe, },
    { type: CommunicatorService, },
]; };
CalcDropdownComponent.propDecorators = {
    'items': [{ type: core.Input },],
    'ref': [{ type: core.Input },],
    'yearRef': [{ type: core.Input },],
    'placeHolder': [{ type: core.Input },],
    'format': [{ type: core.Input },],
    'scaler': [{ type: core.Input },],
    'recheck': [{ type: core.Input },],
    'onChange': [{ type: core.Output },],
    'onSelect': [{ type: core.Output },],
};

/**
 * CalcCheckbox component allows to make inputs to the calc model using a checkbox.
 *
 */
var CalcCheckboxComponent = (function () {
    /**
     * Constructor for calc-input component
     *
     * @param {CalcService} calcService CalcService instance
     *
     * @param {CommunicatorService} communicator Instance of CommunicatorService
     */
    function CalcCheckboxComponent(calcService, communicator) {
        this.calcService = calcService;
        this.communicator = communicator;
        /**
         * Updated value on the input field that is not yet synced to model
         */
        this.dirtyValue = false;
        /**
         * Input binding for Type for input element
         */
        this.type = 'checkbox';
    }
    /**
     * Initialize subscribers and component with value from calc model
     *
     */
    CalcCheckboxComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscription = this.communicator.getEmitter(Constants.MODEL_CALC_COMPLETE).subscribe(function () {
            _this.onModelUpdate();
        });
        this.onModelUpdate();
    };
    /**
     * Function to fetch updated value from calc model, and set it to value
     *
     */
    CalcCheckboxComponent.prototype.onModelUpdate = function () {
        this.value = this.calcService.getValueForYear(this.ref, this.yearRef);
    };
    /**
     * Handler function when the checkbox is clicked
     *
     */
    CalcCheckboxComponent.prototype.toggleValue = function () {
        this.dirtyValue = !this.value;
        this.saveDataToModel();
    };
    /**
     * Saves updated value to calc model when the checkbox is clicked
     *
     */
    CalcCheckboxComponent.prototype.saveDataToModel = function () {
        var value;
        value = this.dirtyValue;
        this.calcService.setValueForYear(this.ref, value, this.yearRef);
        this.value = this.calcService.getValueForYear(this.ref, this.yearRef);
    };
    /**
     * OnDestroy lifecycle function for component. This destroys any active subscriptions to calcservice.
     *
     */
    CalcCheckboxComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    return CalcCheckboxComponent;
}());
CalcCheckboxComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'ism-calc-checkbox',
                template: "<input type=\"checkbox\" id=\"{{ ref }}\" (click)=\"toggleValue()\" (ngModelChange)=\"onModelChange()\" [checked]=\"value\" /> <label for=\"{{ ref }}\"></label>",
                styles: ["label { -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; } "]
            },] },
];
/** @nocollapse */
CalcCheckboxComponent.ctorParameters = function () { return [
    { type: CalcService, },
    { type: CommunicatorService, },
]; };
CalcCheckboxComponent.propDecorators = {
    'ref': [{ type: core.Input },],
    'yearRef': [{ type: core.Input },],
    'type': [{ type: core.Input },],
};

/**
 * CalcOption component allows to make inputs to the calc model using radio buttons.
 *
 */
var CalcOptionComponent = (function () {
    /**
   * Constructor for calc-stepper component
   *
   * @param {CalcService} calcService CalcService instance
   *
   * @param {TextService} textEngine TextService instance
   *
   * @param {CommunicatorService} communicator CommunicatorService instance
   *
   */
    function CalcOptionComponent(calcService, textEngine, communicator) {
        this.calcService = calcService;
        this.textEngine = textEngine;
        this.communicator = communicator;
        /**
         * Check the selected input
         */
        this.selectedItemNumber = 0;
        /**
         * Contains the items and use for iteration on html
         */
        this._items = [];
    }
    /**
     * Updated value to calc model after click input
     */
    CalcOptionComponent.prototype.selectionChanged = function (itemNo) {
        var self = this;
        var value;
        self.selectedItemNumber = itemNo;
        value = itemNo;
        if (this.yearRef) {
            var currentYear = this.calcService.getValue(this.yearRef);
            this.calcService.setValue(this.ref + '_R' + currentYear, value);
        }
        else {
            this.calcService.setValue(this.ref, itemNo);
        }
    };
    /**
     * OnInit lifecycle function to instantiate component
     */
    CalcOptionComponent.prototype.ngOnInit = function () {
        var self = this;
        this.processItems();
        this.processSelectedItem();
        this.observer = this.communicator.getEmitter(Constants.MODEL_CALC_COMPLETE).subscribe(function () {
            self.processItems();
            self.processSelectedItem();
        });
    };
    /**
     * Display value for Input Option
     */
    CalcOptionComponent.prototype.processItems = function () {
        var _this = this;
        var items = this.items;
        this._items = [];
        if (items && items.length) {
            items.forEach(function (val, index) {
                var itemName = '';
                if ((val.indexOf('tlInput') !== -1) || (val.indexOf('tlOutput') !== -1)) {
                    itemName = _this.calcService.getValue(val);
                }
                else {
                    itemName = _this.textEngine.getText(val) || val;
                }
                if (itemName) {
                    _this._items.push(itemName);
                }
            });
        }
    };
    /**
    * Process the selected items
    */
    CalcOptionComponent.prototype.processSelectedItem = function () {
        var modelVal;
        if (this.yearRef) {
            var currentYear = this.calcService.getValue(this.yearRef);
            modelVal = this.calcService.getValueForYear(this.ref, this.yearRef, true);
        }
        else {
            modelVal = this.calcService.getValue(this.ref, true);
        }
        this.selectedItemNumber = modelVal;
    };
    /**
     * Destroy the subscription before component destroy
     */
    CalcOptionComponent.prototype.ngOnDestroy = function () {
        if (this.observer) {
            this.observer.unsubscribe();
        }
    };
    /**
     * OnChanges lifecycle function to call on changes
     */
    CalcOptionComponent.prototype.ngOnChanges = function (changes) {
        this.processItems();
        this.processSelectedItem();
    };
    return CalcOptionComponent;
}());
CalcOptionComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'ism-calc-option',
                template: "<div class=\"radio-group\" data-toggle=\"buttons\"> <label class=\"btn custom-radio-button\" [class.checked]=\"selectedItemNumber == i\" *ngFor=\"let item of _items; let i = index\"> <input type=\"radio\" [name]=\"ref\" [value]=\"item\" [id]=\"ref + '_option' + i\" (click)=\"selectionChanged(i)\" [checked]=\"selectedItemNumber == i\"> {{item}} </label> </div>",
                styles: [":host { display: inline-block; width: 100%; } .radio-group { position: relative; display: -webkit-inline-box; display: -webkit-inline-flex; display: -ms-inline-flexbox; display: inline-flex; vertical-align: middle; width: 100%; justify-content: space-between; } .radio-group .custom-radio-button { cursor: pointer; padding: 8px 5px; font-size: 0.875rem; line-height: 0.875rem; } @media screen and (max-width: 1080px) { .radio-group .custom-radio-button { font-size: 0.875rem; line-height: 0.875rem; } } [data-toggle=buttons] .btn input[type=radio] { position: relative; } input[type='radio'] { -webkit-appearance: none; width: 20px; height: 20px; border: 1px solid #a8adb4; border-radius: 50%; outline: none; top: 3px; left: 0; } @media screen and (max-width: 1080px) { input[type='radio'] { width: 15px; height: 15px; } } input[type='radio']:hover { box-shadow: 0 0 5px 0px #28324b inset; } input[type='radio']:before { content: ''; display: block; width: 60%; height: 60%; margin: 20% auto; border-radius: 50%; } .checked input[type='radio']:before { background: #28324b; } "]
            },] },
];
/** @nocollapse */
CalcOptionComponent.ctorParameters = function () { return [
    { type: CalcService, },
    { type: TextService, },
    { type: CommunicatorService, },
]; };
CalcOptionComponent.propDecorators = {
    'items': [{ type: core.Input },],
    'ref': [{ type: core.Input },],
    'yearRef': [{ type: core.Input },],
};

/**
 * Stepper utility adds event listeners for mouse/touch and returns the new value to CalcStepper component to display
 *
 */
var Stepper = (function () {
    function Stepper() {
        /**
         * Value to be added/subtracted to the CalcStepper value
         *
         */
        this.amount = 0;
    }
    /**
     * bindStepper function binds the event listeners to CalcStepper buttons and input field
     *
     * @param {any} stepper stepper Object
     *
     * @param {number} [opts] optional options for stepper object
     */
    Stepper.prototype.bindStepper = function (stepper, opts) {
        var onchange = (opts) ? opts.onchange : function () { };
        // Bind field
        stepper.field.addEventListener('input', this.checkValidity.bind(this, stepper));
        this.stepper = stepper;
        this.stepper.onchange = onchange;
        this.addEventListener(stepper.buttons.neg, 'mousedown', this.start.bind(this), [false]);
        this.addEventListener(stepper.buttons.neg, 'touchstart', this.start.bind(this), [false]);
        this.addEventListener(stepper.buttons.neg, 'mouseup', this.stop.bind(this));
        this.addEventListener(stepper.buttons.neg, 'touchend', this.stop.bind(this));
        this.addEventListener(stepper.buttons.neg, 'mouseout', this.stop.bind(this));
        this.addEventListener(stepper.buttons.neg, 'touchleave', this.stop.bind(this));
        this.addEventListener(stepper.buttons.pos, 'mousedown', this.start.bind(this), [true]);
        this.addEventListener(stepper.buttons.pos, 'touchstart', this.start.bind(this), [true]);
        this.addEventListener(stepper.buttons.pos, 'mouseup', this.stop.bind(this));
        this.addEventListener(stepper.buttons.pos, 'touchend', this.stop.bind(this));
        this.addEventListener(stepper.buttons.pos, 'mouseout', this.stop.bind(this));
        this.addEventListener(stepper.buttons.pos, 'touchleave', this.stop.bind(this));
    };
    /**
     * addEventListener function binds the custom event listener to HTML elements
     *
     * @param {HTMLElement} el HTMLElement to bind event listener
     *
     * @param {string} event listener event
     *
     * @param {Function} listener Function to call when an event is fired
     *
     * @param {Array<any>} [parameters] optional parameters to apply to the event listener
     *
     * @param {boolean} [allowDefault] optional parameter to allow/prevent the default action when an event fires
     *
     */
    Stepper.prototype.addEventListener = function (el, event, listener, parameters, allowDefault) {
        var boundListener = function (e) {
            if (!e) {
                e = window.event;
            }
            listener.apply(this, [e].concat(parameters));
            // prevent default action if necessary
            if (!allowDefault) {
                if (e.preventDefault) {
                    e.preventDefault();
                }
                else {
                    e.returnValue = false;
                }
            }
        };
        if (el.addEventListener) {
            el.addEventListener(event, boundListener, false);
        }
    };
    /**
     * start function keeps the event alive until the user input is done
     *
     * @param {Event} e Event that is fired
     *
     * @param {boolean} increment Increments/Decrements the CalcStepper value by the defined step amount
     *
     */
    Stepper.prototype.start = function (e, increment) {
        // if the field is disabled or we are already updating, return immediately
        if (this.stepper.field.disabled || this.timeout !== undefined) {
            return;
        }
        // set the update step
        var step = (increment ? (this.getNum(this.stepper.field.step)) : -(this.getNum(this.stepper.field.step)));
        // update value
        this.updateStepperCount(step, this.stepper);
    };
    /**
     * stop function clears the timeout if any
     *
     */
    Stepper.prototype.stop = function () {
        // clear the timeout if it exists
        if (this.timeout !== undefined) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }
    };
    /**
     * bindAll function initializes the stepper object and then binds event listeners to the HTML elements
     *
     * @param {any} [opts] Optional options that applies to the stepper object
     *
     */
    Stepper.prototype.bindAll = function (opts) {
        opts = opts || {};
        opts.classes = opts.classes || {};
        opts.context = opts.context || document;
        opts.onchange = opts.onchange || function () { };
        opts.validator = opts.validator || function () { return true; }; // do no validation
        this.min = opts.min;
        this.max = opts.max;
        var $steppers = opts.context.getElementsByClassName(opts.stepper || 'stepper');
        for (var i = 0; i < $steppers.length; i++) {
            var stepper = {
                buttons: {
                    pos: $steppers[i].getElementsByClassName(opts.classes.add || 'add')[0],
                    neg: $steppers[i].getElementsByClassName(opts.classes.subtract || 'subtract')[0]
                },
                field: $steppers[i].getElementsByClassName(opts.classes.field || 'field')[0],
                validator: opts.validator
            };
            if (stepper.field && stepper.field['disabled']) {
                return;
            } // Don't bind on disabled fields.
            this.bindStepper(stepper, opts);
            // Don't forget to Enable/Disable buttons based on the inital value
            this.checkValidity(stepper);
        }
        return this;
    };
    /**
     * getNum function converts string to number
     *
     * @param {string} str String to be converted to number
     *
     */
    Stepper.prototype.getNum = function (str) {
        return Number(str);
    };
    /**
     * updateStepperCount function adds/subtracts the step amount and then calls onClick function
     *
     * @param {number} amount step amount to be added/subtracted
     *
     * @param {any} stepper stepper object
     *
     */
    Stepper.prototype.updateStepperCount = function (amount, stepper) {
        var _this = this;
        this.amount += Number(amount);
        this.onClick(this.amount, stepper);
        this.timeout = setTimeout(function () { _this.updateStepperCount(amount, stepper); }, 500);
    };
    /**
     * onClick function validates the input value againstmin/max and returns the correct value to CalcStepper component
     *
     * @param {number} amount step amount to be added/subtracted
     *
     * @param {any} stepper stepper object
     *
     * @param {Function} [onChange] Function that returns the updated value
     *
     */
    Stepper.prototype.onClick = function (amount, stepper, onChange) {
        if (typeof onChange === 'undefined') {
            onChange = stepper.onchange;
        }
        if (amount === 0) {
            return;
        }
        if (!stepper.validator(amount)) {
            if (amount < 0) {
                amount = this.min;
            }
            else {
                amount = this.max;
            }
            stepper.field.value = '' + amount;
            this.amount = 0;
            onChange(stepper.field.value);
            return;
        }
        if (!stepper.field.validity.valid || stepper.field.value === '') {
            stepper.field.value = 0;
        }
        if (amount < 0 && this.getNum(stepper.field.value) <= this.getNum(stepper.field.min) || amount > 0 && this.getNum(stepper.field.value) >= this.getNum(stepper.field.max)) {
            if (amount < 0) {
                amount = this.min;
            }
            else {
                amount = this.max;
            }
            stepper.field.value = '' + amount;
            this.amount = 0;
            onChange(stepper.field.value);
            return;
        }
        stepper.field.value = this.getNum(stepper.field.value) + amount;
        this.amount = 0;
        this.checkValidity(stepper);
        onChange(stepper.field.value);
    };
    /**
     * checkValidity function enables/disables the stepper buttons based on min/max values
     *
     * @param {any} stepper stepper object
     *
     */
    Stepper.prototype.checkValidity = function (stepper) {
        var VALUE = this.getNum(stepper.field.value);
        stepper.buttons.neg.disabled = (stepper.field.min === '' || stepper.field.min === 'undefined') ? false : (VALUE <= this.getNum(stepper.field.min));
        stepper.buttons.pos.disabled = (stepper.field.max === '' || stepper.field.max === 'undefined') ? false : (VALUE >= this.getNum(stepper.field.max));
    };
    /**
     * updateMinMax function sets the new min/max value
     *
     * @param {any} newMin new min value to set
     *
     * @param {any} newMax new max value to set
     *
     */
    Stepper.prototype.updateMinMax = function (newMin, newMax) {
        this.min = newMin;
        this.max = newMax;
    };
    return Stepper;
}());

/**
 * CalcStepper component allows to make inputs to the calc model using an input and buttons to increment and decrement.
 *
 */
var CalcStepperComponent = (function () {
    /**
     * Constructor for calc-stepper component
     *
     * @param {CalcService} calcService CalcService instance
     *
     * @param {numberFormatter} numberFormatter NumberFormattingPipe instance
     *
     * @param {elRef} elRef ElementRef instance
     *
     */
    function CalcStepperComponent(calcService, numberFormatter, elRef, communicator) {
        this.calcService = calcService;
        this.numberFormatter = numberFormatter;
        this.elRef = elRef;
        this.communicator = communicator;
        /**
         * Input binding for range ref
         *
         */
        this.ref = '';
        /**
         * Input binding to Format value
         *
         */
        this.format = '';
        /**
         * Input binding for inputFormat
         *
         */
        this.inputFormat = '';
        /**
         * Input binding for Scaler
         *
         */
        this.scaler = 1;
        /**
         * Input binding for Step value for input element
         *
         */
        this.step = 1;
        /**
         * Input binding for inRef
         *
         */
        this.inRef = '';
        /**
         * Input binding for outRef
         *
         */
        this.outRef = '';
        /**
         * Flag to check if the input has focused
         *
         */
        this.isFocused = false;
    }
    /**
     *
     * Function will listen to the keyup event of enter key and update the value in model
     */
    CalcStepperComponent.prototype.onKeyUp = function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        if (this.isFocused) {
            // Enter Key
            if (ev.keyCode === 13) {
                this.saveDataToModel(this.dirtyValue);
            }
        }
    };
    /**
     * OnInit lifecycle function to instantiate component
     *
     */
    CalcStepperComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.el = this.elRef.nativeElement;
        this.outRef = (this.outRef) ? this.outRef : this.ref;
        this.inRef = (this.inRef) ? this.inRef : this.ref;
        this.inputFormat = (this.inputFormat) ? this.inputFormat : this.format;
        this.inputScaler = (this.inputScaler) ? this.inputScaler : this.scaler;
        this.min = (this.min) ? this.min : this.outputMin;
        this.max = (this.max) ? this.max : this.outputMax;
        var modelVal = null;
        if (this.outRef === this.inRef) {
            modelVal = this.calcService.getValueForYear(this.ref, this.yearRef, true);
        }
        else {
            modelVal = this.calcService.getValueForYear(this.inRef, this.yearRef, true);
        }
        if (this.format === '0%') {
            this.value = '' + Math.round(this.numberFormatter.parse(modelVal, this.inputScaler));
        }
        else if (this.format === '0.0%') {
            this.value = '' + parseFloat(this.numberFormatter.parse(modelVal, this.inputScaler)).toFixed(1);
        }
        else if (this.format === '0.00%') {
            this.value = '' + parseFloat(this.numberFormatter.parse(modelVal, this.inputScaler)).toFixed(2);
        }
        else {
            this.value = this.numberFormatter.parse(modelVal, this.inputScaler) + '';
        }
        this.subscription = this.communicator.getEmitter(Constants.MODEL_CALC_COMPLETE).subscribe(function () {
            _this.onModelChange();
        });
    };
    /**
     * AfterViewInit lifecycle function to bind the input and buttons with eventListeners
     *
     */
    CalcStepperComponent.prototype.ngAfterViewInit = function () {
        new Stepper().bindAll({ context: this.el, onchange: this.onStepperButtonClick.bind(this), validator: this.getValidator(), max: this.outputMax, min: this.outputMin });
    };
    /**
     * OnChanges lifecycle function to process and save the updated value to the model
     *
     */
    CalcStepperComponent.prototype.ngOnChanges = function () {
        this.onModelChange();
    };
    /**
     *
     * OnChanges lifecycle function to process and save the updated value to model
     *
     * @param {value} value Updated value
     *
     */
    CalcStepperComponent.prototype.onValueChange = function (value) {
        if (value === '') {
            value = '0';
        }
        this.dirtyValue = value;
    };
    /**
     *
     * Function to format the updated value and save to model
     *
     * @param {value} value Updated value
     *
     */
    CalcStepperComponent.prototype.onStepperButtonClick = function (value) {
        if (!this.isFocused) {
            this.inputValueRef.nativeElement.focus();
            this.onFocus();
            return;
        }
        if (this.format === '0%') {
            value = '' + Math.round(value);
        }
        else if (this.format === '0.0%') {
            value = '' + parseFloat(value).toFixed(1);
        }
        else if (this.format === '0.00%') {
            value = '' + parseFloat(value).toFixed(2);
        }
        if (this.value !== value) {
            this.value = value;
            var modelValue = this.numberFormatter.parse(this.numberFormatter.transform(value, this.inputFormat, this.inputScaler));
            modelValue = modelValue.toString().split('$').join('');
            this.calcService.setValueForYear(this.inRef, modelValue, this.yearRef);
        }
    };
    /**
     * Function to format and display the updated value
     *
     */
    CalcStepperComponent.prototype.onModelChange = function () {
        var modelVal = null;
        if (this.outRef === this.inRef) {
            modelVal = this.calcService.getValueForYear(this.ref, this.yearRef, true);
        }
        else {
            modelVal = this.calcService.getValueForYear(this.inRef, this.yearRef, true);
        }
        if (this.format === '0%' || this.format === '0.0%' || this.format === '0.00%') {
            this.value = '' + (this.numberFormatter.parse(modelVal, this.inputScaler));
        }
        else {
            this.value = this.numberFormatter.parse(modelVal, this.inputScaler) + '';
        }
    };
    /**
     * Function to check if stepping down doesn't goes out of bounds
     *
     */
    CalcStepperComponent.prototype.validator = function (amount) {
        var outVal = this.calcService.getValueForYear(this.outRef, this.yearRef, true);
        amount = this.numberFormatter.parse(this.numberFormatter.transform(amount, this.inputFormat, this.inputScaler));
        // check if stepping down goes out of bounds
        if (this.outputMin !== undefined && amount < 0) {
            if ((outVal + amount) < Number(this.outputMin)) {
                return false;
            }
        }
        else if (this.outputMax !== undefined && amount > 0) {
            if ((outVal + amount) > Number(this.outputMax)) {
                return false;
            }
        }
        return true;
    };
    /**
     * Function to pass the amount to Stepper Class
     *
     */
    CalcStepperComponent.prototype.getValidator = function () {
        var self = this;
        return function (amount) {
            return self.validator(amount);
        };
    };
    /**
     * Function to check if the new value is not out of bounds and then call onStepperButtonClick function
     *
     * @param {enteredValue} enteredValue Value entered in input box
     *
     */
    CalcStepperComponent.prototype.saveDataToModel = function (enteredValue) {
        if (enteredValue >= Number(this.outputMin) && enteredValue <= Number(this.outputMax)) {
            this.onStepperButtonClick(enteredValue);
        }
        else if (enteredValue < Number(this.outputMin)) {
            this.onStepperButtonClick(Number(this.outputMin));
        }
        else if (enteredValue > Number(this.outputMax)) {
            this.onStepperButtonClick(Number(this.outputMax));
        }
        else {
            this.onStepperButtonClick(enteredValue);
        }
    };
    /**
     * Function to set isFocused flag true when input box gains focus
     *
     */
    CalcStepperComponent.prototype.onFocus = function () {
        this.isFocused = true;
    };
    /**
     * Function to save the updated value to model when the input loses focus
     *
     */
    CalcStepperComponent.prototype.onBlur = function (enteredValue) {
        if (enteredValue === '') {
            enteredValue = '0';
        }
        if (enteredValue !== this.value) {
            this.saveDataToModel(enteredValue);
        }
        this.isFocused = false;
    };
    /**
     * Function to set focus on input when the user clicks on the value
     *
     */
    CalcStepperComponent.prototype.setFocusOnInput = function () {
        this.inputValueRef.nativeElement.focus();
        this.onFocus();
    };
    /**
     * OnDestroy lifecycle function for component. This destroys any active subscriptions to calcservice.
     *
     */
    CalcStepperComponent.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    };
    return CalcStepperComponent;
}());
CalcStepperComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'ism-calc-stepper',
                template: "<div class='stepper'> <div class='fa fa-plus add stepper-button' [class.isActive]=\"isFocused\" role='button'></div> <input class='field' #inputValue type='text' [value]=\"value\" [min]='min' [max]='max' OnlyNumber=\"true\" [step]=\"step\" (change)=\"onValueChange(inputValue.value)\" (blur)=\"onBlur(inputValue.value)\" (focus)=\"onFocus()\" /> <span class=\"field-value\" (click)=\"setFocusOnInput()\" *ngIf=\"!isFocused\">{{value | numFormat:format:scaler}}</span> <div class='fa fa-minus subtract stepper-button' [class.isActive]=\"isFocused\" role='button'></div> </div>",
                styles: [":host { display: inline-block; width: 100%; max-width: 150px; height: 40px; background-color: #fff; color: #434951; overflow: hidden; position: relative; border: 1px solid #cecece; } :host .stepper { height: 100%; } :host input { margin-left: 30px; height: 100%; width: calc(100% - 60px); text-align: center; color: #6d747e; padding-right: 5px; border: none; font-size: 16px; } :host input:active, :host input:focus { font-weight: 600; border: 2px solid #28324b; } :host(.disabled) { background-color: #6d747e; } :host(.disabled) .stepper-button { pointer-events: none; color: #28324b; } .stepper { font-size: 0.875rem; } .stepper > * { float: left; display: inline-block; } .stepper-button { cursor: pointer; display: inline-block; font-size: 1.125rem; width: 30px; height: 40px; line-height: 40px; position: absolute; color: #fff; background-color: #fff; text-align: center; } .stepper-button.isActive { color: #6d747e; } .stepper .add { right: 0; border-left: 0px; } .stepper .subtract { left: 0; border-right: 0px; } .stepper .hidden { display: none; } .stepper .field { color: #434951; font-weight: bold; } .stepper .field-value { position: absolute; z-index: 1; left: 0; top: 0; font-size: 16px; height: 100%; width: calc(100% - 0px); text-align: center; color: #434951; padding-right: 5px; border: none; padding-top: 10px; display: block; background: #fff; } "]
            },] },
];
/** @nocollapse */
CalcStepperComponent.ctorParameters = function () { return [
    { type: CalcService, },
    { type: NumberFormattingPipe, },
    { type: core.ElementRef, },
    { type: CommunicatorService, },
]; };
CalcStepperComponent.propDecorators = {
    'ref': [{ type: core.Input },],
    'yearRef': [{ type: core.Input },],
    'format': [{ type: core.Input },],
    'inputFormat': [{ type: core.Input },],
    'scaler': [{ type: core.Input },],
    'step': [{ type: core.Input },],
    'min': [{ type: core.Input },],
    'max': [{ type: core.Input },],
    'inRef': [{ type: core.Input },],
    'outRef': [{ type: core.Input },],
    'inputScaler': [{ type: core.Input },],
    'outputMin': [{ type: core.Input },],
    'outputMax': [{ type: core.Input },],
    'inputValueRef': [{ type: core.ViewChild, args: ['inputValue',] },],
    'onKeyUp': [{ type: core.HostListener, args: ['document:keyup', ['$event'],] },],
};

/**
 * list of declarations / exports for calc module
 *
 */
var declarations = [CalcInputComponent, CalcOutputComponent,
    CalcFormatterDirective, CalcSliderComponent, CalcDropdownComponent, CalcCheckboxComponent, CalcOptionComponent, CalcStepperComponent];
/**
 * Calc module is used to interface and update the calc model using jsCalc
 *
 */
var CalcModule = (function () {
    function CalcModule() {
    }
    return CalcModule;
}());
CalcModule.decorators = [
    { type: core.NgModule, args: [{
                imports: [
                    common.CommonModule,
                    forms.FormsModule,
                    ServicesModule,
                    ngxBootstrap.BsDropdownModule.forRoot()
                ],
                declarations: declarations,
                exports: declarations,
                providers: [CalcService, CalcModelLoadedGuard]
            },] },
];
/** @nocollapse */
CalcModule.ctorParameters = function () { return []; };

/**
 * Keys for chart types and options to be used with highcharts
*/
/**
 * Keys for chart types and options to be used with highcharts
*/ var Defaults = {
    Pie: 'pie',
    Bar: 'bar',
    Column: 'column',
    StackedColumn: 'stackedcolumn',
    StackedBar: 'stackedbar',
    Line: 'line',
    Bubble: 'bubble',
    Donut: 'donut',
    Heatmap: 'heatmap',
    Scatter: 'scatter',
    SolidGauge: 'solidgauge',
    Waterfall: 'waterfall',
    Legend: 'legend'
};

/**
 * ChartUtils service provides utility functions for generating charts using {@link ChartComponent}
 *
 */
var ChartUtilsService = (function () {
    /**
     * Constructor function for instantiating the service
     *
     * @param {CalcService} calcService Instance of CalcService to fetch data from model
     *
     * @param {TextService} textService Instance of TextService to fetch text from content json
     */
    function ChartUtilsService(calcService, textService) {
        this.calcService = calcService;
        this.textService = textService;
    }
    /**
     * Fetch data for pie charts
     *
     * @param {Array<string>} refArr Array of named ranges for which values need to be fetched from the calc model
     *
     * @param {any} [dataPoints] Array of dataPoints which needs to be passed to the series object with the data values
     *
     * @param {string} [yearRef] Named range ref for Current year in the model that needs to be appended to the refs in refArray
     *
     */
    ChartUtilsService.prototype.getDataForPieChart = function (refArr, dataPoints, yearRef) {
        var _this = this;
        var out = [];
        if (typeof refArr === 'object' && refArr instanceof Array) {
            refArr.forEach(function (rangeRef, refIndex) {
                var val = _this.calcService.getValueForYear(rangeRef, yearRef, true), 
                // const val = Math.random() * 10000000,
                dataPoint = (dataPoints) ? dataPoints[refIndex] : null, key = (dataPoint) ? dataPoint.name : null;
                var lbl;
                if (key) {
                    lbl = (_this.textService.getTextForYear(key, yearRef)) ? _this.textService.getTextForYear(key, yearRef) :
                        (_this.textService.getText(key)) ? _this.textService.getText(key) : key;
                    if (lbl === key) {
                        lbl = (_this.calcService.getValue(key)) ? _this.calcService.getValue(key) : key;
                    }
                }
                if (dataPoints) {
                    out.push({
                        name: lbl,
                        y: val
                    });
                }
                else {
                    out.push(val);
                }
            });
        }
        return out;
    };
    /**
     * Fetch data for all charts but pie chart.
     *
     * @param {Array<string>} refArr Array of named ranges for which values need to be fetched from the calc model
     *
     * @param {string} [yearRef] Named range ref for Current year in the model that needs to be appended to the refs in refArray
     *
     */
    ChartUtilsService.prototype.getDataForChart = function (refArr, yearRef) {
        var _this = this;
        var data = [];
        if (typeof refArr === 'string') {
            // return Math.random() * 10000000;
            return this.calcService.getValueForYear(refArr, yearRef, true);
        }
        refArr.forEach(function (ref) {
            data.push(_this.getDataForChart(ref));
        });
        return data;
    };
    /**
     * Get defaults for different chart types and options
     *
     * @param {Array<string>} types Array containing Chart types and options keys for which defaults need to be returned
     *
     * @returns {Highcharts.Options}
     */
    ChartUtilsService.prototype.getDefaultsFor = function (types) {
        var _this = this;
        var opt = {};
        if (types && types.length) {
            types.forEach(function (type) {
                _.merge(opt, _this.getDefaultsOptionsForChart(type));
            });
        }
        return opt;
    };
    /**
     * Get defaults for a chart type or option
     *
     * @param {string} chartType Chart types or option key for which default needs to be returned
     *
     * @returns {Highcharts.Options}
     */
    ChartUtilsService.prototype.getDefaultsOptionsForChart = function (chartType) {
        switch (chartType) {
            case Defaults.Bar:
                return this.getBarChartPlotOptions();
            case Defaults.Column:
                return this.getColumnChartPlotOptions();
            case Defaults.Pie:
            case Defaults.Donut:
                return this.getPieChartPlotOptions();
            case Defaults.Heatmap:
                return this.getHeatmapChartPlotOptions();
            case Defaults.Line:
                return this.getLineChartPlotOptions();
            case Defaults.Scatter:
                return this.getScatterChartPlotOptions();
            case Defaults.SolidGauge:
                return this.getSolidGaugeChartPlotOptions();
            case Defaults.StackedBar:
                return this.getStackedBarChartPlotOptions();
            case Defaults.StackedColumn:
                return this.getStackedColumnChartPlotOptions();
            case Defaults.Legend:
                return this.getDefaultLegendOptions();
            default:
                return {
                    chart: {
                        backgroundColor: '#FFFFFF'
                    },
                    title: {
                        text: ''
                    },
                    subtitle: {
                        text: ''
                    },
                    exporting: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    }
                };
        }
    };
    /**
     * Get svg for chart object
     *
     * @returns {string}
     */
    ChartUtilsService.prototype.getChartAsImageURI = function (chart) {
        var svg = chart.getSVG();
        return 'data:image/svg+xml' + svg;
    };
    /**
     * Get default options for chart legend
     *
     * @returns {Highcharts.Options}
     */
    ChartUtilsService.prototype.getDefaultLegendOptions = function () {
        return {
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                x: 0,
                y: 0,
                floating: false,
                borderWidth: 0,
                shadow: false,
                symbolRadius: 5
            }
        };
    };
    /**
     * Get default options for bar chart
     *
     * @returns {Highcharts.Options}
     */
    ChartUtilsService.prototype.getBarChartPlotOptions = function () {
        return {
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            }
        };
    };
    /**
     * Get default options for stacked column chart
     *
     * @returns {Highcharts.Options}
     */
    ChartUtilsService.prototype.getStackedColumnChartPlotOptions = function () {
        return {
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            yAxis: [{
                    stackLabels: {
                        enabled: true,
                    }
                }]
        };
    };
    /**
     * Get default options for column chart
     *
     * @returns {Highcharts.Options}
     */
    ChartUtilsService.prototype.getColumnChartPlotOptions = function () {
        return {
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true
                    }
                }
            }
        };
    };
    /**
     * Get default options for pie chart
     *
     * @returns {Highcharts.Options}
     */
    ChartUtilsService.prototype.getPieChartPlotOptions = function () {
        return {
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true
                    },
                    showInLegend: true
                }
            }
        };
    };
    /**
     * Get default options for line chart
     *
     * @returns {Highcharts.Options}
     */
    ChartUtilsService.prototype.getLineChartPlotOptions = function () {
        return {
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: false
                    }
                },
                series: {
                    marker: {
                        radius: 8
                    }
                }
            }
        };
    };
    /**
     * Get default options for heatmap chart
     *
     * @returns {Highcharts.Options}
     */
    ChartUtilsService.prototype.getHeatmapChartPlotOptions = function () {
        return {
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true
                    }
                }
            }
        };
    };
    /**
     * Get default options for stacked bar chart
     *
     * @returns {Highcharts.Options}
     */
    ChartUtilsService.prototype.getStackedBarChartPlotOptions = function () {
        return {
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            }
        };
    };
    /**
     * Get default options for scatter chart
     *
     * @returns {Highcharts.Options}
     */
    ChartUtilsService.prototype.getScatterChartPlotOptions = function () {
        return {
            plotOptions: {
                scatter: {
                    marker: {
                        radius: 5,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    }
                }
            }
        };
    };
    /**
     * Get default options for solid gauge chart
     *
     * @returns {Highcharts.Options}
     */
    ChartUtilsService.prototype.getSolidGaugeChartPlotOptions = function () {
        return {
            'pane': {
                'center': ['50%', '70%'],
                'startAngle': -125,
                'endAngle': 125,
                'size': '90%',
                'background': [{
                        'shape': 'arc',
                        'innerRadius': '90%',
                        'outerRadius': '100%'
                    }]
            },
            'plotOptions': {
                'solidgauge': {
                    'rounded': true,
                    'dataLabels': {
                        y: 40,
                        borderWidth: 0
                    },
                    'innerRadius': '90%',
                    'outerRadius': '100%'
                }
            },
            yAxis: [{
                    tickPosition: 'inside',
                    tickWidth: 1,
                    lineWidth: 1
                }],
            xAxis: {
                tickPosition: 'inside',
                tickWidth: 1,
                lineWidth: 1
            }
        };
    };
    return ChartUtilsService;
}());
ChartUtilsService.decorators = [
    { type: core.Injectable },
];
/** @nocollapse */
ChartUtilsService.ctorParameters = function () { return [
    { type: CalcService, },
    { type: TextService, },
]; };

/**
 * HighchartsStatic library to provide highcharts instance with extra modules and plugins
 *
 */
var HighchartsStatic = (function () {
    /**
     * HighchartsStatic service constructor
     *
     * We extend the highcharts instance with modules and plugins when we instantiate this service
     *
     */
    function HighchartsStatic() {
        var hc = _Highcharts, hm = require('highcharts/highcharts-more'), sg = require('highcharts/modules/solid-gauge'), hmap = require('highcharts/modules/heatmap'), exp = require('highcharts/modules/exporting'), hfc = require('@btsdigital/highcharts-formatter-plugin');
        this._highchartsStatic = hc;
        hm(hc);
        sg(hc);
        hmap(hc);
        exp(hc);
        hfc(hc, NumberFormatting);
        //    this.extendHighchartsToUseCustomFormatter(hc);
    }
    /**
     * Returns a reference to _highchartsStatic member
     *
     * @return {Highcharts.Static}
     *
     */
    HighchartsStatic.prototype.getHighchartsStatic = function () {
        return this._highchartsStatic;
    };
    return HighchartsStatic;
}());
// /**
// * Extends highcharts library and changes the formatSingle function to use numberformatting/numeraljs tokens
// *
// * @param {Highcharts.Static} hc Highcharts library instance
// */
// extendHighchartsToUseCustomFormatter(hc: Highcharts.Static) {
//   hc.wrap(hc, 'formatSingle', function(originalFormat: Function, format: string, value: any) {
//     let formatStr: string, scaler: number;
//     if (format) {
//       if (format.indexOf('date') === -1 && format.indexOf(':') !== -1) {
//         formatStr = format.split(':')[0];
//         scaler = Number(format.split(':')[1]) || 1;
//       } else {
//         formatStr = format;
//         scaler = 1;
//       }
//       return NumberFormatting.format(value, formatStr, scaler);
//     } else {
//       return value;
//     }
//   });
// }
HighchartsStatic.decorators = [
    { type: core.Injectable },
];
/** @nocollapse */
HighchartsStatic.ctorParameters = function () { return []; };

/**
 * Chartcomponent for rendering charts using highcharts library
 *
 */
var ChartComponent = (function () {
    /**
     * Constructor for chart component
     *
     * @param {CalcService} calcService CalcService Instance
     *
     * @param {TextService} textService TextService Instance
     *
     * @param {CommunicatorService} communicatorService CommunicatorService instance
     *
     * @param {ChartUtilsService} chartUtils ChartUtilsService instance
     *
     * @param {LoggerService} logger LoggerService instance
     *
     * @param {ChangeDetectorRef} cdRef ChangeDetectorRef instance
     *
     * @param {HighchartsStatic} highCharts Highcharts api reference
     *
     */
    function ChartComponent(calcService, textService, communicatorService, chartUtils, logger, cdRef, highCharts) {
        this.calcService = calcService;
        this.textService = textService;
        this.communicatorService = communicatorService;
        this.chartUtils = chartUtils;
        this.logger = logger;
        this.cdRef = cdRef;
        this.highCharts = highCharts;
        /**
         * Array of default options that need to be appended to chartConfig before rendering
         */
        this.defaultOptions = ['default', 'legend'];
    }
    /**
     * OnInit function for component
     *
     * We initialize and render the component in this function
     */
    ChartComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (typeof this.rangeRef === 'undefined' || (this.rangeRef && !this.rangeRef.length)) {
            throw new Error('Rangeref not defined!');
        }
        this.initConfig();
        this.renderChart();
        this.modelChangeSub = this.communicatorService.getEmitter(Constants.MODEL_CALC_COMPLETE)
            .subscribe(function () {
            _this.update();
        });
        /*setInterval(() => {
          this.communicatorService.trigger(Constants.MODEL_CALC_COMPLETE);
        }, 10000);*/
    };
    /**
     * Create default starting configuration for the chart to be rendered
     *
     */
    ChartComponent.prototype.setChartDefault = function () {
        this.chartConfig = {
            chart: {
                renderTo: this.chartElem.nativeElement,
                backgroundColor: '#FFFFFF'
            },
            lang: {
                thousandsSep: ','
            },
            credits: {
                enabled: false
            }
        };
    };
    /**
     * This function triggers the configuration for different chart options
     *
     */
    ChartComponent.prototype.initConfig = function () {
        this.setChartDefault();
        // process series
        this.processSeriesOptions();
        // process axes
        this.processXAxisOptions();
        this.processYAxisOptions();
    };
    /**
     * This function renders the highcharts using the chartOptions member.
     *
     */
    ChartComponent.prototype.renderChart = function () {
        // process additional options
        var defaults;
        defaults = this.chartUtils.getDefaultsFor(this.defaultOptions);
        var opt = {};
        _.merge(opt, defaults, this.chartOptions, this.chartConfig);
        // console.log(this.chartConfig.get());
        this.chart = this.highCharts.getHighchartsStatic().chart(opt);
    };
    /**
     * This function is triggered when calc model is updated. The chart data is updated using this function
     *
     */
    ChartComponent.prototype.update = function () {
        var _this = this;
        if (typeof this.seriesOptions === 'object' && this.seriesOptions instanceof Array) {
            this.seriesOptions.forEach(function (series, index) {
                var dataRef = _this.rangeRef[index];
                var data = ((_this.chartOptions &&
                    _this.chartOptions.chart &&
                    _this.chartOptions.chart.type === 'pie') || series.type === 'pie') ?
                    _this.chartUtils.getDataForPieChart(_this.rangeRef, null, _this.yearRef) :
                    _this.chartUtils.getDataForChart(dataRef, _this.yearRef);
                _this.chart.series[index].setData(data, false);
            });
            this.chart.redraw();
        }
    };
    /**
     * OnDestroy function for component. We clear any events / subscribers in this function
     *
     */
    ChartComponent.prototype.ngOnDestroy = function () {
        if (this.modelChangeSub) {
            this.modelChangeSub.unsubscribe();
        }
    };
    /**
     * OnChanges function for component. This function is triggered when any __Input__ property of component is updated
     *
     */
    ChartComponent.prototype.ngOnChanges = function () {
        if (this.chart) {
            this.chart.destroy();
            this.initConfig();
            this.renderChart();
        }
    };
    /**
     * This function processes the xAxis options and sets them to chartOptions.
     *
     */
    ChartComponent.prototype.processXAxisOptions = function () {
        if (!this.xAxis) {
            return;
        }
        if (typeof this.xAxis === 'object' && !(this.xAxis instanceof Array)) {
            this.xAxis = [this.xAxis];
        }
        this.processAxisLabels(this.xAxis[0]); // process category labels
        this.chartConfig.xAxis = this.xAxis[0];
    };
    /**
     * This function processes the yAxis options and sets them to chartOptions.
     *
     */
    ChartComponent.prototype.processYAxisOptions = function () {
        var axis;
        if (!this.yAxis) {
            return;
        }
        if (typeof this.yAxis === 'object' && !(this.yAxis instanceof Array)) {
            axis = this.yAxis = [this.yAxis];
        }
        else {
            axis = this.yAxis;
        }
        this.processAxisLabels(this.yAxis[0]); // process category labels
        this.chartConfig.yAxis = this.yAxis;
    };
    /**
     * This function processes the Axis Labels and sets them to axisOptions.
     *
     */
    ChartComponent.prototype.processAxisLabels = function (axisOptions) {
        var _this = this;
        if (!axisOptions.categories) {
            return; // do nothing if labels are not defined!
        }
        var labelsArr = [], labels = axisOptions.categories;
        labels.forEach(function (label) {
            var lbl = (/tl(In|Out)put.+/i.test(label)) ?
                ((_this.calcService.getValueForYear(label, _this.yearRef)) ?
                    _this.calcService.getValueForYear(label, _this.yearRef) : _this.calcService.getValue(label)) :
                _this.textService.getTextForYear(label, _this.yearRef) ?
                    _this.textService.getTextForYear(label, _this.yearRef) : _this.textService.getText(label) ?
                    _this.textService.getText(label) : label; // fallback to the label passed
            labelsArr.push(lbl);
        });
        axisOptions.categories = labelsArr;
    };
    /**
     * This function processes the series options and sets them to chartOptions.
     *
     */
    ChartComponent.prototype.processSeriesOptions = function () {
        var _this = this;
        if (typeof this.seriesOptions === 'object' && this.seriesOptions instanceof Array) {
            this.seriesOptions.forEach(function (series, index) {
                var type = series.type, dataRef = _this.rangeRef[index];
                if (_this.defaultOptions.indexOf(series.type) === -1) {
                    _this.defaultOptions.push(series.type);
                }
                // handle stacked column / bar chart types
                if (series.type === 'stackedcolumn') {
                    series.type = 'column';
                }
                else if (series.type === 'stackedbar') {
                    series.type = 'bar';
                }
                _this.fetchSeries(series, dataRef);
                _this.chartConfig.series = _this.seriesOptions;
            });
        }
        else {
            this.logger.log('Invalid series options');
        }
    };
    /**
     * This function fetches the data for the series and sets it to chartOptions.series object
     *
     */
    ChartComponent.prototype.fetchSeries = function (series, dataRef) {
        series.data = ((this.chartOptions && this.chartOptions.chart && this.chartOptions.chart.type === 'pie') || series.type === 'pie') ?
            this.chartUtils.getDataForPieChart(this.rangeRef, series.data, this.yearRef) :
            this.chartUtils.getDataForChart(dataRef, this.yearRef);
        series.name = this.textService.getTextForYear(series.name, this.yearRef) ?
            (this.textService.getTextForYear(series.name, this.yearRef) ?
                this.textService.getTextForYear(series.name, this.yearRef) :
                this.textService.getText(series.name)) :
            (this.calcService.getValue(series.name) ?
                this.calcService.getValue(series.name) : series.name);
    };
    return ChartComponent;
}());
ChartComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'ism-chart',
                template: "<div class=\"chart-elem {{defaultOptions.join(' ')}}\" #chartelem ></div>",
                styles: [":host >>> .chart-elem.solidgauge .highcharts-minor-grid-line, :host >>> .chart-elem.solidgauge .highcharts-grid-line { stroke: transparent; } "],
                changeDetection: core.ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
ChartComponent.ctorParameters = function () { return [
    { type: CalcService, },
    { type: TextService, },
    { type: CommunicatorService, },
    { type: ChartUtilsService, },
    { type: LoggerService, },
    { type: core.ChangeDetectorRef, },
    { type: HighchartsStatic, },
]; };
ChartComponent.propDecorators = {
    'rangeRef': [{ type: core.Input },],
    'yearRef': [{ type: core.Input },],
    'xAxis': [{ type: core.Input },],
    'yAxis': [{ type: core.Input },],
    'seriesOptions': [{ type: core.Input },],
    'chartOptions': [{ type: core.Input },],
    'chartElem': [{ type: core.ViewChild, args: ['chartelem',] },],
};

/**
 *
 * Component to display text from content json
 *
 */
var TextOutputComponent = (function () {
    /**
     * Constructor for text-output component
     *
     * @param {TextService} textService {@link TextService} instance
     *
     * @param {CommunicatorService} communicator {@link CommunicatorService} instance
     *
     */
    function TextOutputComponent(textService, communicator) {
        this.textService = textService;
        this.communicator = communicator;
        /**
         * Input binding for flag to display text as innerHtml instead of a text node.
         *
         */
        this.asInnerHtml = false;
    }
    /**
     * Initialize subscribers and component with value from content json
     *
     */
    TextOutputComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscriber = this.communicator
            .getEmitter(Constants.TEXT_ENGINE.LANGUAGE_LOADED)
            .subscribe(function () {
            _this.updateText();
        });
        this.updateText();
    };
    /**
     * Update text value from content json
     *
     */
    TextOutputComponent.prototype.updateText = function () {
        this.value = this.textService.getTextForYear(this.key, this.yearRef, this.sceneId) ? this.textService.getTextForYear(this.key, this.yearRef, this.sceneId) : this.key;
    };
    /**
     * Update component when any input bindings are changed
     *
     * @param {SimpleChanges} changes SimpleChanges array
     *
     */
    TextOutputComponent.prototype.ngOnChanges = function (changes) {
        var change = changes['key'];
        if (change.isFirstChange()) {
            return;
        }
        this.updateText();
    };
    /**
     * Destroy any subscriptions when component instance is destroyed
     *
     */
    TextOutputComponent.prototype.ngOnDestroy = function () {
        this.subscriber.unsubscribe();
    };
    return TextOutputComponent;
}());
TextOutputComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'ism-text-output',
                template: "<span *ngIf=\"asInnerHtml\" [innerHTML]=\"value\"></span><ng-template [ngIf]=\"!asInnerHtml\">{{value}}</ng-template>",
                changeDetection: core.ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
TextOutputComponent.ctorParameters = function () { return [
    { type: TextService, },
    { type: CommunicatorService, },
]; };
TextOutputComponent.propDecorators = {
    'key': [{ type: core.Input },],
    'yearRef': [{ type: core.Input },],
    'asInnerHtml': [{ type: core.Input },],
    'sceneId': [{ type: core.Input },],
};

/**
 * Text engine module works as a content loader utility and allows switching between multiple languages
 *
 */
var TextEngineModule = (function () {
    function TextEngineModule() {
    }
    return TextEngineModule;
}());
TextEngineModule.decorators = [
    { type: core.NgModule, args: [{
                imports: [
                    common.CommonModule,
                    http.HttpModule,
                    CalcModule,
                    ServicesModule
                ],
                declarations: [TextOutputComponent],
                exports: [TextOutputComponent],
                providers: [TextService]
            },] },
];
/** @nocollapse */
TextEngineModule.ctorParameters = function () { return []; };

/**
 * Chart module for generating charts using Highcharts library
 *
 */
var ChartModule = (function () {
    function ChartModule() {
    }
    return ChartModule;
}());
ChartModule.decorators = [
    { type: core.NgModule, args: [{
                imports: [
                    common.CommonModule,
                    CalcModule,
                    TextEngineModule,
                    ServicesModule
                ],
                declarations: [ChartComponent],
                exports: [ChartComponent],
                providers: [HighchartsStatic, ChartUtilsService]
            },] },
];
/** @nocollapse */
ChartModule.ctorParameters = function () { return []; };

/**
 * The module that includes all the IsomerModules like {@link CalcModule}, {@link ChartModule}, ...
 *
 */
var IsomerCoreModule = (function () {
    function IsomerCoreModule() {
    }
    return IsomerCoreModule;
}());
IsomerCoreModule.decorators = [
    { type: core.NgModule, args: [{
                imports: [
                    common.CommonModule,
                    http.HttpModule,
                    forms.FormsModule,
                    ServicesModule,
                    ConnectModule,
                    ChartModule,
                    CalcModule,
                    TextEngineModule,
                    pulsesignalr.SignalRModule
                ],
                declarations: [],
                exports: [CalcModule, ChartModule, ServicesModule, ConnectModule, TextEngineModule, pulsesignalr.SignalRModule],
                providers: []
            },] },
];
/** @nocollapse */
IsomerCoreModule.ctorParameters = function () { return []; };

exports.IsomerCoreModule = IsomerCoreModule;
exports.CalcModule = CalcModule;
exports.CalcOutputComponent = CalcOutputComponent;
exports.CalcInputComponent = CalcInputComponent;
exports.CalcDropdownComponent = CalcDropdownComponent;
exports.CalcSliderComponent = CalcSliderComponent;
exports.CalcCheckboxComponent = CalcCheckboxComponent;
exports.CalcOptionComponent = CalcOptionComponent;
exports.CalcStepperComponent = CalcStepperComponent;
exports.CalcService = CalcService;
exports.CalcModelLoadedGuard = CalcModelLoadedGuard;
exports.CalcFormatterDirective = CalcFormatterDirective;
exports.ChartModule = ChartModule;
exports.ChartComponent = ChartComponent;
exports.ChartUtilsService = ChartUtilsService;
exports.ServicesModule = ServicesModule;
exports.CommunicatorService = CommunicatorService;
exports.LoggerService = LoggerService;
exports.StorageService = StorageService;
exports.NumberFormattingPipe = NumberFormattingPipe;
exports.ManifestService = ManifestService;
exports.SignalRWrapperService = SignalRWrapperService;
exports.Constants = Constants;
exports.ConnectModule = ConnectModule;
exports.SyncComponent = SyncComponent;
exports.HttpWrapperService = HttpWrapperService;
exports.ConnectThrottlerService = ConnectThrottlerService;
exports.ConnectService = ConnectService;
exports.JsCalcConnectorService = JsCalcConnectorService;
exports.SyncService = SyncService;
exports.SyncStatusService = SyncStatusService;
exports.TextEngineModule = TextEngineModule;
exports.TextOutputComponent = TextOutputComponent;
exports.TextService = TextService;

Object.defineProperty(exports, '__esModule', { value: true });

})));
