import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class AppConfig {

    constructor(private http: Http) { }

    public load() {
        return this.http.get('./config' + (environment.production ? '' : '.dev') + '.json');
    }
}
