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
    @Input() differenceFormat: string = ""
    @Input() lastYearRef: string;
    @Input() showBalloon: boolean = false;
    @Input() showValue: string;
    private showValueBoolean: boolean;
    private showBalloonValue: boolean = false;
    private showMetricBalloon: boolean = false;
    private differenceInValue: string;
    private changeInValue: number;
    private newValue: string;

    constructor(private calcService: CalcService, private cdRef: ChangeDetectorRef,private numberFormatting: NumberFormattingPipe) { };

    ngOnInit() {
        let self = this;

        if(this.differenceFormat == ""){
            this.differenceFormat = this.format;
        }

        if(this.showValue == "false") {
            this.showValueBoolean = false;
        } else {
            this.showValueBoolean = true;
        }
        this.value = this.calcService.getValueForYear(this.ref, this.yearRef);

        this.subscriber = this.calcService.getObservable().subscribe(() => {
            self.updateValue();
            // self.newValue = self.calcService.getValueForYear(self.ref, self.yearRef);
            // if (self.value == self.newValue) return;
            // if(self.showBalloon){
            //     self.calculateDifference();
            //     if(self.showBalloonValue){
            //         // let self = self;
            //         self.showMetricBalloon = true;
            //         setTimeout(() => {
            //             self.showMetricBalloon = false;
            //         },10000);
            //     }
            // }
            // self.value = self.newValue;
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
        if(this.showBalloon){
            this.calculateDifference();
            if(this.showBalloonValue){
                this.showMetricBalloon = true;
                setTimeout(()=>{
                    that.hideMetricBalloon();
                },4000);
            }
        }
        this.value = this.newValue;
    }

    hideMetricBalloon(){
        this.showMetricBalloon = false;
    }

    ngOnChanges(){
        this.updateValue();
    }

    ngOnDestroy() {
        this.subscriber.unsubscribe();
    }

    calculateDifference(){
        let curValue = this.numberFormatting.parse(this.newValue),
            prevValue = this.numberFormatting.parse(this.value),
            difference;
        if(curValue > prevValue && ((curValue - prevValue) > 0.0001)){
            difference = "" + (curValue - prevValue);
            this.showBalloonValue = true;
            if(this.isReversed){
                this.changeInValue = 1;
            }else{
                this.changeInValue = 2;
            }
            this.differenceInValue = this.numberFormatting.transform(difference, this.differenceFormat);
        }else if(curValue < prevValue && ((prevValue - curValue) > 0.0001)){
            difference = "" + (prevValue - curValue);
            this.showBalloonValue = true;
            if(this.isReversed){
                this.changeInValue = 2;
            }else{
                this.changeInValue = 1;
            }            
            this.differenceInValue = "-" + this.numberFormatting.transform(difference, this.differenceFormat);
        }else{
            this.differenceInValue = this.numberFormatting.transform("0", this.differenceFormat);
            this.changeInValue = 0;
        }  
    }

}