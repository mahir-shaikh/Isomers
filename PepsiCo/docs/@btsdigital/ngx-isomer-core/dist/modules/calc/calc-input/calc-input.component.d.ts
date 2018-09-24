import { OnInit, OnDestroy, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CalcService } from '../calc.service';
import { NumberFormattingPipe } from '../../services/number-formatting/number-formatting.pipe';
import { CommunicatorService } from '../../services/communicator/communicator.service';
/**
 * CalcInput component let's user set/update values in calc model
 *
 */
export declare class CalcInputComponent implements OnInit, OnChanges, OnDestroy {
    private calcService;
    private communicator;
    private numberFormatter;
    private cdRef;
    /**
     * Value for range ref from calc-model
     */
    value: string | number;
    /**
     * Is input field read only
     */
    isReadOnly: Boolean;
    /**
     * Updated value on the input field that is not yet synced to model
     *
     */
    private dirtyValue;
    /**
     * Subscription for model change events.
     *
     */
    private subscription;
    /**
     * Is input field dirty i.e. initial value is changed by user
     *
     */
    private isDirty;
    /**
     * Input binding for range ref
     *
     */
    ref: string;
    /**
     * Input binding for year ref
     *
     */
    yearRef: string;
    /**
     * Input binding for number format
     *
     */
    format: string;
    /**
     * Input binding for scaler
     *
     */
    scaler: number;
    /**
     * Input binding for Type for input element
     */
    type: string;
    /**
     * Input binding for Step value for input element
     */
    step: number;
    /**
     * Input binding for Min value for input element
     *
     */
    min: number | string;
    /**
     * Input binding for Max value for input element
     *
     */
    max: number | string;
    /**
     * Input binding for rawValue flag
     *
     */
    rawValue: Boolean;
    /**
     * Input binding for readonly flag
     *
     */
    readOnly: Boolean;
    /**
     * Constructor for calc-input component
     *
     * @param {CalcService} calcService CalcService instance
     *
     * @param {CommunicatorService} communicator CommunicatorService instance
     *
     * @param {NumberFormattingPipe} numberFormatter NumberFormattingPipe instance
     *
     * @param {ChangeDetectorRef} cdRef ChangeDetectorRef instance
     *
     */
    constructor(calcService: CalcService, communicator: CommunicatorService, numberFormatter: NumberFormattingPipe, cdRef: ChangeDetectorRef);
    /**
     * Initialize subscribers and component with value from calc model
     *
     */
    ngOnInit(): void;
    /**
     * Update comonent when any input bindings are changed
     *
     */
    ngOnChanges(): void;
    /**
     * Removes any subscribers when component instance is destroyed
     *
     */
    ngOnDestroy(): void;
    /**
     * Fetch updated value from calc model and set formatted value to component
     *
     */
    private update();
    /**
     * Saves updated value to calc model once onBlur event is triggered on input field
     *
     * @param {any} $event Blur event
     */
    saveDataToModel($event?: any): void;
    /**
     * Change event listener when user changes the input value
     *
     */
    onModelChange(val: any): void;
}
