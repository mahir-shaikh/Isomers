import { Component, ViewContainerRef, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { SyncService } from '../connect/sync.service';
import { APP_READY, DataStore } from '../utils';
import '../../../assets/css/styles.styl';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.styl']
})
export class AppComponent implements OnInit, OnDestroy {
    private isAppReady: boolean = false;
    private _dataStoreObservable: EventEmitter<any>;
    // syncService commented out as we are not using dataSync with pulse only model state is being synced.
    constructor(private dataStore: DataStore, private viewContainerRef: ViewContainerRef, private syncService: SyncService) { }

    ngOnInit() {
        // let ng2-bootstrap know we are using bootstrap v4
        window['__theme'] = 'bs4';

        this._dataStoreObservable = this.dataStore.getObservableFor(APP_READY).subscribe(value => this.isAppReady = value);

        this.isAppReady = this.dataStore.getData(APP_READY);
    }

    ngOnDestroy() {
        this._dataStoreObservable.unsubscribe();
    }
}
