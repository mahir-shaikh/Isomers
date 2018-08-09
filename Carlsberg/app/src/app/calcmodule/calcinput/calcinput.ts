import { Component, Input, OnInit, OnDestroy, OnChanges, EventEmitter } from '@angular/core';
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
    @Input() placeholder: string = "";
    @Input() format: string = "";
    @Input() scaler: number = 1;
    @Input() yearRef: string;
    @Input() type: string = "number";
    @Input() step: number;
    @Input() min: any;
    @Input() max: any;
    @Input() useRawValue: boolean = false;
    @Input() IsReadOnly: boolean = false;
    private placeholderValue: string;
    private value: string;
    private tempValue: string;
    private year: string;
    private isDirty: boolean = false;
    private subscription: EventEmitter < any > ;

    constructor(private calcService: CalcService, private numberFormatter: NumberFormattingPipe) {};

    ngOnInit() {
        this.value = this.numberFormatter.transform(this.calcService.getValueForYear(this.ref, this.yearRef, this.useRawValue), this.format);
        this.placeholderValue = this.placeholder;
        if(this.min){
            this.min = !isNaN(Number(this.min)) ? Number(this.min) : Number(this.calcService.getValueForYear(this.min, this.yearRef, this.useRawValue));
        }
        if(this.max){
            this.max = !isNaN(Number(this.max)) ? Number(this.max) : Number(this.calcService.getValueForYear(this.max, this.yearRef, this.useRawValue));
        }
        this.subscription = this.calcService.getObservable().subscribe(() => {
            this.updateValue();
        });
    }

    updateValue() {
        if(this.min){
            this.min = !isNaN(Number(this.min)) ? Number(this.min) : Number(this.calcService.getValueForYear(this.min, this.yearRef, this.useRawValue));
        }
        if(this.max){
            this.max = !isNaN(Number(this.max)) ? Number(this.max) : Number(this.calcService.getValueForYear(this.max, this.yearRef, this.useRawValue));
        }
        let valueFromModel = this.calcService.getValueForYear(this.ref, this.yearRef, this.useRawValue),
            self = this;
        this.placeholderValue = this.placeholder;
        this.value = valueFromModel;
    }

    saveDataToModel() {
        // update value to update view
        if (this.tempValue === undefined) {
            return;
        }
        this.value = this.numberFormatter.transform(this.tempValue, this.format, this.scaler);

        if (this.min && Number(this.tempValue) <= this.min) {
            this.tempValue = this.min;
        } else if (this.max && Number(this.tempValue) > this.max) {
            this.tempValue = this.max;
        }

        // update calc model with parsed value
        let value: string;
        if (!this.format) {
            value = this.value;
        } else {
            value = this.numberFormatter.parse(this.numberFormatter.transform(this.tempValue, this.format, this.scaler));
        }
        this.value = value;
        if (this.isDirty) {
            this.calcService.setValueForYear(this.ref, value, this.yearRef);
        }
        this.isDirty = false;
    }

    onModelChange($event) {
        if (this.value !== $event) {
            this.isDirty = true;
        }
        this.tempValue = $event;
    }

    ngOnChanges() {
        this.updateValue();
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();

        }
    }
    getSubscription() {
        return this.subscription;
    }

}
