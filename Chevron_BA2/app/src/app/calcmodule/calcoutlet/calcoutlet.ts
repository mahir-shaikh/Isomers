import { Component, Input, OnInit, OnDestroy, OnChanges, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, trigger, state, animate, transition, style } from '@angular/core';
import { CalcService } from '../calc.service';
import { NumberFormattingPipe } from '../number-formatting.pipe';

@Component({
    selector: 'calc-outlet',
    templateUrl: './calcoutlet.html',
    providers: [NumberFormattingPipe],
    styleUrls: ['./calcoutlet.styl']
})

export class CalcOutlet {
    @Input() ref: string = "";
    @Input() format: string = "";
    @Input() scaler: number = 1;
    @Input() yearRef: string;
    @Input() useRawValue: boolean = false;
    @Input() logRangeRef: boolean = false;
    private value: string;
    private subscriber: EventEmitter<any>;
    private year: string;

    @Input() isReversed: boolean = false;
    @Input() differenceFormat: string = "";
    @Input() lastYearRef: string;
    @Input() showBalloon: boolean = false;
    @Input() showValue: string;
    private showValueBoolean: boolean;
    private showBalloonValue: boolean = false;
    private showMetricBalloon: boolean = false;
    private differenceInValue: string;
    private changeInValue: number;
    private newValue: string;

    @Input() formerValueRef: string = "";
    @Input() isComparisionWithPriorRound: boolean = false;
    private formerValueRefArray: Array<string> = [];

    @Input() highlightValue: boolean = false;
    private highlightStatus: number = 0; // 0 = 0, -1 = -ve , +1 = +ve

    @Input() suffix: string = "";
    private hideSuffix: boolean = false;

    private timerInstance: any;
    @Input() showBlank: boolean = false;

    constructor(private calcService: CalcService, private cdRef: ChangeDetectorRef, private numberFormatting: NumberFormattingPipe) { };

    ngOnInit() {
        let self = this;

        if(this.formerValueRef){
            this.formerValueRefArray = this.formerValueRef.split(",")
        }

        if (this.differenceFormat == "") {
            this.differenceFormat = this.format;
        }

        if (this.showValue == "false") {
            this.showValueBoolean = false;
        } else {
            this.showValueBoolean = true;
        }
        this.value = this.calcService.getValueForYear(this.ref, this.yearRef);

        this.subscriber = this.calcService.getObservable().subscribe(() => {
            self.updateValue();
        });

        this.updateValue();
    }

    private updateValue() {
        let that = this;
        let value = this.calcService.getValueForYear(this.ref, this.yearRef, this.useRawValue);
        if (this.value != value) {
            this.cdRef.markForCheck();
        }
        this.newValue = this.calcService.getValueForYear(this.ref, this.yearRef);
        // if (self.value == self.newValue) return;
        if (this.showBalloon) {
            this.calculateDifference();
            if (this.showBalloonValue) {
                that.hideMetricBalloon();
                clearTimeout(this.timerInstance);
                this.showMetricBalloon = true;
                if (!this.isComparisionWithPriorRound) {
                    this.timerInstance = setTimeout(() => {
                        that.hideMetricBalloon();
                    }, 3000);
                }
            }
        }
        this.value = this.newValue;

        if (this.highlightValue) {
            // let val = parseInt(this.numberFormatting.transform(this.value,"0.00",this.scaler));
            let val = parseFloat(this.value);
            if(this.formerValueRefArray.length > 1){
                let valuesArray: Array<number> = [];
                for(let key of this.formerValueRefArray){
                    let preval = parseFloat(this.calcService.getValue(key));
                    if(!isNaN(preval) && preval != undefined){
                        valuesArray.push(preval);
                    }                    
                }
                if(isNaN(val) || val == undefined){
                    val = 0;
                }
                let max = Math.max.apply(null, valuesArray);
                let min = Math.min.apply(null, valuesArray);
                this.highlightStatus = val > max ? 1 : val < min ? -1 : 0;
            }else if(this.formerValueRef && this.formerValueRef!=" "){
                let preval = parseFloat(this.calcService.getValue(this.formerValueRef));
                if(isNaN(preval) || preval == undefined){
                    preval = 0;
                }
                if(isNaN(val) || val == undefined){
                    val = 0;
                }
                this.highlightStatus = val == preval ? 0 : (val > preval) ? 1 : -1;
            }else {
                this.highlightStatus = val == 0 ? 0 : (val > 0) ? 1 : -1;
            }

            if(this.isReversed && this.highlightStatus){
                this.highlightStatus *=(-1);
            }
        }

        if (this.value === "" && !this.showBlank) {
            this.hideSuffix = true;
        } else {
            this.hideSuffix = false;
        }
    }

    hideMetricBalloon() {
        this.showMetricBalloon = false;
    }

    ngOnChanges() {
        this.updateValue();
    }

    ngOnDestroy() {
        this.subscriber.unsubscribe();
    }

    calculateDifference() {
        let curValue = this.numberFormatting.parse(this.newValue),
            prevValue = this.isComparisionWithPriorRound ? this.numberFormatting.parse(this.calcService.getValue(this.formerValueRef)) : this.numberFormatting.parse(this.value),
            difference;
        if (curValue > prevValue && (this.numberFormatting.transform("" + (curValue - prevValue), this.differenceFormat) > this.numberFormatting.transform("0", this.differenceFormat))) {
            difference = "" + (curValue - prevValue);
            this.showBalloonValue = true;
            if (this.isReversed) {
                this.changeInValue = 1;
            } else {
                this.changeInValue = 2;
            }
            this.differenceInValue = this.numberFormatting.transform(difference, this.differenceFormat);
        } else if (curValue < prevValue && (this.numberFormatting.transform("" + (prevValue - curValue), this.differenceFormat) > this.numberFormatting.transform("0", this.differenceFormat))) {
            difference = "" + (prevValue - curValue);
            this.showBalloonValue = true;
            if (this.isReversed) {
                this.changeInValue = 2;
            } else {
                this.changeInValue = 1;
            }
            this.differenceInValue = "-" + this.numberFormatting.transform(difference, this.differenceFormat);
        } else {
            this.differenceInValue = this.numberFormatting.transform("0", this.differenceFormat);
            this.changeInValue = 0;
        }
    }

}