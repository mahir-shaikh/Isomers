import { Component, Input, OnInit, OnDestroy, ElementRef, AfterViewInit, OnChanges, ViewChild, HostListener } from '@angular/core';
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

export class CalcStepper implements OnInit {
    @Input() ref: string = "";
    @Input() format: string = "";
    @Input() inputFormat: string = "";
    @Input() scaler: number = 1;
    @Input() yearRef: string;
    @Input() step: number = 1;
    @Input() min: number;
    @Input() max: number;
    @Input() inRef: string = "";
    @Input() outRef: string = "";
    @Input() inputScaler: number;
    @Input() outputMax: number;
    @Input() outputMin: number;
    @Input() colorNegative: boolean = false;
    @ViewChild('inputValue') inputValueRef;
    private value: string;
    private tempValue: string;
    private formattedVal: string;
    private year: string;
    private isDirty: boolean = false;
    private el: HTMLElement
    private observable: any;
    private showNegativeColor: boolean = false;
    private modelSetValueDebounce: Observable<any>;
    private valueChangeManually;
    private isFocused:boolean = false;
    @HostListener('document:keyup', ['$event'])
    onKeyUp(ev:KeyboardEvent) {
        ev.preventDefault();
        ev.stopPropagation();
        console.log(this.inputValueRef.value);
        if(this.isFocused){
            //Enter Key
            if(ev.keyCode == 13){
                this.saveDataToModel(this.valueChangeManually);
            }            
        }
    }

    constructor(private calcService: CalcService, private numberFormatter: NumberFormattingPipe, private elRef: ElementRef) { };

    ngOnInit() {
        this.el = this.elRef.nativeElement;
        this.outRef = (this.outRef) ? this.outRef : this.ref;
        this.inRef = (this.inRef) ? this.inRef : this.ref;
        this.inputFormat = (this.inputFormat) ? this.inputFormat : this.format;
        this.inputScaler = (this.inputScaler) ? this.inputScaler : this.scaler;
        this.min = (this.min) ? this.min : this.outputMin;
        this.max = (this.max) ? this.max : this.outputMax;
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
        if(this.format == "0%"){
            this.value = "" + Math.round(this.numberFormatter.parse(modelVal, this.inputScaler));
        }else if(this.format == "0.0%"){
            this.value = "" + parseFloat(this.numberFormatter.parse(modelVal, this.inputScaler)).toFixed(1);
        }else if(this.format == "0.00%"){
            this.value = "" + parseFloat(this.numberFormatter.parse(modelVal, this.inputScaler)).toFixed(2);
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

    onChangeValue(value){
        this.valueChangeManually= value;
    }

    onStepperButtonClick(value) {
        if(!this.isFocused){
            this.inputValueRef.nativeElement.focus();
            this.setFocus();
            return;
        }


        if(this.format == "0%"){
            value = "" + Math.round(value);
        }else if(this.format == "0.0%"){
            value = "" + parseFloat(value).toFixed(1);
        }else if(this.format == "0.00%"){
            value = "" + parseFloat(value).toFixed(2);
        }

        
        if (this.value !== value) {
            this.value = value;
            let modelValue = this.numberFormatter.parse(this.numberFormatter.transform(value, this.inputFormat, this.inputScaler));
            this.calcService.setValueForYear(this.inRef, modelValue, this.yearRef);
            this.formattedVal = this.numberFormatter.transform(this.value, this.format, this.scaler);
        }
    }

    ngOnChanges(){
        this.onModelChange();
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
            this.value = "" + (this.numberFormatter.parse(modelVal, this.inputScaler));
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
        new Stepper().bindAll({ context: this.el, onchange: this.onStepperButtonClick.bind(this), validator: this.getValidator(), max:this.outputMax, min: this.outputMin });
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
            this.onStepperButtonClick(Number(this.outputMin));
        }else if(enterValue > Number(this.outputMax)){
            this.onStepperButtonClick(Number(this.outputMax));
        }else{
            this.onStepperButtonClick(enterValue);
        }

        // update value to update view
        // if (this.tempValue === undefined) {
        //     return;
        // }
        // this.value = this.numberFormatter.transform(this.tempValue, this.format, this.scaler);

        // if(Number(this.tempValue) < this.min){
        //     this.tempValue = this.min.toString();
        // }else if(Number(this.tempValue) > this.max){
        //     this.tempValue = this.max.toString();
        // }
        
        // // update calc model with parsed value
        // let value: string;
        // if (!this.format) {
        //     value = this.value;
        // }
        // else {
        //     value = this.numberFormatter.parse(this.numberFormatter.transform(this.tempValue, this.format, this.scaler));
        // }
        // if (this.isDirty) {
        //     this.calcService.setValueForYear(this.ref, value, this.yearRef);
        // }
        // this.isDirty = false;
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

}