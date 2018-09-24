import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SplashComponent } from './views/splash/splash.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { CalcModelLoadedGuard } from './isomer';
import { ViewsRoutingModule } from './views/views-routing.module';
import { TestComponent } from './views/test/test.component';

const appRoutes: Routes = [
    {
        path: 'splash',
        component: SplashComponent
    },
    /*{
        path: 'logout',
        component: SplashComponent
    },*/
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
