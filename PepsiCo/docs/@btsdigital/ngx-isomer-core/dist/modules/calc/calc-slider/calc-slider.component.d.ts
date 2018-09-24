import { OnInit } from '@angular/core';
import { CalcService } from '../calc.service';
/**
 * Calc Slider component, allows the user to update inputs using a slider instead of a standard text input box
 *
 */
export declare class CalcSliderComponent implements OnInit {
    private calcService;
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
     * Input binding for Step value for input element
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
     * Input binding flag to show / hide slider buttons
     *
     */
    showButtons: boolean;
    /**
     * Input binding flag to show / hide slider buttons
     *
     */
    format: string;
    /**
     * Input binding flag to show / hide slider buttons
     *
     */
    scaler: number;
    /**
     * Value for range ref from calc-model
     */
    private value;
    /**
     * Updated value on the input field that is not yet synced to model
     *
     */
    private tempValue;
    /**
     * Year value from model
     *
     */
    private year;
    /**
     * Flag value to check whether slider value was changed from initial value
     *
     */
    private isDirty;
    /**
     * Html element where the slider needs to be rendered
     *
     */
    elRef: any;
    /**
     * Constructor for calc-slider component
     *
     * @param {CalcService} calcService CalcService instance
     *
     */
    constructor(calcService: CalcService);
    /**
     * OnInit lifecycle function to instantiate component
     *
     */
    ngOnInit(): void;
    /**
     * Function to bind events to slider
     *
     * @param {any} slider Slider element reference
     */
    private bindEvents(slider);
    /**
     * Function to save component value back to model
     *
     * @param {any} value Value to be saved to model
     */
    private saveDataToModel(val);
}
