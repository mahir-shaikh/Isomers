import { Directive, HostListener, ElementRef, OnInit, Input, AfterViewInit } from '@angular/core';
import { NumberFormattingPipe } from '../services/number-formatting/number-formatting.pipe';

/**
 * Formatter directive to format value on input field
 *
 * __Usage :__
 * &lt;input ismNumberFormatter format="0.0a" /&gt;
 */
@Directive({
    selector: '[ismNumberformatter]',
    providers: [NumberFormattingPipe]
})
export class CalcFormatterDirective {
    /**
     * Element reference for target input field
     *
     */
    private el: HTMLInputElement;
    /**
     * Initial type of the input field, so we can restore it back
     *
     */
    private initialInputType: string;
    /**
     * Scaler value to be applied when formatting the value
     *
     */
    @Input() scaler: number;
    /**
     * Format string specifying the number format that needs to be applied
     *
     */
    @Input() format: string;
    /**
     * Flag whether listening to blur events
     *
     */
    private listenToBlur: boolean = false;
    /**
     * Flag whether input is already formatted, so we dont format it again accidentally
     *
     */
    private inputFormatted: boolean = false;
    // @Input() type: string;

    /**
     * Constructor for directive
     *
     * @param {ElementRef} element Element ref instance
     *
     * @param {NumberformattingPipe} numberFormatter NumberFormattingPipe instance
     *
     */
    constructor(private element: ElementRef, private numberFormatter: NumberFormattingPipe) {
        this.el = this.element.nativeElement;
    }

    /**
     * Hostlistener function for onFocus event on input element
     *
     * @param {string} value Initial value of input field on focus event
     */
    @HostListener('focus', ['$event.target.value'])
    onFocus(value: string) {
        if (!this.format) {
            return;
        }

        // added this condition as on firefox the input gets triggered twice so the scaler is applied 2x
        if (!this.inputFormatted) {
            this.el.value = this.numberFormatter.parse(value, this.scaler) + '';
            this.inputFormatted = true;
        }

        // console.log(this.numberFormatter.parse(value, this.scaler));
        if (this.initialInputType === undefined) {
            this.initialInputType = this.el.attributes['type'].value;
            this.el.attributes['type'].value = 'number';
        } else {
            this.el.attributes['type'].value = 'number';
        }
        /* hack for firefox because blur seems to get triggeed when we change from text to number */
        setTimeout(() => {
            this.listenToBlur = true;
        }, 300);
    }

    /**
     * Hostlistener function for onBlur event on input element
     *
     * @param {string} value Value of input field on blur event
     */
    @HostListener('blur', ['$event.target.value'])
    onBlur(value: string) {
        if (!this.format) {
            return;
        }
        if (!this.listenToBlur) {
          return;
        }

        this.el.attributes['type'].value = this.initialInputType;
        // console.log('setting value' + this.numberFormatter.transform(value + '', this.format, this.scaler));
        this.el.value = this.numberFormatter.transform(value, this.format, this.scaler) + '';
        this.listenToBlur = false;
        this.inputFormatted = false;
    }
}
