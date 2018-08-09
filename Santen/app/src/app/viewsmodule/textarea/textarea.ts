import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CalcService } from '../../calcmodule';
import { TextEngineService } from '../../textengine/textengine.service';
import { Router } from '@angular/router';

@Component({
    selector: 'textareabox',
    templateUrl: './textarea.html',
    styleUrls: ['./textarea.css'],
    providers: []
})

export class TextareaComponent implements OnInit {
    private content: string = "";
    private inputRow: number;
    @Input() ref: string = "";
    @Input() textareaRows: number = 4;
    private subscription: any;
    
    constructor(private textEngineService: TextEngineService, private calcService: CalcService, private router: Router) { };

    ngOnInit() {
        this.content = this.calcService.getValue(this.ref);
        this.inputRow = this.textareaRows;

        this.subscription = this.calcService.getObservable().subscribe(() => {
            this.content = this.calcService.getValue(this.ref);
        });
    }

    onBlur($event) {
        // this.inputText = $event.srcElement.value;
        this.calcService.setValue(this.ref, this.content);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
