import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CalcService } from '../calc.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { NumberFormattingPipe } from '../number-formatting.pipe';

@Component({
    selector: 'calc-option',
    templateUrl: './calcoption.html',
    providers: [NumberFormattingPipe],
    styleUrls: ['./calcoption.styl']
})

export class CalcOption implements OnInit, OnDestroy, OnChanges {
    @Input() items: Array<String>;
    @Input() ref: string;
    @Input() yearRef: string;
    @Input() format: string;
    @Input() scaler: number = 1;
    @Input() isTypeYesNo: boolean = false;
    @Input() isDisabled: boolean = false;
    // @Output() onchange: EventEmitter<any> = new EventEmitter();
    // @Output() onselect: EventEmitter<any> = new EventEmitter();
    private selectedItemNumber: number = 0;
    private observer: any = null;
    private _items:Array<String> = [];

    constructor(private calcService: CalcService, private numberFormatting: NumberFormattingPipe, private textEngine: TextEngineService) { }

    getSelectedItem(): any {
        return this.items[this.selectedItemNumber];
    }

    selectionChanged(itemNo): void {
        let self: any = this, value: any;
        self.selectedItemNumber = itemNo;
        // this.onselect.emit();

        value = this.items[itemNo];

        if (this.yearRef) {
            let currentYear = this.calcService.getValue(this.yearRef);
            this.calcService.setValue(this.ref + "_R" + currentYear, value).then(() => {
                // this.onchange.emit(itemNo);
            })
        } else {
            this.calcService.setValue(this.ref, value).then(() => {
                // this.onchange.emit(itemNo);
            })
        }
        
        // self.jsCalcApi.setValue('tlInputR1E1', $item, true);
    }

    ngOnInit() { 
        let self = this;
        this.processItems();
        this.processSelectedItem();
        // console.log("selected item = " + this.selectedItemNumber);
        
        this.observer = this.calcService.getObservable().subscribe(() => {
            self.processItems();
            self.processSelectedItem();

        });
    }

    processItems() { 
        let items = this.items;
        this._items = [];
        if (items && items.length) {
            items.forEach((val:string, index) => {
                let itemName:string = "";//this.textEngine.getText(val) || val;
                if ((val.indexOf("tlInput") != -1) || (val.indexOf("tlOutput") != -1)) {
                    itemName = this.calcService.getValue(val);
                } else {
                    itemName = this.textEngine.getText(val) || val;
                }
                
                if (itemName)
                    this._items.push(itemName);
            })
        }
    }

    processSelectedItem(){ 
        var self = this;
        let modelVal:number;
        if (this.yearRef) {
            let currentYear = this.calcService.getValue(this.yearRef);
            modelVal = this.calcService.getValueForYear(this.ref, this.yearRef, true);
        } else {
            modelVal = this.calcService.getValue(this.ref, true);
        }
        this.selectedItemNumber = this.items.indexOf(modelVal.toString());
        // console.log("selected item = " + this.selectedItemNumber);
    }

    ngOnDestroy() {
        this.observer.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.processItems();
        this.processSelectedItem();
        if(this.isDisabled){
            this.selectionChanged(-1);
        }
    }
}