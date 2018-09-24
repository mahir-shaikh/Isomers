import { Component, OnInit } from '@angular/core';
import { StorageService, Constants } from './isomer';
import { environment } from '../environments/environment';
// import { ManifestService } from './isomer/modules/services/manifest/manifest.service';
// import { SignalRWrapperService } from './isomer/modules/services/signalrwrapper/signalr-wrapper.service';
// import { SyncService } from './isomer/modules/connect/sync/sync.service';


@Component({
  selector: 'ism-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent implements OnInit {
  title = 'ism';

  constructor(private storageService: StorageService,
    // private manifestService: ManifestService,
    // private signalRWrapperService: SignalRWrapperService,
    // private syncService: SyncService
  ) {
    // this.syncService.disablePush();
    // this.syncService.enablePush();
  }

  ngOnInit() {
    // set storage mode
    window['__theme'] = 'bs4';

    this.storageService.setMode(environment.connectToPulse ? Constants.STORAGE_MODES.MIXED : Constants.STORAGE_MODES.LOCAL);
  }
}
