import { EventEmitter } from '@angular/core';
import { GatewayService } from '../../services/gateway/gateway.service';
export declare class FavComponent {
    gatewayService: GatewayService;
    isFav: boolean;
    chnge: EventEmitter<{}>;
    constructor(gatewayService: GatewayService);
    changeFav(): void;
}
