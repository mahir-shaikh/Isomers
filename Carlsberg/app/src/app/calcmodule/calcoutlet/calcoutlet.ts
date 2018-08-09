import { Component, Input, OnInit, OnDestroy, OnChanges, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CalcService } from '../calc.service';


@Component({
    selector: 'calc-outlet',
    template: '{{value | numFormat:format:scaler}}',
    changeDetection: ChangeDetectionStrategy.OnPush,
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
    private subscriber: EventEmitter < any > ;
    private year: string;

    constructor(private calcService: CalcService, private cdRef: ChangeDetectorRef) {};

    ngOnInit() {

        this.subscriber = this.calcService.getObservable().subscribe(() => {
            this.updateValue()
        });

        this.updateValue();
    }

    updateValue() {
        let value = this.calcService.getValueForYear(this.ref, this.yearRef, this.useRawValue);
        if (this.value != value) {
            this.cdRef.markForCheck();
        }
        this.value = value;
    }

    ngOnChanges() {
        this.updateValue();
    }

    ngOnDestroy() {
        if (this.subscriber) {
            this.subscriber.unsubscribe();
        }
    }
    getSubscriber(){
        return this.subscriber;
    }

    // calculateDifference(){
    //     let curValue = this.numberFormatting.parse(this.newValue),
    //         prevValue = this.numberFormatting.parse(this.value),
    //         difference;
    //     if(curValue > prevValue){
    //         difference = "" + (curValue - prevValue);
    //         this.showBalloonValue = true;
    //         this.changeInValue = 2;
    //         this.differenceInValue = this.numberFormatting.transform(difference, this.format);
    //     }else if(curValue < prevValue){
    //         difference = "" + (prevValue - curValue);
    //         this.showBalloonValue = true;
    //         this.changeInValue = 1;
    //         this.differenceInValue = "-" + this.numberFormatting.transform(difference, this.format);
    //     }else{
    //         this.differenceInValue = this.numberFormatting.transform("0", this.format);
    //         this.changeInValue = 0;
    //     }  
    // }

}
