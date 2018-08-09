import { Component, Input, OnInit, OnDestroy, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CalcService } from '../calc.service';


@Component({
    selector: 'calc-outlet',
    template: '{{value | numFormat:format:scaler}}',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles:[
    `
        :host{
            font-size: 0.875rem;
        }

        @media print {
            :host {
                font-size: inherit;
            }
        }
    `]
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
    }


    ngOnDestroy() {
        this.subscriber.unsubscribe();
    }

}