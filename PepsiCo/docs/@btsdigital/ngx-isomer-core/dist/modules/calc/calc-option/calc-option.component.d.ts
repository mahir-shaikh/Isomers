import { OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CalcService } from '../calc.service';
import { TextService } from '../../text-engine/text.service';
import { CommunicatorService } from '../../services/communicator/communicator.service';
/**
 * CalcOption component allows to make inputs to the calc model using radio buttons.
 *
 */
export declare class CalcOptionComponent implements OnInit, OnDestroy, OnChanges {
    private calcService;
    private textEngine;
    private communicator;
    /**
     * Input binding for Value for element
     */
    items: Array<String>;
    /**
     * Input binding for range ref
     */
    ref: string;
    /**
     * Input binding for year ref
     */
    yearRef: string;
    /**
     * Check the selected input
     */
    private selectedItemNumber;
    /**
     * subscription variable
     */
    private observer;
    /**
     * Contains the items and use for iteration on html
     */
    _items: Array<String>;
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
    constructor(calcService: CalcService, textEngine: TextService, communicator: CommunicatorService);
    /**
     * Updated value to calc model after click input
     */
    selectionChanged(itemNo: any): void;
    /**
     * OnInit lifecycle function to instantiate component
     */
    ngOnInit(): void;
    /**
     * Display value for Input Option
     */
    processItems(): void;
    /**
    * Process the selected items
    */
    processSelectedItem(): void;
    /**
     * Destroy the subscription before component destroy
     */
    ngOnDestroy(): void;
    /**
     * OnChanges lifecycle function to call on changes
     */
    ngOnChanges(changes: SimpleChanges): void;
}
