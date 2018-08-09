import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { TextEngineService } from './textengine.service';
import { TextOutlet } from './textoutlet';

@NgModule({
    imports: [CommonModule, HttpModule],
    declarations: [
        TextOutlet
    ],
    exports: [
        TextOutlet
    ],
    providers: [TextEngineService]
})
export class TextEngineModule { }