import { Component, Input, OnInit, OnChanges, ElementRef } from '@angular/core';
import { TextEngineService } from '../textengine/textengine.service';

@Component({
    selector: 'text-outlet',
    template: '<span *ngIf="asInnerHtml" [innerHTML]="value"></span><template [ngIf]="!asInnerHtml">{{value}}</template>'
})

export class TextOutlet {
    @Input() key: string = "";
    @Input() yearRef: string;
    @Input() asInnerHtml = false;
    @Input() sceneId:string;
    private value: string;

    constructor(private textEngine: TextEngineService, private el:ElementRef) { };

    ngOnInit() {
        this.value = this.textEngine.getTextForYear(this.key, this.yearRef, this.sceneId) || this.key;
    }

    ngOnChanges(){
        this.value = this.textEngine.getTextForYear(this.key, this.yearRef, this.sceneId) || this.key;
    }

}
