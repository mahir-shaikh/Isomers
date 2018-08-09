import { Component, Input, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { CalcService } from '../calc.service';
import { NumberFormattingPipe } from '../number-formatting.pipe';

@Component({
    selector: 'calc-input',
    templateUrl: './calcinput.html',
    styleUrls: ['./calcinput.styl'],
    providers: [NumberFormattingPipe]
})

export class CalcInput {
    @Input() ref: string = "";
    @Input() format: string = "";
    @Input() scaler: number = 1;
    @Input() yearRef: string;
    @Input() type: string = "number";
    @Input() step: number;
    @Input() min: any;
    @Input() max: any;
    @Input() useRawValue: boolean = false;
    @Input() IsReadOnly : boolean  = false;
    @Input() placeholder: string = "";
    private value: string;
    private tempValue: string;
    private year: string;
    private isDirty: boolean = false;
    private subscription: any;

    constructor(private calcService: CalcService, private numberFormatter: NumberFormattingPipe) { };

    ngOnInit() {
        this.value = this.numberFormatter.transform(this.calcService.getValueForYear(this.ref, this.yearRef, this.useRawValue), this.format);
        this.min = !isNaN(Number(this.min)) ? Number(this.min) : Number(this.calcService.getValueForYear(this.min, this.yearRef, this.useRawValue));
        this.max = !isNaN(Number(this.max)) ? Number(this.max) : Number(this.calcService.getValueForYear(this.max, this.yearRef, this.useRawValue));
        this.subscription = this.calcService.getObservable().subscribe(() => {
            this.updateValue();
        });
    }

    updateValue(){
        this.min = !isNaN(Number(this.min)) ? Number(this.min) : Number(this.calcService.getValueForYear(this.min, this.yearRef, this.useRawValue));
        this.max = !isNaN(Number(this.max)) ? Number(this.max) : Number(this.calcService.getValueForYear(this.max, this.yearRef, this.useRawValue));
        let valueFromModel = this.calcService.getValueForYear(this.ref, this.yearRef, this.useRawValue),
            self = this;
        this.value = valueFromModel;
    }

    saveDataToModel() {
        // update value to update view
        if (this.tempValue === undefined) {
            return;
        }
        this.value = this.numberFormatter.transform(this.tempValue, this.format, this.scaler);

        if(Number(this.tempValue) < this.min){
            this.tempValue = this.min;
        }else if(Number(this.tempValue) > this.max){
            this.tempValue = this.max;
        }
        
        // update calc model with parsed value
        let value: string;
        if (!this.format) {
            value = this.value;
        }
        else {
            value = this.numberFormatter.parse(this.numberFormatter.transform(this.tempValue, this.format, this.scaler));
        }
        if (this.isDirty) {
            this.calcService.setValueForYear(this.ref, value, this.yearRef);
        }
        this.isDirty = false;
    }

    onModelChange($event) {
        if($event == ""){
            return;
        }
        if (this.value !== $event) {
            this.isDirty = true;
        }
        this.tempValue = $event;
    }

    ngOnChanges(){
        this.updateValue();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}