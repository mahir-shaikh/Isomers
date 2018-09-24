import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChartsTestComponent } from './charts-test/charts-test.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewsRoutingModule } from './views-routing.module';
import { TestComponent } from './test/test.component';
import { MessagesComponent } from './messages/messages.component';
import { IsomerCoreModule } from '../isomer';
import { SplashComponent } from './splash/splash.component';

@NgModule({
  imports: [
    CommonModule,
    IsomerCoreModule,
    ViewsRoutingModule
  ],
  declarations: [ChartsTestComponent, DashboardComponent, TestComponent, MessagesComponent, SplashComponent],
  exports: [ChartsTestComponent, DashboardComponent, TestComponent, MessagesComponent, SplashComponent]
})
export class ViewsModule { }
