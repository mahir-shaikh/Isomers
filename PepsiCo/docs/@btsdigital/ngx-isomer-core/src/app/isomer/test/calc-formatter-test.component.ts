import { Component, DebugElement, ElementRef } from '@angular/core';

@Component({
  template: '<input class="input" type="text" ismNumberformatter [format]="format" [scaler]="scaler" value="12345.21" />'
})
export class TestComponent {
  format = '0,0.00';
  scaler = 1;

  constructor(private elRef: ElementRef) {}

  setValue(value: any) {
    this.elRef.nativeElement.value = value;
  }
}
