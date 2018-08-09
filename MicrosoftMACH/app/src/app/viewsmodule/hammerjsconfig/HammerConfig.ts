import { HammerGestureConfig, HAMMER_GESTURE_CONFIG }  from '@angular/platform-browser';
import 'hammerjs';

export class HammerConfig extends HammerGestureConfig {
    overrides = <any> {
        'pinch': { enable: false },
        'rotate': { enable: false }
    }
}