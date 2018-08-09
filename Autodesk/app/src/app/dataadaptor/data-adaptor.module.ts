import { NgModule } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { PulseStorageService } from './pulse-storage.service';
import { DataAdaptorService } from './data-adaptor.service';
import { HttpModule } from '@angular/http';

@NgModule({
    imports: [HttpModule],
    declarations: [],
    exports: [],
    providers: [DataAdaptorService, LocalStorageService, PulseStorageService]
})

export class DataAdaptorModule { }