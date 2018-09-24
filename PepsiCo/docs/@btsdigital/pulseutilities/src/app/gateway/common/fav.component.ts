import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GatewayService } from '../../services/gateway/gateway.service';

const SAVE_FAVS = "save-favs";

@Component({
  selector: 'ico-fav',
  template: `
      <div [ngClass]="isFav?'icon favorite-fill':'icon favorite-outline'" (click)="changeFav()"></div>
  `,
  styles: [``]
})

export class FavComponent {
  @Input() isFav: boolean;
  @Output() chnge = new EventEmitter();

  constructor(public gatewayService: GatewayService) {}

  changeFav() {
      this.isFav = !this.isFav;
      this.chnge.emit({newValue: this.isFav});
      this.gatewayService.emitData(SAVE_FAVS, this.isFav);
  }
}