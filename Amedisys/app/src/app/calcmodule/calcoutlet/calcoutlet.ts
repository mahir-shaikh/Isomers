import { Component, Input, OnInit, OnDestroy, OnChanges, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CalcService } from '../calc.service';


@Component({
    selector: 'calc-outlet',
    template: '<span [class.color1]="color1Enabled" [class.color2]="color2Enabled" [class.color3]="color3Enabled">{{value | numFormat:format:scaler}}</span>',
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
    @Input() color1Condition: string;
    @Input() color1Value: string;
    @Input() color2Condition: string;
    @Input() color2Value: string;
    @Input() color3Condition: string;
    @Input() color3Value: string;
    private color1Enabled:boolean = false;
    private color2Enabled:boolean = false;
    private color3Enabled:boolean = false;
    private value: string;
    private subscriber: EventEmitter<any>;
    private year: string;

    constructor(private calcService: CalcService, private cdRef: ChangeDetectorRef) { };

    ngOnInit() {
        
        this.subscriber = this.calcService.getObservable().subscribe(() => {
            this.updateValue()
        });
        this.updateValue();
    }

    private updateValue() {
        let value = this.calcService.getValueForYear(this.ref, this.yearRef, this.useRawValue);
        if (this.value != value) {
            this.cdRef.markForCheck();
        }
        this.value = value;

        if (this.color1Condition) {
            this.color1Enabled = false;
            if (this.color1Condition == "=") {
                this.color1Enabled = (parseFloat(this.value) == parseFloat(this.color1Value));
            } else if (this.color1Condition == "<") {
                this.color1Enabled = (parseFloat(this.value) < parseFloat(this.color1Value));
            } else if (this.color1Condition == ">") {
                this.color1Enabled = (parseFloat(this.value) > parseFloat(this.color1Value));
            }
        }
        if (this.color2Condition) {
            this.color2Enabled = false;
            if (this.color2Condition == "=") {
                this.color2Enabled = (parseFloat(this.value) == parseFloat(this.color2Value));
            } else if (this.color2Condition == "<") {
                this.color2Enabled = (parseFloat(this.value) < parseFloat(this.color2Value));
            } else if (this.color2Condition == ">") {
                this.color2Enabled = (parseFloat(this.value) > parseFloat(this.color2Value));
            }
        }
        if (this.color3Condition) {
            this.color3Enabled = false;
            if (this.color3Condition == "=") {
                this.color3Enabled = (parseFloat(this.value) == parseFloat(this.color3Value));
            } else if (this.color3Condition == "<") {
                this.color3Enabled = (parseFloat(this.value) < parseFloat(this.color3Value));
            } else if (this.color3Condition == ">") {
                this.color3Enabled = (parseFloat(this.value) > parseFloat(this.color3Value));
            }
        }
    }

    ngOnChanges(){
        this.updateValue();
    }

    ngOnDestroy() {
        this.subscriber.unsubscribe();
    }

}