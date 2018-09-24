import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SyncService } from './sync/sync.service';
import { SyncStatusService } from './sync/sync-status.service';
import { HttpWrapperService } from './httpwrapper/http-wrapper.service';
import { SyncComponent } from './component/sync.component';
import { ConnectService } from './lib/connect.service';
import { ConnectThrottlerService } from './lib/connect-throttler.service';
import { HttpModule } from '@angular/http';

/**
 * Connect module to provide services to be able to sync data to remote pulse server
 *
 */
@NgModule({
  imports: [CommonModule, HttpModule],
  declarations: [SyncComponent],
  exports: [SyncComponent],
  providers: [
    SyncService,
    SyncStatusService,
    HttpWrapperService,
    ConnectThrottlerService,
    ConnectService
  ],
})

export class ConnectModule { }



export { SyncComponent } from './component/sync.component';
