import { Component, Input, OnInit, OnDestroy, ElementRef, ViewEncapsulation, Output } from '@angular/core';
import { CalcService } from '../calc.service';
import * as noUiSlider from 'nouislider';
import * as numberFormatting from '../../../libs/jsCalc/numberFormatting';
import { NumberFormattingPipe } from '../number-formatting.pipe';

@Component({
    selector: 'calc-slider',
    templateUrl: './calcslider.html',
    styleUrls: ['./calcslider.styl'],
    providers: [NumberFormattingPipe],
    encapsulation: ViewEncapsulation.Emulated
})

export class CalcSlider {
    @Input() ref: string = "";
    @Input() yearRef: string;
    @Input() step: number;
    @Input() min: number;
    @Input() max: number;
    @Input() showButtons: boolean = false;
    @Input() onChange:any;
    @Input() handleValueRef: string;
    @Input() prefix: string = "";
    @Input() suffix: string = "";
    @Input() format: string = "";
    @Input() scaler: number = 1;
    private value: string;
    private tempValue: string;
    private year: string;
    private isDirty: boolean = false;
    private el:any;
    private subscription:any;
    private handleValue:string;
    private sliderInstance: any;

    constructor(private numberformatting: NumberFormattingPipe, private calcService: CalcService, private elRef: ElementRef) { 
        this.el = elRef.nativeElement;
    };

    ngOnInit() {

        this.value = this.calcService.getValue(this.ref);
        this.value = numberFormatting.unformat(this.value,this.scaler);
        // if (this.format) {
        //     this.value = this.numberformatting.transform(this.value, this.format, this.scaler);
        // }
        let slider: HTMLElement = this.el.querySelector('.calc-slider');
        // let pips: Array<HTMLElement> = this.el.getElementsByClassName('pip-steps');
        let opt: any = {
            start: [Number(this.value)],
            range: {
                'min': Number(this.min),
                'max': Number(this.max)
            },
            step: (this.step) ? Number(this.step) : undefined,
            behavior: 'tap-drag',
            connect : [true,false],
            pips: {
                mode: 'steps',
                density: 1
            }
        }
        if (slider) {
            // for (var count = 0; count < sliders.length; count++) {
            //     noUiSlider.create(sliders[count], opt);
            // }
            noUiSlider.create(slider, opt);
            this.bindEvents(slider);
            this.updateValues();
        }

        this.subscription = this.calcService.getObservable().subscribe(() => {
            this.updateValues();
            // this.updateHandleValue();
            this.updateHandlePosition();
        })
    }

    updateValues() {
        this.handleValue = this.calcService.getValue(this.handleValueRef, true);
        this.updateHandleValue();
    }

    bindEvents(slider:any) {
        if (slider && slider.noUiSlider) {
            this.sliderInstance = slider.noUiSlider;
            slider.noUiSlider.on('change', () => {
                let curVal = slider.noUiSlider.get();
                this.saveDataToModel(curVal);
                if (this.onChange) {
                    this.onChange(this.el);
                }
            });
        }
    }

    updateHandleValue() {
        if (this.handleValueRef) {
            if (this.handleValue !== null) {
                this.el.querySelector('.noUi-handle').innerHTML = "";//this.handleValue + "%";
            }
        }
    }

    saveDataToModel(val:any) {
        console.log("save to model called");
        // this.isDirty = false;
        // if (this.format) {
        //     val = this.numberformatting.transform(val, this.format, this.scaler);
        // }
        this.calcService.setValue(this.ref, val);
    }


    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    updateHandlePosition(){
        if(this.sliderInstance){
            let curSliderVal = this.sliderInstance.get();
            if(this.handleValue != curSliderVal){
                this.sliderInstance.set(this.handleValue);                
            }
        }
    }

}