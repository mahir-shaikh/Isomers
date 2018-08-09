import { Component, ElementRef, OnInit, Input, EventEmitter, OnDestroy } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { Router } from '@angular/router';
import { Utils, DataStore } from '../../utils/utils';
import { NumberFormattingPipe } from '../../calcmodule/number-formatting.pipe';

const CURRENT_YEAR_REF = 'xxRound';

@Component({
    selector: 'text-metric',
    templateUrl: './text-metric.html',
    styleUrls: ['./text-metric.css'],
    providers: [NumberFormattingPipe]
})

export class TextMetric implements OnInit, OnDestroy {
    @Input() titleKey: string;
    @Input() ref: string;
    @Input() currentYearRef:string;
    @Input() lastYearRef: string;
    @Input() format: string;
    @Input() scaler: number;
    @Input() metricPos: string;
    private showLastYearRef: boolean = false;
    @Input() showMetricSeparator: boolean = false;
    @Input() color1Condition: string;
    @Input() color1Value: string;
    @Input() color2Condition: string;
    @Input() color2Value: string;
    @Input() color3Condition: string;
    @Input() color3Value: string;
    private value: string;
    private oldValue: string;
    private lastYearValue: string;
    private valueChanged: number = -1;
    private subscription:EventEmitter<any>;

    constructor(private calcService: CalcService, private dataStore: DataStore, private utils: Utils, private numberFormatting: NumberFormattingPipe) { }

    ngOnInit() {
        if (this.currentYearRef !== undefined) {
            this.value = this.calcService.getValueForYear(this.ref, this.currentYearRef);
            if (this.lastYearRef) {
                this.lastYearValue = this.calcService.getValueForYear(this.ref, this.lastYearRef);
            }
        }
        else {
            this.value = this.calcService.getValue(this.ref);
            if (this.lastYearRef !== undefined) {
                this.lastYearValue = this.calcService.getValue(this.lastYearRef);
            }
        }
        if (this.lastYearRef) {
            this.showLastYearRef = true;
        }
        else {
            // check if data exists in persistent storage - page refreshed so inmemory cache is cleared
            let curYear = this.calcService.getValue(CURRENT_YEAR_REF),
                ref = this.ref + "_year_" + curYear,
                getDataPromise = this.dataStore.getData(ref, true);
            // if (getDataPromise === null) {
            //     this.saveMetricOldValue(this.value);
            // }
            // else {
            getDataPromise.then((val) => {
                if (val !== null) {
                    this.lastYearValue = val;
                    this.setValueChanged();
                }
                else {
                    this.saveMetricOldValue(this.value);
                }
            })
            // }
        }
        this.setValueChanged();
        this.subscription = this.calcService.getObservable().subscribe(() => {
            // this.saveMetricOldValue(this.value);
            if (this.currentYearRef) {
                this.value = this.calcService.getValueForYear(this.ref, this.currentYearRef);
            }
            else {
                this.value = this.calcService.getValue(this.ref);
            }
            this.setValueChanged();
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    saveMetricOldValue(value: string) {
        let prevYear = Number(this.calcService.getValue(CURRENT_YEAR_REF)) -1,
            ref = this.ref + "_year_" + prevYear;
        this.dataStore.setData(ref, value, true);
    }

    setValueChanged() {
        let curValue = this.numberFormatting.parse(this.value),
            prevYear = Number(this.calcService.getValue(CURRENT_YEAR_REF)) -1,
            lastValue = this.dataStore.getData(this.ref + "_year_" + prevYear, true);

        if(typeof lastValue == "object"){
            lastValue.then((val) => {
                val = this.numberFormatting.parse(val);
                if (curValue > val) {
                    this.valueChanged = 1;
                }
                else if (curValue < val) {
                    this.valueChanged = 2;
                }
                else if (curValue === val) {
                    this.valueChanged = 0;
                }

            })
        }else{
            if (curValue > lastValue) {
                this.valueChanged = 1;
            }
            else if (curValue < lastValue) {
                this.valueChanged = 2;
            }
            else if (curValue === lastValue) {
                this.valueChanged = 0;
            }
        }
        // this.dataStore.setData(this.ref + "_year_" + curYear, curValue, true);
    }
}
