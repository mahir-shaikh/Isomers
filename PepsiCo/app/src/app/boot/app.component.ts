import { Component, ViewContainerRef, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { BootstrapService } from '../shared/bootstrap.service';
import { APP_READY, DataStore } from '../utils';

import '../../assets/css/styles.styl';
// var  model = require('../model/index.js');

@Component({
    selector: 'isma-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.styl']
})
export class AppComponent implements OnInit, OnDestroy {
    isAppReady: boolean = false;
    private _dataStoreObservable: EventEmitter<any>;
    // private model: any = model;

    // syncService commented out as we are not using dataSync with pulse only model state is being synced.
    constructor(private dataStore: DataStore, private bootstarpService: BootstrapService) { }

    ngOnInit() {
        // let ng2-bootstrap know we are using bootstrap v4
        window['__theme'] = 'bs4';

        this._dataStoreObservable = this.dataStore.getObservableFor(APP_READY).subscribe(value => this.isAppReady = value);
    }

    ngOnDestroy() {
        if (this._dataStoreObservable) {
            this._dataStoreObservable.unsubscribe();
        }
    }
}
