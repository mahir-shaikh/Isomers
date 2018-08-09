import { Component, Input, OnInit, OnDestroy, ElementRef, AfterViewInit, OnChanges, ViewChild } from '@angular/core';
import { CalcService } from '../calc.service';
import { NumberFormattingPipe } from '../number-formatting.pipe';
import { Stepper } from '../../../libs/stepper/stepper';
import { Observable } from 'rxjs';

@Component({
    selector: 'calc-stepper',
    templateUrl: './calcstepper.html',
    styleUrls: ['./calcstepper.styl'],
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
    @Input() prefix: string = "";
    @Input() suffix: string = "";
    private value: string;
    private tempValue: string;
    private formattedVal: string;
    private year: string;
    private isDirty: boolean = false;
    private el: HTMLElement
    private observable: any;
    @Input() colorNegative: boolean = false;
    private showNegativeColor: boolean = false;
    private modelSetValueDebounce: Observable<any>;
    private instanceOfStepper: any;
    private isFocused:boolean = false;
    @ViewChild('inputValue') inputValueRef;
    private valueChangeManually;

    constructor(private calcService: CalcService, private numberFormatter: NumberFormattingPipe, private elRef: ElementRef) { };

    ngOnInit() {
        this.el = this.elRef.nativeElement;
        this.outRef = (this.outRef) ? this.outRef : this.ref;
        this.inRef = (this.inRef) ? this.inRef : this.ref;
        this.inputFormat = (this.inputFormat) ? this.inputFormat : this.format;
        this.inputScaler = (this.inputScaler) ? this.inputScaler : this.scaler;
        this.outputMin = (this.outputMin) ? this.outputMin : this.min;
        this.outputMax = (this.outputMax) ? this.outputMax : this.max;
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
        if(this.format == "0%" || this.format == "0.0%" || this.format == "0.00%"){
            this.value = "" + Math.round(this.numberFormatter.parse(modelVal, this.inputScaler));
        }else{
            this.value = this.numberFormatter.parse(modelVal, this.inputScaler);
        }
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
            this.calcService.setValueForYear(this.inRef, modelValue, this.yearRef);
            this.formattedVal = this.numberFormatter.transform(this.value, this.format, this.scaler);
        }
    }

    ngOnChanges(){
        this.onModelChange();
        if(this.instanceOfStepper){
            this.instanceOfStepper.updateMinMax(this.outputMin,this.outputMax);
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
        if(this.format == "0%" || this.format == "0.0%" || this.format == "0.00%"){
            this.value = "" + Math.round(this.numberFormatter.parse(modelVal, this.inputScaler));
        }else{
            this.value = this.numberFormatter.parse(modelVal, this.inputScaler);
        }
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
            if (Math.round((outVal + amount)*this.scaler) < Number(this.outputMin)) {
            // if ((outVal + amount) < Number(this.outputMin)) {
                return false;
            }
        }
        else if (this.outputMax !== undefined && amount > 0) {
            if (Math.round((outVal + amount)*this.scaler) > Number(this.outputMax)) {
            // if ((outVal + amount) > Number(this.outputMax)) {
                return false;
            }
        }
        return true;
    }

    ngOnDestroy() {
    }

    ngAfterViewInit() {
        // new Stepper().bindAll();
        this.instanceOfStepper = new Stepper().bindAll({ context: this.el, onchange: this.onStepperButtonClick.bind(this), validator: this.getValidator(), max:this.outputMax, min: this.outputMin });
    }

    getValidator() {
        let self = this;

        return function(amount) {
            return self.validator(amount);
        }
    }

    saveDataToModel(enterValue) {
        if (enterValue >= Number(this.outputMin) && enterValue <= Number(this.outputMax)) {
            this.onStepperButtonClick(enterValue);
        }else if(enterValue < Number(this.outputMin)){
            this.value = ""+this.outputMin;
            this.onStepperButtonClick(Number(this.outputMin));
        }else if(enterValue > Number(this.outputMax)){
            this.value = ""+this.outputMax;
            this.onStepperButtonClick(Number(this.outputMax));
        }
    }

    setFocus(){
        this.isFocused = true;
    }

    removeFocus(enterValue){
        if(enterValue != this.value){
            this.saveDataToModel(enterValue);
        }
        this.isFocused = false;
    }

    setFocusOnInput(){
        this.inputValueRef.nativeElement.focus();
        this.setFocus();
    }

    onChangeValue(value){
        this.valueChangeManually= value;
    }

}