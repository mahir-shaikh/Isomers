import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { CommunicatorService } from '../services/communicator/communicator.service';
import { LoggerService } from '../services/logger/logger.service';
import { StorageService } from '../services/storage/storage.service';
import { Constants } from '../../config/constants';
import * as jsCalc from '@btsdigital/jscalc/dist/jsCalc.min';
import 'rxjs/add/operator/auditTime';

/**
 * Delay for emitting change event
 *
 */
const EMIT_CHANGE_DELAY = Constants.CALC_SERVICE.EMIT_CHANGE_DELAY;

/**
 * Delay for saving data to storage
 *
 */
const SAVE_STATE_TO_STORAGE_DELAY = Constants.CALC_SERVICE.SAVE_STATE_TO_STORAGE_DELAY;

/**
 * Key for calc complete event trigger
 *
 */
const CALC_COMPLETE = Constants.CALC_SERVICE.CALC_COMPLETE;

/**
 * Key for model state saved in storage
 *
 */
const MODEL_STATE = Constants.CALC_SERVICE.MODEL_STATE;

/**
 * CalcService is responsible for building the model instace using jsCalc and setting / fetching data to it.
 *
 */
@Injectable()
export class CalcService {
  /**
   * jsCalc api instance
   */
  private api: jsCalc;
  /**
   * CalculationComplete subscription
   */
  private calculationCompleteEmitter: Subscription;
  /**
   * SaveModelState subscription
   */
  private saveStateEmitter: Subscription;
  /**
   * ModelLoading promise
   */
  private modelLoadingPromise: Promise<CalcService>;
  /**
   * jsCalc.CalcOptions object to initialize jsCalc api
   */
  private buildOptions: jsCalc.CalcOptions;

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
  constructor(private communicator: CommunicatorService, private storageService: StorageService, private logger: LoggerService) { }

  /**
   * Function to check whether calcApi is ready for operations
   *
   * @return {Boolean}
   */
  isApiReady(): Boolean {
    return (this.api) ? true : false;
  }

  /**
   * GetApi function to initialize and get instance of Api
   *
   * @param {jsCalc.CalcOptions} options Options to initialize calcApi
   *
   * @return Promise<any>
   */
  getApi(options?: jsCalc.CalcOptions): Promise<CalcService | any> {
    if (this.api) {
      return Promise.resolve(this);
    } else if (this.modelLoadingPromise === undefined) {
      return this.modelLoadingPromise = this.initialize(options);
    }
    return this.modelLoadingPromise;
  }

  /**
   * Initialize model using jsCalc api. We also initialize subscribers to trigger model load / update events.
   *
   * @param {jsCalc.CalcOptions} options Options to initialize calcApi
   *
   * @return Promise<any>
   */
  private initialize(options?: jsCalc.CalcOptions): Promise<CalcService | any> {
    // setup the calculation complete Observer that emits
    // when a calculation chain is completed in the model
    // we add a delay of EMIT_CHANGE_DELAY so as to trigger the event
    // at the end of the delay and not flood any UI element to re-render too frequently
    this.calculationCompleteEmitter = this.communicator
      .getEmitter(CALC_COMPLETE)
      .auditTime(EMIT_CHANGE_DELAY)
      .subscribe(() => {
        this.triggerModelComplete();
      });

    this.saveStateEmitter = this.communicator
      .getEmitter(CALC_COMPLETE)
      .auditTime(SAVE_STATE_TO_STORAGE_DELAY)
      .subscribe(() => {
        // this.logger.log('save state emitter triggered');
        this.saveStateToStorage();
      });
    this.buildOptions = options;
    return this.getStateFromStorage()
      .then((modelState) => {
        return this.loadModel(modelState);
      });
  }

  /**
   * Triggers model load complete event
   *
   */
  private triggerModelComplete() {
      this.communicator.trigger(Constants.MODEL_CALC_COMPLETE);
  }

  /**
   * Load calc model using jsCalc api
   *
   * @param {string|JSON} [modelData] Optional data to be appended to the model instance
   *
   * @return {Promise<any>}
   */
  private loadModel(modelData?: string|JSON): Promise<CalcService | any> {
    return new Promise((resolve, reject) => {
      this.buildModel()
        .then((api) => {
          this.api = api;
          this.appendDataToModel(modelData)
            .then(() => {
              this.communicator.trigger(Constants.MODEL_LOADED, true);
              this.saveStateToStorage()
                .then(resolve)
                .catch((err) => {
                  this.logger.log('Saving model state failed ', err);
                  reject(err); // return model api
                });
            })
            .catch((err) => {
              this.logger.log('Failed - Could not append data to model', err);
              reject(err);
            });
        })
        .catch((err) => {
          this.logger.log('Failed to build the model!', err);
          reject(err);
        });
    });
  }

  /**
   * Function to build/rebuild calc model using jsCalc
   *
   */
  buildModel(): Promise<any> {
    const options: jsCalc.CalcOptions = this.buildOptions || { courseActions: null };

    return new Promise((resolve, reject) => {
      try {
        options.loadCallback = function() {
            resolve(this);
        };
        options.buildProgressCallback = (progressOb) => {
            this.onProgress(progressOb);
        };
        // tslint:disable-next-line
        new jsCalc(options);
      } catch (err) {
          this.logger.log('Error building model', err);
          reject(err);
      }
    });
  }

