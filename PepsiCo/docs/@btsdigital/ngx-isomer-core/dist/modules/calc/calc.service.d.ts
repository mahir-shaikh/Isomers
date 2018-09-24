import { Observable } from 'rxjs/Observable';
import { CommunicatorService } from '../services/communicator/communicator.service';
import { LoggerService } from '../services/logger/logger.service';
import { StorageService } from '../services/storage/storage.service';
import * as jsCalc from '@btsdigital/jscalc/dist/jsCalc.min';
import 'rxjs/add/operator/auditTime';
/**
 * CalcService is responsible for building the model instace using jsCalc and setting / fetching data to it.
 *
 */
export declare class CalcService {
    private communicator;
    private storageService;
    private logger;
    /**
     * jsCalc api instance
     */
    private api;
    /**
     * CalculationComplete subscription
     */
    private calculationCompleteEmitter;
    /**
     * SaveModelState subscription
     */
    private saveStateEmitter;
    /**
     * ModelLoading promise
     */
    private modelLoadingPromise;
    /**
     * jsCalc.CalcOptions object to initialize jsCalc api
     */
    private buildOptions;
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
    constructor(communicator: CommunicatorService, storageService: StorageService, logger: LoggerService);
    /**
     * Function to check whether calcApi is ready for operations
     *
     * @return {Boolean}
     */
    isApiReady(): Boolean;
    /**
     * GetApi function to initialize and get instance of Api
     *
     * @param {jsCalc.CalcOptions} options Options to initialize calcApi
     *
     * @return Promise<any>
     */
    getApi(options?: jsCalc.CalcOptions): Promise<CalcService | any>;
    /**
     * Initialize model using jsCalc api. We also initialize subscribers to trigger model load / update events.
     *
     * @param {jsCalc.CalcOptions} options Options to initialize calcApi
     *
     * @return Promise<any>
     */
    private initialize(options?);
    /**
     * Triggers model load complete event
     *
     */
    private triggerModelComplete();
    /**
     * Load calc model using jsCalc api
     *
     * @param {string|JSON} [modelData] Optional data to be appended to the model instance
     *
     * @return {Promise<any>}
     */
    private loadModel(modelData?);
    /**
     * Function to build/rebuild calc model using jsCalc
     *
     */
    buildModel(): Promise<any>;
    /**
     * On progress trigger to transmit progress to any subscribers
     *
     */
    private onProgress(progressOb);
    /**
     * Get value from calcModel
     *
     * @param {string} refName Range ref for which value needs to be returned
     *
     * @param {Boolean} rawValue Fetch raw value instead of formatted value from model
     *
     * @return {string}
     */
    getValue(refName: string, rawValue?: Boolean): string;
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
    getValueForYear(refName: string, yearRef?: string, rawValue?: Boolean): string;
    /**
     * Set value to calcModel
     *
     * @param {string} refName Range ref for which value needs to be returned
     *
     * @param {any} value Value that needs to be set to model
     *
     * @return {Promise<any>}
     */
    setValue(refName: string, value: any): Promise<any>;
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
    setValueForYear(refName: string, value: any, yearRef: string): Promise<any>;
    /**
     * Get the emitter for calc-updates
     * @deprecated
     *
     * @return {Observable<any>}
     */
    getObservable(): Observable<any>;
    /**
     * Append data to model state
     *
     * @param {string|JSON} stateOb Stringified json / json data that needs to be appended to model
     *
     * @return {Promise<any>}
     */
    appendDataToModel(stateOb?: string | JSON): Promise<any>;
    /**
     * Load model with an optional model state
     *
     * @param {string|JSON} [modelState] optional model state to instantiate model with
     *
     * @return {Promise<any>}
     */
    setModelState(modelState?: string | JSON): Promise<any>;
    /**
     * Force recalculate model
     *
     * @return {Promise<any>}
     */
    forceRecalculate(): Promise<any>;
    /**
     * Save model state to data-store using {@link StorageService}
     *
     * @return {Promise<any>}
     */
    saveStateToStorage(): Promise<any>;
    /**
     * Get current calc model state as stringified json
     *
     * @return {string}
     */
    getModelState(): string;
    /**
     * Fetch model state from data-store using {@link StorageService}
     *
     */
    getStateFromStorage(): Promise<any>;
    /**
     * Export data from calc model as dictionary object
     *
     * @return {any}
     */
    exportData(exp?: string, flags?: string): any;
    /**
     * Destroy function to unsubscribe existing emitters
     *
     */
    destroy(): void;
}
