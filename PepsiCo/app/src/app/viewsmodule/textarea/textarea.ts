import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TextService, CalcService } from '@btsdigital/ngx-isomer-core';

@Component({
    selector: 'textareabox',
    templateUrl: './textarea.html',
    styleUrls: ['./textarea.styl'],
    providers: []
})

export class TextareaComponent implements OnInit {
    private content: string = "";
    private inputRow: number;
    @Input() ref: string = "";
    @Input() textareaRows: number = 4;
    @Input() isReadOnly: boolean = false;
    private subscription: any;
    
    constructor(private textEngineService: TextService, private calcService: CalcService, private router: Router) { };

    ngOnInit() {
        try{
            this.content = this.calcService.getValue(this.ref);
        }catch(e){}
        this.inputRow = this.textareaRows;

        this.subscription = this.calcService.getObservable().subscribe(() => {
            try{
                this.content = this.calcService.getValue(this.ref);
            }catch(e){}
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
