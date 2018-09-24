import { TestBed, async, inject } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CalcModelLoadedGuard } from './calc-model-loaded.guard';
import { CalcService } from './calc.service';
import { CalcServiceStub } from '../../test/calc-service.stub';
import { ServicesModule } from '../services';
class RouterStub {
  navigateByUrl(url: string) { return url; }
}

describe('CalcModelLoadedGuard', () => {

  const next: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
  const state: RouterStateSnapshot = jasmine.createSpyObj<RouterStateSnapshot>('RouterStateSnapshot', ['toString']);
  let calcService: CalcServiceStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ServicesModule],
      providers: [CalcModelLoadedGuard, { provide: CalcService, useClass: CalcServiceStub }, { provide: Router, useClass: RouterStub }]
    });
    // jasmine.createSpyObj<RouterStateSnapshot>('RouterStateSnapshot', ['toString']);
    calcService = TestBed.get(CalcService);
  });

  it('should activate page when api is ready', inject([CalcModelLoadedGuard], (guard: CalcModelLoadedGuard) => {
    calcService.apiReady = true;

    const result = guard.canActivate(next, state);
    expect(result).toBeTruthy();
  }));

  it('should not activate page when api is not ready', inject([CalcModelLoadedGuard], (guard: CalcModelLoadedGuard) => {
    calcService.apiReady = false;

    const result = guard.canActivate(next, state);
    expect(result).toBeFalsy();
  }));
});
