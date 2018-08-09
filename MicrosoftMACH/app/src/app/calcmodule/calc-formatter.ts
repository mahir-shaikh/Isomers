import { Directive, HostListener, ElementRef, OnInit, Input, AfterViewInit } from '@angular/core';
import { NumberFormattingPipe } from './number-formatting.pipe';

@Directive({
    selector: '[numberformatter]',
    providers: [NumberFormattingPipe]
})
export class CalcFormatter implements OnInit, AfterViewInit {
    private el: HTMLInputElement;
    private initialInputType: string;
    @Input() scaler: number;
    @Input() format: string;
    private listenToBlur: boolean = false;
    private inputFormatted: boolean = false;
    // @Input() type: string;

    constructor(private element:ElementRef, private numberFormatter: NumberFormattingPipe) {
        this.el = this.element.nativeElement;
    }

    ngOnInit() {
        // this.format = (this.el.attributes['format']) ? this.el.attributes['format'].value : undefined;
        // this.scaler = (this.el.attributes['scaler']) ? this.el.attributes['scaler'].value : undefined;
        // this.el.value = this.numberFormatter.transform(this.el.value, this.format, this.scaler);
    }

    ngAfterViewInit() {
        // this.el.value = this.numberFormatter.transform(this.el.value, this.format, this.scaler);
    }

    @HostListener('focus', ["$event.target.value"])
    onFocus(value: string) {
        if (!this.format) {
            return;
        }

        // added this condition as on firefox the input gets triggered twice so the scaler is applied 2x
        if (!this.inputFormatted) {
            this.el.value = this.numberFormatter.parse(value, this.scaler);
            this.inputFormatted = true;
        }

        // console.log(this.numberFormatter.parse(value, this.scaler));
        if (this.initialInputType === undefined) {
            this.initialInputType = this.el.attributes['type'].value;
            this.el.attributes['type'].value = "number";
        }
        else {
            this.el.attributes['type'].value = "number";
        }
        /* hack for firefox because blur seems to get triggeed when we change from text to number */
        setTimeout(() => {
            this.listenToBlur = true;
        }, 300);
    }

    @HostListener('blur', ["$event.target.value"])
    onBlur(value: string) {
        if (!this.format) {
            return;
        }
        if (!this.listenToBlur) return;

        this.el.attributes['type'].value = this.initialInputType;
        // console.log("setting value" + this.numberFormatter.transform(value + "", this.format, this.scaler));
        this.el.value = this.numberFormatter.transform(value, this.format, this.scaler);
        this.listenToBlur = false;
        this.inputFormatted = false;
    }
}