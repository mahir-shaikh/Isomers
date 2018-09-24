import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CalcService } from './calc.service';
import { StorageService } from '../services/storage/storage.service';
/**
 * A route guard to validate that calc model is ready before activating the route
 *
 */
export declare class CalcModelLoadedGuard implements CanActivate {
    private calcService;
    private router;
    private storageService;
    /**
     * Constructor for Guard
     *
     * @param {CalcService} calcService CalcService instance
     *
     * @param {Router} router RouterService instance
     *
     * @param {StorageService} storageService StorageService instance
     */
    constructor(calcService: CalcService, router: Router, storageService: StorageService);
    /**
     * CanActivate method implementation
     *
     * @param {ActivatedRouteSnapshot} next
     *
     * @param {RouterStateSnapshot} state
     *
     * @return {Observable<boolean>|Promise<boolean>|boolean}
     */
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean;
}
