import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
// import { CalcService } from '../calc.service';
import { TextService, CalcService, NumberFormattingPipe } from '@btsdigital/ngx-isomer-core';
// import { NumberFormattingPipe } from '../number-formatting.pipe';

@Component({
    selector: 'isma-calc-dropdown',
    templateUrl: './calcdropdown.html',
    providers: [NumberFormattingPipe],
    styleUrls: ['./calcdropdown.styl']
})

export class CalcDropdownComponent implements OnInit, OnDestroy, OnChanges {
    @Input() disabled: boolean = false;
    status: { isopen: boolean } = { isopen: false };
    @Input() items: Array<String>;
    @Input() colorList: Array<String>;
    @Input() ref: string;
    @Input() yearRef: string;
    @Input() placeholder: string = 'Select...';
    @Input() format: string;
    @Input() scaler: number = 1;
    @Input() recheck: boolean = false;
    @Input() isDropUp: boolean = false;
    @Output() changed: EventEmitter<any> = new EventEmitter();
    @Output() selected: EventEmitter<any> = new EventEmitter();

    private initFinished: boolean = false;

    // private jsCalcApi: any = null;
    // private tlInputR1E1: string = 'tlInputR1E1';
    private selectedItem: string;
    private observer: any = null;
    private _items: Array<String> = [];

    constructor(private calcService: CalcService, private numberFormatting: NumberFormattingPipe, private textEngine: TextService) { }

    toggled(open: boolean) {
        console.log('Dropdown is now : ' + open);
    }

    toggleDropdown($event: MouseEvent): void {
        $event.preventDefault();
        $event.stopPropagation();
        this.status.isopen = !this.status.isopen;
    }

    getSelectedItem(): string {
        return this.selectedItem;
    }

    dropdownChanged($item: string): void {
        const self: any = this;
        let value: string;
        self.selectedItem = $item;
        this.selected.emit();
        // only parse value if num format is provided
        if (this.format) {
            value = this.numberFormatting.parse(this.numberFormatting.transform($item, this.format, this.scaler), this.scaler) + '';
        }
        if (this.yearRef) {
            const currentYear = this.calcService.getValue(this.yearRef);
            this.calcService.setValue(this.ref + '_R' + currentYear, value).then(() => {
                this.changed.emit($item);
            });
        } else {
            this.calcService.setValue(this.ref, $item).then(() => {
                this.changed.emit($item);
            });
        }

        // self.jsCalcApi.setValue('tlInputR1E1', $item, true);
    }

    ngOnInit() {
        const self = this;
        let modelVal = '';
        if (this.yearRef) {
            const currentYear = this.calcService.getValue(this.yearRef);
            modelVal = this.numberFormatting.transform(
                this.calcService.getValueForYear(this.ref, this.yearRef, true),
                this.format, this.scaler) + '';
        } else {
            modelVal = this.numberFormatting.transform(this.calcService.getValue(this.ref, true), this.format, this.scaler) + '';
        }
        this.processItems();

        this.selectedItem = (modelVal.toString().length > 0) ? modelVal : this.placeholder;

        this.observer = this.calcService.getObservable().subscribe(() => {
            let modelValue: string = '';
            if (self.yearRef) {
                const currentYear = self.calcService.getValue(self.yearRef);
                modelValue = self.numberFormatting.transform(
                    self.calcService.getValueForYear(self.ref, self.yearRef, true),
                    self.format, self.scaler) + '';
            } else {
                modelValue = self.numberFormatting.transform(self.calcService.getValue(self.ref, true), self.format, self.scaler) + '';
            }
            self.processItems();
            self.selectedItem = (modelValue.toString().length > 0) ? modelValue : this.placeholder;

        });

        this.initFinished = true;
    }

    recheckItems() {
        if (this.recheck && this.items.indexOf(this.selectedItem) === -1) {
            // this.selectedItem = this.items[0].toString();
            this.dropdownChanged(this.items[0].toString());
        }
    }

    processItems() {
        const items = this.items;
        this._items = [];
        if (items && items.length) {
            items.forEach((val: string, index) => {
                const itemName: string = this.textEngine.getText(val) || val;
                if (itemName) {
                    this._items.push(itemName);
                }
            });
        }
    }

    ngOnDestroy() {
        if (this.observer) {
            this.observer.unsubscribe();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        // check if changelist has new items and its not the first change
        // if (changes['items'] && !changes['items'].isFirstChange())
        {
            this.processItems();
        }

        if (this.recheck && this.initFinished) {
            let flag: boolean = false;

            if (changes['items'].currentValue.length !== changes['items'].previousValue.length) {
                flag = true;
            } else {
                for (let i = 0, len = changes['items'].currentValue.length; i < len; i++) {
                    if (changes['items'].currentValue[i] !== changes['items'].previousValue[i]) {
                        flag = true;
                        break;
                    }
                }
            }

            if (flag) {
                this.dropdownChanged(this.items[0].toString());
            }

        }
    }
}
