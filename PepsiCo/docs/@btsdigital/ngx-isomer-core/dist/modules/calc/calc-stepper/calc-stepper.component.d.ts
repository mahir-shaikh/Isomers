import { OnInit, OnDestroy, OnChanges, AfterViewInit, ElementRef } from '@angular/core';
import { CalcService } from '../calc.service';
import { NumberFormattingPipe } from '../../services/number-formatting/number-formatting.pipe';
import { CommunicatorService } from '../../services/communicator/communicator.service';
/**
 * CalcStepper component allows to make inputs to the calc model using an input and buttons to increment and decrement.
 *
 */
export declare class CalcStepperComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    private calcService;
    private numberFormatter;
    private elRef;
    private communicator;
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
     * Input binding to Format value
     *
     */
    format: string;
    /**
     * Input binding for inputFormat
     *
     */
    inputFormat: string;
    /**
     * Input binding for Scaler
     *
     */
    scaler: number;
    /**
     * Input binding for Step value for input element
     *
     */
    step: number;
    /**
     * Input binding for Min value for input element
     *
     */
    min: number;
    /**
     * Input binding for Max value for input element
     *
     */
    max: number;
    /**
     * Input binding for inRef
     *
     */
    inRef: string;
    /**
     * Input binding for outRef
     *
     */
    outRef: string;
    /**
     * Input binding for inputScaler
     *
     */
    inputScaler: number;
    /**
     * Input binding for outputMin
     *
     */
    outputMin: number;
    /**
     * Input binding for outputMax
     *
     */
    outputMax: number;
    /**
     * Html element reference of the input field
     *
     */
    inputValueRef: any;
    /**
     * Value for range ref from calc-model
     *
     */
    value: string | number;
    /**
     * Flag to check if the input has focused
     *
     */
    isFocused: boolean;
    /**
     * Updated value on the input field that is not yet synced to model
     *
     */
    private dirtyValue;
    /**
     * Context of current HTMLElement
     *
     */
    private el;
    /**
     * Subscription for model change events.
     *
     */
    private subscription;
    /**
     *
     * Function will listen to the keyup event of enter key and update the value in model
     */
    onKeyUp(ev: KeyboardEvent): void;
    /**
     * Constructor for calc-stepper component
     *
     * @param {CalcService} calcService CalcService instance
     *
     * @param {numberFormatter} numberFormatter NumberFormattingPipe instance
     *
     * @param {elRef} elRef ElementRef instance
     *
     */
    constructor(calcService: CalcService, numberFormatter: NumberFormattingPipe, elRef: ElementRef, communicator: CommunicatorService);
    /**
     * OnInit lifecycle function to instantiate component
     *
     */
    ngOnInit(): void;
    /**
     * AfterViewInit lifecycle function to bind the input and buttons with eventListeners
     *
     */
    ngAfterViewInit(): void;
    /**
     * OnChanges lifecycle function to process and save the updated value to the model
     *
     */
    ngOnChanges(): void;
    /**
     *
     * OnChanges lifecycle function to process and save the updated value to model
     *
     * @param {value} value Updated value
     *
     */
    onValueChange(value: any): void;
    /**
     *
     * Function to format the updated value and save to model
     *
     * @param {value} value Updated value
     *
     */
    onStepperButtonClick(value: any): void;
    /**
     * Function to format and display the updated value
     *
     */
    onModelChange(): void;
    /**
     * Function to check if stepping down doesn't goes out of bounds
     *
     */
    validator(amount: any): boolean;
    /**
     * Function to pass the amount to Stepper Class
     *
     */
    getValidator(): (amount: any) => boolean;
    /**
     * Function to check if the new value is not out of bounds and then call onStepperButtonClick function
     *
     * @param {enteredValue} enteredValue Value entered in input box
     *
     */
    saveDataToModel(enteredValue: any): void;
    /**
     * Function to set isFocused flag true when input box gains focus
     *
     */
    onFocus(): void;
    /**
     * Function to save the updated value to model when the input loses focus
     *
     */
    onBlur(enteredValue: any): void;
    /**
     * Function to set focus on input when the user clicks on the value
     *
     */
    setFocusOnInput(): void;
    /**
     * OnDestroy lifecycle function for component. This destroys any active subscriptions to calcservice.
     *
     */
    ngOnDestroy(): void;
}
