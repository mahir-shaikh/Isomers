import { Injectable } from '@angular/core';
import { Constants } from '../../../config/constants';
import { LoggerService } from '../logger/logger.service';
import { HttpWrapperService } from '../../connect/httpwrapper/http-wrapper.service';
import * as Collections from 'typescript-collections';
// import Collections = require('typescript-collections');

/**
 * Storage modes available to application. Can be either MODES.LOCAL | MODES.PUSE | MODES.MIXED
 *
 */
const MODES = Constants.STORAGE_MODES;

/**
 * Storage service is used to store data to localStorage and / or Pulse storage based on the mode set
 *
 */
@Injectable()
export class StorageService {

  /**
   * Storage mode for the service.
   *
   * This can be either Constants.STORAGE_MODES.LOCAL | Constants.STORAGE_MODES.PULSE | Constants.STORAGE_MODES.MIXED
   */
  private mode: string = MODES.LOCAL;

  /**
   * Model state dictionary for the service.
   *
   */
  private _state: Collections.Dictionary<string, string> = new Collections.Dictionary<string, string>();


  /**
   * Constructor for the service
   *
   * @param {LoggerService} logger Instance of logger service
   *
   * @param {HttpWrapperService} httpWrapper Instance of httpWrapperService for data transmission to pulse
   *
   */
  constructor(private logger: LoggerService, private httpWrapper: HttpWrapperService) { }

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
  getValue(key: string, forceFromPersistentStorage: boolean = false): Promise<string|JSON>|null {
    // return null;
    const value: string = this._state.getValue(key);
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
  }

  /**
   * Set value for key to storage.
   *
   * @param {string} key Key for which data needs to be saved against in data store
   *
   * @param {value} value Value which needs to be saved in the data store
   *
   * @return {Promise<any>} Returns promise that is resolved when save operation is complete
   */
  setValue(key: string, value: string): Promise<any> {
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
  }

  /**
   * Clear data for given key from data store
   *
   * @param {string} key Key for which data needs to be cleared
   *
   * @return {Promise<any>} Returns promise that gets resolved when operation is completed
   */
  clear(key: string): Promise<any> {
    this.updateState(key, null, true);
    switch (this.mode) {
      case MODES.PULSE:
        return this.clearKeyOnPulse(key);
      case MODES.LOCAL:
        return this.clearKeyOnLocal(key);
      case MODES.MIXED:
        return Promise.all([this.clearKeyOnPulse(key), this.clearKeyOnLocal(key)]);
    }
  }

  /**
   * Clear data store completely. This will __destroy__ and re-create the data store.
   *
   * @return {Promise<any>} Returns promise which is resolved when data-store is cleared
   *
   */
  clearAll(): Promise<any> {
    this._state = new Collections.Dictionary<string, string>();
    switch (this.mode) {
      case MODES.PULSE:
        return this.clearAllOnPulse();
      case MODES.LOCAL:
        return this.clearAllOnLocal();
      case MODES.MIXED:
        return Promise.all([this.clearAllOnPulse(), this.clearAllOnLocal()]);
    }
  }

