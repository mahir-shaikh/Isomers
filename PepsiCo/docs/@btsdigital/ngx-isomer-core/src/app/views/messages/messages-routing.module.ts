import { NgModule } from '@angular/core';
import { Routes, RouterModule, Route } from '@angular/router';
import { ChartsTestComponent } from '../charts-test/charts-test.component';
import { TestComponent } from '../test/test.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

export const message_routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [{
    path: 'charts',
    outlet: 'links',
    component: ChartsTestComponent
  }, {
    path: 'test',
    outlet: 'links',
    component: TestComponent
  }]
  }];

@NgModule({
  imports: [RouterModule.forChild(message_routes)],
  exports: [RouterModule]
})
export class MessagesRoutingModule { }
