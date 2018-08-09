import { Injectable, EventEmitter } from '@angular/core';
import { IStorage } from './istorage';

const STORAGE_PREFIX = process.env.APP_STORAGE_PREFIX;

@Injectable()
export class LocalStorageService implements IStorage {
    private storage = window.localStorage;

    setValue(key:string, value:string): Promise<any> {
        // todo 
        let storageKey = STORAGE_PREFIX + "_" + key;
        this.storage[storageKey] = value; // set value in local storage
        return Promise.resolve();
    }

    getValue(key:string): Promise<string> {
        let storageKey = STORAGE_PREFIX + "_" + key;
        return (this.storage[storageKey]) ? Promise.resolve(this.storage[storageKey]) : Promise.resolve(null);
    }

    clear(key:string, destroy:boolean = false): Promise<any> {
        return new Promise((resolve, reject) => {
            let storageKey = STORAGE_PREFIX + "_" + key;
            // if key is passed - destroy is never used!!
            if (key) {
                delete this.storage[storageKey];
            }
            else if (!!destroy) {
                this.storage.clear();
            }
            resolve();
        });
    }
}
