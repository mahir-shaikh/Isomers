import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SyncService } from './sync.service'
import { SyncStatusService } from './syncStatus.service'
import { ManifestService } from './manifest.service'
import { Angular2HttpWrapper } from './angular2HttpWrapper'
import { SyncComponent } from './component/sync.component';
import { ConfigService } from "./config.service";
import { Connect } from "./connect";
import ConnectThrottlerService from "./connect-throttler.service";

const ConnectServiceFactory = (httpWrapper: Angular2HttpWrapper) => {
    return new Connect(httpWrapper);
};

@NgModule({
    imports: [CommonModule],
    declarations: [SyncComponent],
    exports: [SyncComponent],
    providers: [
        SyncService,
        SyncStatusService,
        ManifestService,
        Angular2HttpWrapper,
        ConnectThrottlerService,
        ConfigService,
        {provide: Connect, useFactory: ConnectServiceFactory, deps:[Angular2HttpWrapper]}
    ],
})

export class ConnectModule { }



export { SyncComponent } from './component/sync.component';
