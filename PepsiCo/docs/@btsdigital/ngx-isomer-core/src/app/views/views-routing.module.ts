import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChartsTestComponent } from './charts-test/charts-test.component';
import { TestComponent } from './test/test.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalcModelLoadedGuard } from '../isomer/modules/calc/calc-model-loaded.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [CalcModelLoadedGuard],
    children: [{
      path: 'charts',
      component: ChartsTestComponent
    }, {
      path: 'test',
      component: TestComponent
    }, {
      path: 'link',
      component: ChartsTestComponent,
      outlet: 'links'
    }]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewsRoutingModule { }
