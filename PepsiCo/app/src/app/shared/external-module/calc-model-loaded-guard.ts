import { Injectable } from '@angular/core';
// import { CalcService } from './calc.service';
import { CalcService  } from '@btsdigital/ngx-isomer-core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class CalcModelLoadedGuard implements CanActivate {
    private isSplashLoaded: boolean;
    constructor(private router: Router, private calcService: CalcService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.calcService.isApiReady()) { return true; }
        // this.calcService.setStateUrl(state.url);

        // Navigate to the login page
        this.router.navigate(['/splash']);
        return false;
    }
}
