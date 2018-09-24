import { Directive, ElementRef, Output, EventEmitter, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[ismaClickOutside]'
})
export class ClickOutsideDirective {
    @Input() clickOutActive: boolean;
    constructor(private _elementRef: ElementRef) {
    }

    @Output()
    public clickOutside = new EventEmitter();

    @HostListener('document:click', ['$event.target'])
    public onClick(targetElement) {
        const clickedInside = this._elementRef.nativeElement.contains(targetElement);
        if (!clickedInside && this.clickOutActive) {
            this.clickOutside.emit();
        }
    }
}
