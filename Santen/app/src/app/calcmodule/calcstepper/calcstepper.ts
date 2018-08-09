import { Component, Input, OnInit, OnDestroy, ElementRef, AfterViewInit } from '@angular/core';
import { CalcService } from '../calc.service';
import { NumberFormattingPipe } from '../number-formatting.pipe';
import { Stepper } from '../../../libs/stepper/stepper';


@Component({
    selector: 'calc-stepper',
    templateUrl: './calcstepper.html',
    styleUrls: ['./calcstepper.css'],
    providers: [NumberFormattingPipe]
})

export class CalcStepper implements OnInit, OnDestroy, AfterViewInit {
    @Input() ref: string = "";
    @Input() format: string = "";
    @Input() inputFormat: string = "";
    @Input() scaler: number = 1;
    @Input() yearRef: string;
    @Input() step: number;
    @Input() min: number;
    @Input() max: number;
    @Input() inRef: string = "";
    @Input() outRef: string = "";
    @Input() inputScaler: number;
    @Input() outputMax: number;
    @Input() outputMin: number;
    private value: string;
    private formattedVal: string;
    private year: string;
    private isDirty: boolean = false;
    private el: HTMLElement
    private observable: any;
    @Input() colorNegative: boolean = false;
    private showNegativeColor: boolean = false;

    constructor(private calcService: CalcService, private numberFormatter: NumberFormattingPipe, private elRef: ElementRef) { };

    ngOnInit() {
        this.el = this.elRef.nativeElement;
        this.outRef = (this.outRef) ? this.outRef : this.ref;
        this.inRef = (this.inRef) ? this.inRef : this.ref;
        this.inputFormat = (this.inputFormat) ? this.inputFormat : this.format;
        this.inputScaler = (this.inputScaler) ? this.inputScaler : this.scaler;
        let modelVal = null, formattedVal = null;
        if (this.outRef === this.inRef) {
            modelVal = this.calcService.getValueForYear(this.ref, this.yearRef, true);
            formattedVal = this.numberFormatter.parse(modelVal, this.scaler);
        }
        else {
            modelVal = this.calcService.getValueForYear(this.inRef, this.yearRef, true);
            formattedVal = this.calcService.getValueForYear(this.outRef, this.yearRef, true);
            formattedVal = this.numberFormatter.parse(formattedVal, this.scaler);
        }

        // let modelVal = this.calcService.getValueForYear(this.ref, this.yearRef);
        this.value = this.numberFormatter.parse(modelVal, this.scaler);
        this.formattedVal = this.numberFormatter.transform(formattedVal, this.format, this.scaler);

        let isMinus = this.formattedVal[0];
        if(isMinus == "("){
            if(this.colorNegative){
                this.showNegativeColor = true;
            }
        }else if(this.showNegativeColor){
            this.showNegativeColor = false;
        }
        this.observable = this.calcService.getObservable().subscribe(() => {
            this.onModelChange();
        });

    }

    onStepperButtonClick(value) {
        if (this.value !== value) {
            this.value = value;
            let modelValue = this.numberFormatter.parse(this.numberFormatter.transform(value, this.inputFormat, this.inputScaler));
            this.calcService.setValue(this.inRef, modelValue);
            // this.formattedVal = this.numberFormatter.transform(this.value, this.format, this.scaler);
        }
    }

    onModelChange() {
        // let modelValue = this.numberFormatter.parse(this.numberFormatter.transform(value, this.format, this.scaler));
        let modelVal = null, formattedVal = null;
        if (this.outRef === this.inRef) {
            modelVal = this.calcService.getValueForYear(this.ref, this.yearRef, true);
            formattedVal = this.numberFormatter.parse(modelVal, this.scaler);
        }
        else {
            modelVal = this.calcService.getValueForYear(this.inRef, this.yearRef, true);
            formattedVal = this.calcService.getValueForYear(this.outRef, this.yearRef, true);
            formattedVal = this.numberFormatter.parse(formattedVal, this.scaler);
        }

        // let modelVal = this.calcService.getValueForYear(this.ref, this.yearRef);
        this.value = this.numberFormatter.parse(modelVal, this.inputScaler);
        this.formattedVal = this.numberFormatter.transform(formattedVal, this.format, this.scaler);
        let isMinus = this.formattedVal[0];
        if(isMinus == "("){
            if(this.colorNegative){
                this.showNegativeColor = true;
            }
        }else if(this.showNegativeColor){
            this.showNegativeColor = false;
        }
    }

    validator(amount) {
        let newVal,
            outVal = this.calcService.getValueForYear(this.outRef, this.yearRef, true),
            inVal = this.calcService.getValueForYear(this.inRef, this.yearRef, true);
        amount = this.numberFormatter.parse(this.numberFormatter.transform(amount, this.inputFormat, this.inputScaler));
        // check if stepping down goes out of bounds
        if (this.outputMin !== undefined && amount < 0) {
            if ((outVal + amount) < Number(this.outputMin)) {
                return false;
            }
        }
        else if (this.outputMax !== undefined && amount > 0) {
            if ((outVal + amount) > Number(this.outputMax)) {
                return false;
            }
        }
        return true;
    }

    ngOnDestroy() {
    }

    ngAfterViewInit() {
        // new Stepper().bindAll();
        new Stepper().bindAll({ context: this.el, onchange: this.onStepperButtonClick.bind(this), validator: this.getValidator() });
    }

    getValidator() {
        let self = this;

        return function(amount) {
            return self.validator(amount);
        }
    }

}