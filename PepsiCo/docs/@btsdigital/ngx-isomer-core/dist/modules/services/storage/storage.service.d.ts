import { LoggerService } from '../logger/logger.service';
import { HttpWrapperService } from '../../connect/httpwrapper/http-wrapper.service';
/**
 * Storage service is used to store data to localStorage and / or Pulse storage based on the mode set
 *
 */
export declare class StorageService {
    private logger;
    private httpWrapper;
    /**
     * Storage mode for the service.
     *
     * This can be either Constants.STORAGE_MODES.LOCAL | Constants.STORAGE_MODES.PULSE | Constants.STORAGE_MODES.MIXED
     */
    private mode;
    /**
     * Model state dictionary for the service.
     *
     */
    private _state;
    /**
     * Constructor for the service
     *
     * @param {LoggerService} logger Instance of logger service
     *
     * @param {HttpWrapperService} httpWrapper Instance of httpWrapperService for data transmission to pulse
     *
     */
    constructor(logger: LoggerService, httpWrapper: HttpWrapperService);
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
    getValue(key: string, forceFromPersistentStorage?: boolean): Promise<string | JSON> | null;
    /**
     * Set value for key to storage.
     *
     * @param {string} key Key for which data needs to be saved against in data store
     *
     * @param {value} value Value which needs to be saved in the data store
     *
     * @return {Promise<any>} Returns promise that is resolved when save operation is complete
     */
    setValue(key: string, value: string): Promise<any>;
    /**
     * Clear data for given key from data store
     *
     * @param {string} key Key for which data needs to be cleared
     *
     * @return {Promise<any>} Returns promise that gets resolved when operation is completed
     */
    clear(key: string): Promise<any>;
    /**
     * Clear data store completely. This will __destroy__ and re-create the data store.
     *
     * @return {Promise<any>} Returns promise which is resolved when data-store is cleared
     *
     */
    clearAll(): Promise<any>;
    /**
     * Force sync local data store to persistent storage
     *
     * @return {Promise<any>} Returns promise that is resolved once data-store is synced to persistent storage
     */
    forceSync(): Promise<any>;
    /**
     * Set the mode for storage service
     *
     * @param {string} mode Mode for the storage service
     *
     */
    setMode(mode: string): void;
    /**
     * Get the mode for storage service
     *
     * @return {string} Returns storage mode for the service
     */
    getMode(): string;
    /**
    * Fetch the value for key from pulse storage.
    *
    * @param {string} key Key for which data is to be retrieved
    *
    * @return {Promise<any>} Returns promise which when resolves provides the value from data store.
    */
    private getValueFromPulse(key);
    /**
     * Set value for key to pulse storage.
     *
     * @param {string} key Key for which data needs to be saved against in data store
     *
     * @param {value} value Value which needs to be saved in the data store
     *
     * @return {Promise<any>} Returns promise that is resolved when save operation is complete
     */
    private setValueToPulse(key, value);
    /**
    * Fetch the value for key from local storage.
    *
    * @param {string} key Key for which data is to be retrieved
    *
    * @return {Promise<any>} Returns promise which when resolves provides the value from data store.
    */
    private getValueFromLocal(key);
    /**
     * Set value for key to local storage.
     *
     * @param {string} key Key for which data needs to be saved against in data store
     *
     * @param {value} value Value which needs to be saved in the data store
     *
     * @return {Promise<any>} Returns promise that is resolved when save operation is complete
     */
    private setValueToLocal(key, value);
    /**
     * Clear data for given key from pulse storage
     *
     * @param {string} key Key for which data needs to be cleared
     *
     * @return {Promise<any>} Returns promise that gets resolved when operation is completed
     */
    private clearKeyOnPulse(key);
    /**
     * Clear data on pulse storage completely.
     *
     * @return {Promise<any>} Returns promise which is resolved when pulse storage is cleared
     *
     */
    private clearAllOnPulse();
    /**
     * Clear data for given key from localStorage
     *
     * @param {string} key Key for which data needs to be cleared
     *
     * @return {Promise<any>} Returns promise that gets resolved when operation is completed
     */
    private clearKeyOnLocal(key);
    /**
     * Clear data on local storage completely.
     *
     * @return {Promise<any>} Returns promise which is resolved when local storage is cleared
     *
     */
    private clearAllOnLocal();
    /**
     * Updates the state of local data-store for quick retrieval of data
     *
     * @param {string} key Key for which state needs to be updated
     *
     * @param {string} value Value which needs to be set to data store
     *
     * @param {Boolean} removeKey Whether the key should be removed from data-store. Defaults to __false__.
     */
    private updateState(key, value, removeKey?);
}
