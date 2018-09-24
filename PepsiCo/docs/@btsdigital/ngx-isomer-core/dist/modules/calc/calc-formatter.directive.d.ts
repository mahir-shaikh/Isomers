import { ElementRef } from '@angular/core';
import { NumberFormattingPipe } from '../services/number-formatting/number-formatting.pipe';
/**
 * Formatter directive to format value on input field
 *
 * __Usage :__
 * &lt;input ismNumberFormatter format="0.0a" /&gt;
 */
export declare class CalcFormatterDirective {
    private element;
    private numberFormatter;
    /**
     * Element reference for target input field
     *
     */
    private el;
    /**
     * Initial type of the input field, so we can restore it back
     *
     */
    private initialInputType;
    /**
     * Scaler value to be applied when formatting the value
     *
     */
    scaler: number;
    /**
     * Format string specifying the number format that needs to be applied
     *
     */
    format: string;
    /**
     * Flag whether listening to blur events
     *
     */
    private listenToBlur;
    /**
     * Flag whether input is already formatted, so we dont format it again accidentally
     *
     */
    private inputFormatted;
    /**
     * Constructor for directive
     *
     * @param {ElementRef} element Element ref instance
     *
     * @param {NumberformattingPipe} numberFormatter NumberFormattingPipe instance
     *
     */
    constructor(element: ElementRef, numberFormatter: NumberFormattingPipe);
    /**
     * Hostlistener function for onFocus event on input element
     *
     * @param {string} value Initial value of input field on focus event
     */
    onFocus(value: string): void;
    /**
     * Hostlistener function for onBlur event on input element
     *
     * @param {string} value Value of input field on blur event
     */
    onBlur(value: string): void;
}
