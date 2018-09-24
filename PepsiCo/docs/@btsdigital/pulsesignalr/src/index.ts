import { NgModule } from '@angular/core';
import { SignalRService, SignalRServiceConfig } from './services/signalr.service';

@NgModule({
    imports: [ ],
    exports: [ ],
    declarations: [ ],
    providers: [
        SignalRService
    ]
})
export class SignalRModule { }
export { SignalRServiceConfig, SignalRService }
