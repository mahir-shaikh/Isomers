import { Injectable, EventEmitter } from '@angular/core';
import { DataAdaptorService } from '../dataadaptor/data-adaptor.service';
import { Dictionary } from './dictionary';
import { Utils } from './utils';

@Injectable()
export class DataStore {
    private dataStore:Dictionary;
    private _emitters: Dictionary = {};
    constructor(private dataAdaptor: DataAdaptorService, private utils: Utils) {
        this.dataStore = {}
    }

    getData(key: string, fromPersistentStorage: boolean = false): any {
        if (fromPersistentStorage) {
            return this.dataAdaptor.getValue(key);
        }
        return (this.dataStore[key]) ? this.dataStore[key] : null;
    }

    setData(key: string, value: any, isPersistent?: boolean): void {
        if (this.dataStore[key] === value) {
            // do nothing if value is the same in datastore
            return;
        }

        if (isPersistent) {
            this.dataAdaptor.setValue(key, value);
        }
        else {
            this.dataStore[key] = value;

        }
        this.triggerChange(key);
    }

    triggerChange(key: string) {
        if (this.utils.hasEmitter(key)) {
            this.utils.getObservable(key).emit(this.dataStore[key]);
        }
    }

    getObservableFor(key: string): EventEmitter<any> {
        return this.utils.getObservable(key);
    }
}