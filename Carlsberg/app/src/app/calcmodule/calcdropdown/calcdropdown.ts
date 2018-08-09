import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { CalcService } from '../calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { NumberFormattingPipe } from '../number-formatting.pipe';

@Component({
    selector: 'calc-dropdown',
    templateUrl: './calcdropdown.html',
    providers: [NumberFormattingPipe],
    styleUrls: ['./calcdropdown.styl']
})

export class CalcDropdown implements OnInit, OnDestroy, OnChanges {
    private disabled: boolean = false;
    private status: { isopen: boolean } = { isopen: false };
    @Input() items: Array < String > ;
    @Input() ref: string;
    @Input() yearRef: string;
    @Input() placeholder: string = "Select...";
    @Input() format: string;
    @Input() scaler: number = 1;
    @Input() recheck: boolean = false;

    // private jsCalcApi: any = null;
    // private tlInputR1E1: string = "tlInputR1E1";
    private selectedItem: string;
    public observer: EventEmitter < any > ;
    private _items: Array < String > = [];

    constructor(private calcService: CalcService, private numberFormatting: NumberFormattingPipe, private textEngine: TextEngineService) {}

    toggled(open: boolean) {
        console.log("Dropdown is now : " + open);
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
        let self: any = this,
            value: string;
        self.selectedItem = $item;
        value = this.numberFormatting.parse(this.numberFormatting.transform($item, this.format, this.scaler), this.scaler);
        if (this.yearRef) {
            let currentYear = this.calcService.getValue(this.yearRef);
            this.calcService.setValue(this.ref + "_R" + currentYear, value);
        } else {
            this.calcService.setValue(this.ref, $item);
        }
        // self.jsCalcApi.setValue('tlInputR1E1', $item, true);
    }

    ngOnInit() {
        var self = this;
        let modelVal: string = "";
        if (this.yearRef) {
            let currentYear = this.calcService.getValue(this.yearRef);
            modelVal = this.numberFormatting.transform(this.calcService.getValueForYear(this.ref, this.yearRef, true), this.format, this.scaler);
        } else {
            modelVal = this.numberFormatting.transform(this.calcService.getValue(this.ref, true), this.format, this.scaler);
        }
        this.processItems();

        this.selectedItem = (modelVal.toString().length > 0) ? modelVal : this.placeholder;

        if (this.recheck && this.items.indexOf(this.selectedItem) == -1) {
            // this.selectedItem = this.items[0].toString();
            this.dropdownChanged(this.items[0].toString());
        }

        this.observer = this.calcService.getObservable().subscribe(() => {
            let modelVal: string = "";
            if (this.yearRef) {
                let currentYear = this.calcService.getValue(this.yearRef);
                modelVal = this.numberFormatting.transform(this.calcService.getValueForYear(this.ref, this.yearRef, true), this.format, this.scaler);
            } else {
                modelVal = this.numberFormatting.transform(this.calcService.getValue(this.ref, true), this.format, this.scaler);
            }
            this.processItems();
            this.selectedItem = (modelVal.toString().length > 0) ? modelVal : this.placeholder;
        })
    }

    processItems() {
        let items = this.items;
        this._items = [];
        if (items && items.length) {
            items.forEach((val: string, index) => {
                let itemName: string = this.textEngine.getText(val) || val;
                this._items.push(itemName);
            })
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
            let modelVal: string = "";
            if (this.yearRef) {
                let currentYear = this.calcService.getValue(this.yearRef);
                modelVal = this.numberFormatting.transform(this.calcService.getValueForYear(this.ref, this.yearRef, true), this.format, this.scaler);
            } else {
                modelVal = this.numberFormatting.transform(this.calcService.getValue(this.ref, true), this.format, this.scaler);
            }
            this.processItems();

            this.selectedItem = (modelVal.toString().length > 0) ? modelVal : this.placeholder;
        }
    }
    getObserver(){
        return this.observer;
    }
}
