import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CalcService } from './calc.service';
import { StorageService } from '../services/storage/storage.service';
import { Constants } from '../../config/constants';

/**
 * A route guard to validate that calc model is ready before activating the route
 *
 */
@Injectable()
export class CalcModelLoadedGuard implements CanActivate {

  /**
   * Constructor for Guard
   *
   * @param {CalcService} calcService CalcService instance
   *
   * @param {Router} router RouterService instance
   *
   * @param {StorageService} storageService StorageService instance
   */
  constructor(private calcService: CalcService, private router: Router, private storageService: StorageService) {}

  /**
   * CanActivate method implementation
   *
   * @param {ActivatedRouteSnapshot} next
   *
   * @param {RouterStateSnapshot} state
   *
   * @return {Observable<boolean>|Promise<boolean>|boolean}
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.calcService.isApiReady()) {
      return true;
    } else {
      this.storageService.setValue(Constants.RETURN_URL, state.url);
      this.router.navigateByUrl('/splash');
      return false;
    }
  }
}
