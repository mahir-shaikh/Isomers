import { Component, Input, OnInit, OnDestroy, OnChanges, ChangeDetectorRef } from '@angular/core';
// import { CalcService } from '../calc.service';
// import { NumberFormattingPipe } from '../number-formatting.pipe';
import { CalcInputComponent as IsomerCalcInputComponent, CalcService, CommunicatorService, NumberFormattingPipe } from '@btsdigital/ngx-isomer-core';

@Component({
    selector: 'isma-calc-input',
    templateUrl: './calcinput.html',
    styleUrls: ['./calcinput.styl'],
    providers: [NumberFormattingPipe]
})

export class CalcInputComponent extends IsomerCalcInputComponent implements OnInit, OnChanges, OnDestroy {
    @Input() ref: string = '';
    @Input() format: string = '';
    @Input() scaler: number = 1;
    @Input() yearRef: string;
    @Input() type: string = 'number';
    @Input() step: number;
    @Input() min: any;
    @Input() max: any;
    @Input() useRawValue: boolean = false;
    @Input() IsReadOnly: boolean = false;

    value: string;
    private tempValue: string;
    private year: string;

    // local declarations which are private in CalcInputComponent of IsomerCoreModule
    private isDirtyA: boolean = false;
    private subscriptionA: any;
    private calcServiceA: CalcService;
    private numberFormatterA: NumberFormattingPipe;

    constructor(calcService: CalcService, numberFormatter: NumberFormattingPipe, communicator: CommunicatorService, cdr: ChangeDetectorRef) {
        super(calcService, communicator, numberFormatter, cdr);
        this.calcServiceA = calcService;
        this.numberFormatterA = numberFormatter;
    }

    ngOnInit() {
        this.value = this.numberFormatterA.transform(this.calcServiceA.getValueForYear(this.ref, this.yearRef, this.useRawValue), this.format) + '';
        this.min = !isNaN(Number(this.min)) ? Number(this.min) : Number(this.calcServiceA.getValueForYear(this.min, this.yearRef, this.useRawValue));
        this.max = !isNaN(Number(this.max)) ? Number(this.max) : Number(this.calcServiceA.getValueForYear(this.max, this.yearRef, this.useRawValue));
        this.subscriptionA = this.calcServiceA.getObservable().subscribe(() => {
            this.updateValue();
        });
    }

    updateValue() {
        this.min = !isNaN(Number(this.min)) ? Number(this.min) : Number(this.calcServiceA.getValueForYear(this.min, this.yearRef, this.useRawValue));
        this.max = !isNaN(Number(this.max)) ? Number(this.max) : Number(this.calcServiceA.getValueForYear(this.max, this.yearRef, this.useRawValue));
        const valueFromModel = this.numberFormatterA.transform(this.calcServiceA.getValueForYear(this.ref, this.yearRef, this.useRawValue), this.format),
            self = this;
        this.value = valueFromModel + '';
    }

    saveDataToModel() {
        // update value to update view
        if (this.tempValue === undefined) {
            return;
        }
        this.value = this.numberFormatterA.transform(this.tempValue, this.format, this.scaler) + '';

        if (Number(this.tempValue) < this.min) {
            this.tempValue = this.min;
        } else if (Number(this.tempValue) > this.max) {
            this.tempValue = this.max;
        }

        // update calc model with parsed value
        let value: string;
        if (!this.format) {
            value = this.value;
        } else {
            value = this.numberFormatterA.parse(this.numberFormatterA.transform(this.tempValue, this.format, this.scaler)) + '';
        }

        if (this.isDirtyA) {
            this.calcServiceA.setValueForYear(this.ref, value, this.yearRef);
        }
        this.isDirtyA = false;
    }

    onModelChange($event) {
        if (this.value !== $event) {
            this.isDirtyA = true;
        }
        this.tempValue = $event;
    }

    ngOnChanges() {
        this.updateValue();
    }

    ngOnDestroy() {
        this.subscriptionA.unsubscribe();
    }

}
