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
    @Input() yearRef:string ="";
    private subscription: any;
    @Input() isReadOnly: boolean = false;
    private placeholder:string = "";
    
    constructor(private textEngineService: TextEngineService, private calcService: CalcService, private router: Router) { };

    ngOnInit() {
        this.placeholder = this.textEngineService.getText("EnterFeedbackHere");
        if(this.isReadOnly){
            this.placeholder = "";
        }
        this.content = this.calcService.getValueForYear(this.ref, this.yearRef);
        this.inputRow = this.textareaRows;

        // this.subscription = this.calcService.getObservable().subscribe(() => {
            this.content = this.calcService.getValueForYear(this.ref, this.yearRef);
        // });
    }

    onBlur($event) {
        // this.inputText = $event.srcElement.value;
        this.calcService.setValueForYear(this.ref, this.content, this.yearRef);
    }

    ngOnDestroy() {
        // this.subscription.unsubscribe();
    }
}