  /**
   * Force sync local data store to persistent storage
   *
   * @return {Promise<any>} Returns promise that is resolved once data-store is synced to persistent storage
   */
  forceSync(): Promise<any> {
    const promises: Array<Promise<any>> = [];
    return new Promise<any>((resolve, reject) => {
      this._state.forEach((key, value) => {
        promises.push(this.setValue(key, value));
      });

      Promise.all(promises)
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Set the mode for storage service
   *
   * @param {string} mode Mode for the storage service
   *
   */
  setMode(mode: string) {
    this.mode = mode;
  }

  /**
   * Get the mode for storage service
   *
   * @return {string} Returns storage mode for the service
   */
  getMode(): string {
    return this.mode;
  }

  /**
  * Fetch the value for key from pulse storage.
  *
  * @param {string} key Key for which data is to be retrieved
  *
  * @return {Promise<any>} Returns promise which when resolves provides the value from data store.
  */
  private getValueFromPulse(key: string): Promise<JSON> {
    const data: string = 'key=' + key;

    return new Promise((resolve, reject) => {
      this.httpWrapper
        .getJson(Constants.PULSE_API.CALCBINDER.GET_VALUE, data)
        .then(response => {
          let jsonData = null;
          try {
            // try and convert the response to json
            jsonData = (response.json()) ? response.json() : null;
          } catch (err) {
            // error converting response as a valid json
            // reject(err);
          }
          resolve(jsonData);
        })
        .catch(err => {
          // this.logger.log('Error fetching value from Pulse', err);
          reject(err);
        });
    });
  }

  /**
   * Set value for key to pulse storage.
   *
   * @param {string} key Key for which data needs to be saved against in data store
   *
   * @param {value} value Value which needs to be saved in the data store
   *
   * @return {Promise<any>} Returns promise that is resolved when save operation is complete
   */
  private setValueToPulse(key: string, value: string): Promise<any> {
    const data = {
      key: key,
      value: value.toString()
    };

    return new Promise((resolve, reject) => {
      this.httpWrapper
        .postJson(Constants.PULSE_API.CALCBINDER.SET_VALUE, data)
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          // this.logger.log('Error setting value to Pulse', err);
          reject(err);
        });
    });
  }

  /**
  * Fetch the value for key from local storage.
  *
  * @param {string} key Key for which data is to be retrieved
  *
  * @return {Promise<any>} Returns promise which when resolves provides the value from data store.
  */
  private getValueFromLocal(key: string): Promise<any> {
    return Promise.resolve(window.localStorage.getItem(key));
  }

  /**
   * Set value for key to local storage.
   *
   * @param {string} key Key for which data needs to be saved against in data store
   *
   * @param {value} value Value which needs to be saved in the data store
   *
   * @return {Promise<any>} Returns promise that is resolved when save operation is complete
   */
  private setValueToLocal(key: string, value: string): Promise<any> {
    try {
      window.localStorage.setItem(key, value);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Clear data for given key from pulse storage
   *
   * @param {string} key Key for which data needs to be cleared
   *
   * @return {Promise<any>} Returns promise that gets resolved when operation is completed
   */
  private clearKeyOnPulse(key: string): Promise<any> {
    // return Promise.resolve();
    const data = {
      key: key
    };

    return this.httpWrapper.postJson(Constants.PULSE_API.CALCBINDER.CLEAR_KEY, data);
  }

  /**
   * Clear data on pulse storage completely.
   *
   * @return {Promise<any>} Returns promise which is resolved when pulse storage is cleared
   *
   */
  private clearAllOnPulse(): Promise<any> {
    // return Promise.resolve();
    return this.httpWrapper.postJson(Constants.PULSE_API.CALCBINDER.CLEAR_CACHE, {});
  }

  /**
   * Clear data for given key from localStorage
   *
   * @param {string} key Key for which data needs to be cleared
   *
   * @return {Promise<any>} Returns promise that gets resolved when operation is completed
   */
  private clearKeyOnLocal(key: string): Promise<any> {
    window.localStorage.removeItem(key);
    return Promise.resolve();
  }

  /**
   * Clear data on local storage completely.
   *
   * @return {Promise<any>} Returns promise which is resolved when local storage is cleared
   *
   */
  private clearAllOnLocal(): Promise<any> {
    window.localStorage.clear();
    return Promise.resolve();
  }

  /**
   * Updates the state of local data-store for quick retrieval of data
   *
   * @param {string} key Key for which state needs to be updated
   *
   * @param {string} value Value which needs to be set to data store
   *
   * @param {Boolean} removeKey Whether the key should be removed from data-store. Defaults to __false__.
   */
  private updateState(key: string, value: string, removeKey: Boolean = false) {
    if (removeKey) {
      this._state.remove(key);
    } else {
      this._state.setValue(key, value);
    }
  }

}