  /**
   * On progress trigger to transmit progress to any subscribers
   *
   */
  private onProgress(progressOb: any) {
      const progress: Number = progressOb.numComplete / progressOb.numTotal;
      // this.logger.log(progress);
      this.communicator.trigger(Constants.MODEL_LOAD_PROGRESS, progress);
  }

  /**
   * Get value from calcModel
   *
   * @param {string} refName Range ref for which value needs to be returned
   *
   * @param {Boolean} rawValue Fetch raw value instead of formatted value from model
   *
   * @return {string}
   */
  getValue(refName: string, rawValue?: Boolean): string {
    if (rawValue) {
      return this.api.getRawValue(refName);
    }
    return this.api.getValue(refName);
  }

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
  getValueForYear(refName: string, yearRef?: string, rawValue?: Boolean): string {
    if (yearRef) {
      const year = this.getValue(yearRef, rawValue);
      if (typeof year !== 'undefined' && year !== '') {
        refName += '_R' + year;
      }
    }
    return this.getValue(refName, rawValue);
  }


  /**
   * Set value to calcModel
   *
   * @param {string} refName Range ref for which value needs to be returned
   *
   * @param {any} value Value that needs to be set to model
   *
   * @return {Promise<any>}
   */
  setValue(refName: string, value: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // added try catch so setValue doesnt throw jsCalc errors and now this will resolve to a rejected promise if failing
      try {
        this.api.setValue(refName, value)
          .then((emitEventOnComplete: Boolean = true) => {
            this.communicator.trigger(CALC_COMPLETE);
            this.saveStateToStorage();
            resolve();
          }, reject);
      } catch (e) {
        reject(e);
      }
    });
  }


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
  setValueForYear(refName: string, value: any, yearRef: string): Promise<any> {
    if (yearRef) {
      const year = this.getValue(yearRef);
      if (typeof year !== 'undefined') {
        refName += '_R' + year;
      }
    }

    return this.setValue(refName, value);
  }

  /**
   * Get the emitter for calc-updates
   * @deprecated
   *
   * @return {Observable<any>}
   */
  getObservable(): Observable<any> {
    return this.communicator.getEmitter(Constants.MODEL_CALC_COMPLETE);
  }

  /**
   * Append data to model state
   *
   * @param {string|JSON} stateOb Stringified json / json data that needs to be appended to model
   *
   * @return {Promise<any>}
   */
  appendDataToModel(stateOb?: string | JSON): Promise<any> {
    let jsonState: JSON;
    const arrPromises: Array<Promise<any>> = [];

    // if stateobject is null / undefined nothing to append to model
    if (!stateOb) {
      return Promise.resolve();
    }
    // if stateobject is a string - try and parse as json object and append to model
    if (typeof stateOb === 'string') {
      try {
        jsonState = JSON.parse(stateOb);
      } catch (e) {
        return Promise.reject(e);
      }
    }
    // if stateobject is an object, use it as is and append to model
    if (typeof stateOb === 'object') {
      jsonState = stateOb;
    }

    return new Promise((resolve, reject) => {
      Object.keys(jsonState)
        .forEach((key: string) => {
          arrPromises.push(this.setValue(key, jsonState[key]));
        });
      Promise.all(arrPromises)
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Load model with an optional model state
   *
   * @param {string|JSON} [modelState] optional model state to instantiate model with
   *
   * @return {Promise<any>}
   */
  setModelState(modelState?: string|JSON): Promise<any> {
    return this.loadModel(modelState);
  }

  /**
   * Force recalculate model
   *
   * @return {Promise<any>}
   */
  forceRecalculate(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.getBook().recalculate();
      this.api.addCalculationCallback(() => {
        this.communicator.trigger(CALC_COMPLETE);
        resolve();
      });
    });
  }

  /**
   * Save model state to data-store using {@link StorageService}
   *
   * @return {Promise<any>}
   */
  saveStateToStorage(): Promise<any> {
    return this.storageService.setValue(MODEL_STATE, this.getModelState());
  }

  /**
   * Get current calc model state as stringified json
   *
   * @return {string}
   */
  getModelState(): string {
    return this.api.getJSONState();
  }

  /**
   * Fetch model state from data-store using {@link StorageService}
   *
   */
  getStateFromStorage(): Promise<any> {
    return this.storageService.getValue(MODEL_STATE);
  }

  /**
   * Export data from calc model as dictionary object
   *
   * @return {any}
   */
  exportData(exp?: string, flags?: string): any {
    flags = (!exp) ? 'i' : flags;
    exp = (exp) ? exp : '^tl(in|out)put.+$';

    const pattern = new RegExp(exp, flags),
      rangeNames = this.api.getNames(pattern),
      out = {};

    rangeNames.forEach((name) => {
      try {
        const val = this.api.getRawValue(name);
        out[name] = val;
      } catch (e) {
        // try next ref
      }
    });
    return out;
  }

  /**
   * Destroy function to unsubscribe existing emitters
   *
   */
  destroy() {
    this.saveStateEmitter.unsubscribe();
    this.calculationCompleteEmitter.unsubscribe();
  }
}
