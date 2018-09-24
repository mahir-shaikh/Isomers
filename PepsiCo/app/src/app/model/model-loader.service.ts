import { Injectable } from '@angular/core';
import { Response, Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

// declare var require: any;
declare var nw: any;

@Injectable()
export class ModelLoaderService {
    constructor(private http: Http) { }

    getModel(): any {
        return new Promise((resolve, reject) => {
            const _model = require('./index');

            if (typeof (nw) !== 'undefined') {
                const fileName = _model.modelName + '.js';
                const path = require('path');
                const fs = nw.require('fs');
                const filePath = path.join(nw.App.dataPath, fileName);

                if (fs.existsSync(filePath)) {
                    let jsData: any = fs.readFileSync(filePath, 'utf8');

                    if (jsData) {
                        const jsDataX = jsData.replace('define(', '');

                        jsData = jsDataX.substr(0, jsDataX.length - 2);
                        _model.model = JSON.parse(jsData);
                        _model.log = 'Data is fetching from external model.';
                        resolve(_model);
                    } else {
                        _model.log = 'External Model File is not available, so data is fetching from Build.';
                        resolve(_model);
                    }
                } else {
                    _model.log = 'External Model File is not available, so data is fetching from Build.';
                    resolve(_model);
                }
            } else {
                this.getModelData(_model.modelName).then((modResponse) => {
                    if (modResponse) {
                        _model.model = modResponse;
                        _model.log = 'Data is fetching from API.';
                        resolve(_model);
                    } else {
                        _model.log = 'Data is fetching from Build.';
                        resolve(_model);
                    }
                });
            }
        });
    }

    // Get API model data
    getModelData(modelName: string) {
        return new Promise((resolve, reject) => {
            this.sendModelRequest(modelName).subscribe(
                success => {
                    const blob = success._body;
                    let blob2 = blob.replace('define(', '');

                    blob2 = blob2.substr(0, blob2.length - 2);
                    resolve(blob ? JSON.parse(blob2) : null);
                },
                error => {
                    console.log('Error in loading API.');
                    resolve(false);
                }
            );
        });
    }

    sendModelRequest(modelName: string) {
        const url = environment.hostname + '/GetModel';
        const body = { modelName: modelName, eventTitle: environment.eventTitle };
        return this.postRequest(url, body);
    }

    postRequest(url: string, body: any): Observable<any> {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        const options = new RequestOptions({ headers: headers });
        const params = JSON.stringify(body);

        return this.http.post(url, params, options)
            .map((data) => data)
            .catch((error: any) => error);
    }
}
