import { Injectable } from '@angular/core';
import { CalcService } from '../../calcmodule/calc.service';
import { Utils } from '../../utils/utils';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class ChoiceMadeGuard implements CanActivate {
    constructor(private router: Router, private calcService: CalcService, private utils: Utils) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let id: string = route.params['id'];
        
        if (this.calcService.getValue('tlInput' + id) === "1") {
            this.router.navigateByUrl(this.utils.generateFeedbackUrl(id));
            return false;
        }
        return true;
    }
}
