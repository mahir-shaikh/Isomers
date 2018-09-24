import {
    Component, Input, OnInit, OnDestroy, OnChanges,
    EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef,
    trigger, state, animate, transition, style
} from '@angular/core';
// import { CalcService } from '../calc.service';
// import { NumberFormattingPipe } from '../number-formatting.pipe';
import { CalcService, CalcOutputComponent, CommunicatorService, NumberFormattingPipe } from '@btsdigital/ngx-isomer-core';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'isma-calc-outlet',
    templateUrl: './calcoutlet.html',
    providers: [NumberFormattingPipe],
    styleUrls: ['./calcoutlet.styl']
})

export class CalcOutletComponent extends CalcOutputComponent implements OnInit, OnChanges, OnDestroy {
    @Input() ref: string = '';
    @Input() format: string = '';
    @Input() scaler: number = 1;
    @Input() yearRef: string;
    @Input() useRawValue: boolean = false;
    @Input() logRangeRef: boolean = false;
    value: string;
    // private subscriber: EventEmitter<any>;
    private year: string;

    @Input() isReversed: boolean = false;
    @Input() differenceFormat: string = '';
    @Input() lastYearRef: string;
    @Input() showBalloon: boolean = false;
    @Input() showValue: string;
    public showValueBoolean: boolean;
    public showBalloonValue: boolean = false;
    public showMetricBalloon: boolean = false;
    private differenceInValue: string;
    public changeInValue: number;
    private newValue: string;

    // Local declarations of CalcOutlet that are private in CalcOutputComponent
    private calcServiceA: CalcService;
    private cdRefA: ChangeDetectorRef;
    private subscriberA: Subscription;

    @Input() formerValueRef: string = '';
    @Input() isComparisionWithPriorRound: boolean = false;

    @Input() highlightNegative: boolean = false;
    public isNegative: boolean = false;

    constructor(calcService: CalcService, cdRef: ChangeDetectorRef, private numberFormatting: NumberFormattingPipe, communicator: CommunicatorService) {
        super(calcService, communicator, cdRef);
        this.calcServiceA = calcService;
        this.cdRefA = cdRef;
    }

    ngOnInit() {
        const self = this;

        if (this.differenceFormat === '') {
            this.differenceFormat = this.format;
        }

        if (this.showValue === 'false') {
            this.showValueBoolean = false;
        } else {
            this.showValueBoolean = true;
        }
        this.value = this.calcServiceA.getValueForYear(this.ref, this.yearRef,this.useRawValue);

        this.subscriberA = this.calcServiceA.getObservable().subscribe(() => {
            self.updateValue();
            // self.newValue = self.calcServiceA.getValueForYear(self.ref, self.yearRef);
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

       // this.updateValue();
    }

    private updateValue() {
        const that = this;
        const value = this.calcServiceA.getValueForYear(this.ref, this.yearRef, that.useRawValue);
        if (this.value !== value) {
            this.cdRefA.markForCheck();
        }
        this.newValue = this.calcServiceA.getValueForYear(this.ref, this.yearRef,that.useRawValue);
        // if (self.value == self.newValue) return;
        if (this.showBalloon) {
            this.calculateDifference();
            if (this.showBalloonValue) {
                this.showMetricBalloon = true;
                if (!this.isComparisionWithPriorRound) {
                    setTimeout(() => {
                        that.hideMetricBalloon();
                    }, 4000);
                }
            }
        }
        this.value = this.newValue;

        if (this.highlightNegative) {
            this.isNegative = parseInt(this.numberFormatting.transform(this.value, this.format, this.scaler) + '') < 0 ? true : false;
        }
    }

    hideMetricBalloon() {
        this.showMetricBalloon = false;
    }

    ngOnChanges() {
        this.updateValue();
    }

    ngOnDestroy() {
        this.subscriberA.unsubscribe();
    }

    calculateDifference() {
        const curValue = this.numberFormatting.parse(this.newValue),
            prevValue = this.isComparisionWithPriorRound ? this.numberFormatting.parse(this.calcServiceA.getValue(this.formerValueRef)) : this.numberFormatting.parse(this.value);
        let difference;
        if (curValue > prevValue &&
            (this.numberFormatting.transform('' + (parseInt(curValue + '') - parseInt(prevValue + '')),
                this.differenceFormat) > this.numberFormatting.transform('0', this.differenceFormat))) {
            difference = '' + (parseInt(curValue + '') - parseInt(prevValue + ''));
            this.showBalloonValue = true;
            if (this.isReversed) {
                this.changeInValue = 1;
            } else {
                this.changeInValue = 2;
            }
            this.differenceInValue = this.numberFormatting.transform(difference, this.differenceFormat) + '';
        } else if (curValue < prevValue &&
            (this.numberFormatting.transform('' + (parseInt(curValue + '') - parseInt(prevValue + '')),
                this.differenceFormat) > this.numberFormatting.transform('0', this.differenceFormat))) {
            difference = '' + (parseInt(curValue + '') - parseInt(prevValue + ''));
            this.showBalloonValue = true;
            if (this.isReversed) {
                this.changeInValue = 2;
            } else {
                this.changeInValue = 1;
            }
            this.differenceInValue = '-' + this.numberFormatting.transform(difference, this.differenceFormat);
        } else {
            this.differenceInValue = this.numberFormatting.transform('0', this.differenceFormat) + '';
            this.changeInValue = 0;
        }
    }

}
