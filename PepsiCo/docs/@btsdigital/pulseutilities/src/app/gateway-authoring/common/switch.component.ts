import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'btn-switch',
  template: `
    <div class="gw-switch">
        <input type="checkbox" class="gw-switch-checkbox" id="{{rndID}}" (change)="changeSwitch()" checked="{{isTrue?'checked':''}}">
        <label class="gw-switch-label" for="{{rndID}}">
            <span class="gw-switch-inner"></span>
            <span class="gw-switch-switch"></span>
        </label>
    </div>
  `
})

export class SwitchComponent {
  @Input() isTrue;
  @Output() chnge = new EventEmitter();

  rndID:string = "gwSwitch_"+Math.random();

  changeSwitch() {
      this.isTrue = !this.isTrue;
      this.chnge.emit({newValue: this.isTrue});
  }
}