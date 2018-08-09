import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SyncService } from '../connect/sync.service'
import { SyncStatusService } from '../connect/syncStatus.service'
import { ManifestService } from '../connect/manifest.service'
import { Angular2HttpWrapper } from '../connect/angular2HttpWrapper'
import { SyncComponent } from './component/sync.component';

@NgModule({
    imports: [CommonModule],
    declarations: [SyncComponent],
    exports: [SyncComponent],
    providers: [SyncService, SyncStatusService, ManifestService, Angular2HttpWrapper],
})

export class ConnectModule { }



export { SyncComponent } from './component/sync.component';
