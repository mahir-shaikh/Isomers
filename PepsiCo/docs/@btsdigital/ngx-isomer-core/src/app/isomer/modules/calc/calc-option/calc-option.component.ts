import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CalcService } from '../calc.service';
import * as noUiSlider from 'nouislider';
import { NumberFormatting } from '../../../utils/number-formatting';
import { TextService } from '../../text-engine/text.service';
import { Subscription } from 'rxjs/Subscription';
import { CommunicatorService } from '../../services/communicator/communicator.service';
import { Constants } from '../../../config/constants';

/**
 * CalcOption component allows to make inputs to the calc model using radio buttons.
 *
 */
@Component({
    selector: 'ism-calc-option',
    templateUrl: './calc-option.component.html',
    styleUrls: ['./calc-option.component.styl']
})

export class CalcOptionComponent implements OnInit, OnDestroy, OnChanges {
    /**
     * Input binding for Value for element
     */
    @Input() items: Array<String>;
    /**
     * Input binding for range ref
     */
    @Input() ref: string;
    /**
     * Input binding for year ref
     */
    @Input() yearRef: string;
    /**
     * Check the selected input
     */
    private selectedItemNumber: number = 0;
    /**
     * subscription variable
     */
    private observer: Subscription;
    /**
     * Contains the items and use for iteration on html
     */
    _items: Array<String> = [];

    /**
   * Constructor for calc-stepper component
   *
   * @param {CalcService} calcService CalcService instance
   *
   * @param {TextService} textEngine TextService instance
   *
   * @param {CommunicatorService} communicator CommunicatorService instance
   *
   */
    constructor(private calcService: CalcService, private textEngine: TextService, private communicator: CommunicatorService) { }

    /**
     * Updated value to calc model after click input
     */
    selectionChanged(itemNo): void {
        const self: any = this;
        let value: number;
        self.selectedItemNumber = itemNo;

        value = itemNo;

        if (this.yearRef) {
            const currentYear = this.calcService.getValue(this.yearRef);
            this.calcService.setValue(this.ref + '_R' + currentYear, value);
        } else {
            this.calcService.setValue(this.ref, itemNo);
        }

    }

    /**
     * OnInit lifecycle function to instantiate component
     */
    ngOnInit() {
        const self = this;
        this.processItems();
        this.processSelectedItem();
        this.observer = this.communicator.getEmitter(Constants.MODEL_CALC_COMPLETE).subscribe(() => {
            self.processItems();
            self.processSelectedItem();

        });
    }

    /**
     * Display value for Input Option
     */
    processItems() {
        const items = this.items;
        this._items = [];
        if (items && items.length) {
            items.forEach((val: string, index) => {
                let itemName: string = '';
                if ((val.indexOf('tlInput') !== -1) || (val.indexOf('tlOutput') !== -1)) {
                    itemName = this.calcService.getValue(val);
                } else {
                    itemName = this.textEngine.getText(val) || val;
                }

                if (itemName) { this._items.push(itemName); }
            });
        }
    }

    /**
    * Process the selected items
    */
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
    }

    /**
     * Destroy the subscription before component destroy
     */
    ngOnDestroy() {
        if (this.observer) {
            this.observer.unsubscribe();
        }
    }

    /**
     * OnChanges lifecycle function to call on changes
     */
    ngOnChanges(changes: SimpleChanges) {
        this.processItems();
        this.processSelectedItem();
    }
}
