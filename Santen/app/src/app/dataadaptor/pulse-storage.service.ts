import { Injectable } from '@angular/core';
import { IStorage } from './istorage';
import { PulseState } from './pulse-auth-state';
import { Angular2HttpWrapper } from '../connect/angular2HttpWrapper'

@Injectable()
export class PulseStorageService implements IStorage {
    private calcBinderSetValueURL = '/Wizer/CloudFront/SetCacheValue';
    private calcBinderGetValueURL = '/Wizer/CloudFront/GetCacheValue';
    private calcBinderClearKeyURL = '/Wizer/CloudFront/ClearCacheKey';
    private calcBinderClearCacheURL = '/Wizer/CloudFront/ClearCache';

    constructor(private httpWrapper: Angular2HttpWrapper) { }


    getValue(key: string): Promise<string> {
        let data = "key="+ key,
            self = this;

        return new Promise((resolve, reject) => {
            self.httpWrapper
                .getJson(self.calcBinderGetValueURL, data)
                .then(response => {
                    let jsonData = null;
                    try {
                        // try and convert response to json - this fails when response body is empty
                        jsonData = response.json();
                    }
                    catch(e) {
                        // could not convert response to a valid json
                    }
                    resolve(jsonData);
                });
        });
    }

    setValue(key: string, value: string): Promise<any> {
        let data = {
                key: key,
                value: String(value)
            },
            self = this;

        return new Promise((resolve, reject) => {
            self.httpWrapper
                .postJson(self.calcBinderSetValueURL, data)
                .then(response => {
                    resolve(response);
                });
        });
    }

    clear(key: string, destroy: boolean = false): Promise<any> {
        // TODO
        let url = (destroy) ? this.calcBinderClearCacheURL : this.calcBinderClearKeyURL, data;
        if (!key && !destroy) {
            return Promise.reject("Cache Key is missing");
        }
        data = (key) ? { "key" : key } : {};
        return new Promise((resolve, reject) => {
        
        this.httpWrapper
            .postJson(url, data)
            .then(response => {
                resolve(response);
            }, (err) => {
                reject(err);
            });
        });
    }
}
