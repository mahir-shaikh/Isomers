import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { TextEngineService } from './textengine.service';
import { TextOutlet } from './textoutlet';
import { TextEngineServiceStub } from './textenginestub.service';

@NgModule({
    imports: [CommonModule, HttpModule],
    declarations: [
        TextOutlet
    ],
    exports: [
        TextOutlet
    ],
    providers: [TextEngineService, TextEngineServiceStub]
})
export class TextEngineModule { }