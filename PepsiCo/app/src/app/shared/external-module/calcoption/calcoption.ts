import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
// import { CalcService } from '../calc.service';
import { TextService, CalcService, NumberFormattingPipe } from '@btsdigital/ngx-isomer-core';
// import { NumberFormattingPipe } from '../number-formatting.pipe';

@Component({
    selector: 'isma-calc-option',
    templateUrl: './calcoption.html',
    providers: [NumberFormattingPipe],
    styleUrls: ['./calcoption.styl']
})

export class CalcOptionComponent implements OnInit, OnDestroy, OnChanges {
    @Input() items: Array<String>;
    @Input() ref: string;
    @Input() yearRef: string;
    // @Output() onchange: EventEmitter<any> = new EventEmitter();
    // @Output() onselect: EventEmitter<any> = new EventEmitter();
    private selectedItemNumber: number = 0;
    private observer: any = null;
    _items: Array<String> = [];

    constructor(private calcService: CalcService, private numberFormatting: NumberFormattingPipe, private textEngine: TextService) { }

    getSelectedItem(): number {
        return this.selectedItemNumber;
    }

    selectionChanged(itemNo): void {
        const self: any = this;
        let value: number;
        self.selectedItemNumber = itemNo;
        // this.onselect.emit();

        value = itemNo;

        if (this.yearRef) {
            const currentYear = this.calcService.getValue(this.yearRef);
            this.calcService.setValue(this.ref + '_R' + currentYear, value).then(() => {
                // this.onchange.emit(itemNo);
            });
        } else {
            this.calcService.setValue(this.ref, itemNo).then(() => {
                // this.onchange.emit(itemNo);
            });
        }

        // self.jsCalcApi.setValue('tlInputR1E1', $item, true);
    }

    ngOnInit() {
        const self = this;
        this.processItems();
        this.processSelectedItem();
        // console.log('selected item = ' + this.selectedItemNumber);

        this.observer = this.calcService.getObservable().subscribe(() => {
            self.processItems();
            self.processSelectedItem();

        });
    }

    processItems() {
        const items = this.items;
        this._items = [];
        if (items && items.length) {
            items.forEach((val: string, index) => {
                let itemName: string = '';
                // this.textEngine.getText(val) || val;
                if ((val.indexOf('tlInput') !== -1) || (val.indexOf('tlOutput') !== -1)) {
                    itemName = this.calcService.getValue(val);
                } else {
                    itemName = this.textEngine.getText(val) || val;
                }

                if (itemName) { this._items.push(itemName); }
            });
        }
    }

    processSelectedItem() {
        const self = this;
        let modelVal: number;
        if (this.yearRef) {
            const currentYear = this.calcService.getValue(this.yearRef);
            modelVal = this.calcService.getValueForYear(this.ref, this.yearRef, true) as any;
        } else {
            modelVal = this.calcService.getValue(this.ref, true) as any;
        }
        this.selectedItemNumber = modelVal;
        // console.log('selected item = ' + this.selectedItemNumber);
    }

    ngOnDestroy() {
        if (this.observer) {
            this.observer.unsubscribe();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        this.processItems();
        this.processSelectedItem();
    }
}
