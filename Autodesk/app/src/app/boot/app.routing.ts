import { Routes, RouterModule } from '@angular/router';
import { CalcModelLoadedGuard } from '../calcmodule/calc-model-loaded-guard';
import { SplashComponent, LogoutComponent } from '../shared/shared.module';
import { IntroComponent, DashboardComponent, InputsComponent, ReportsComponent, ChartDataComponent } from '../viewsmodule';

const appRoutes: Routes = [
    {
        path: 'logout',
        component: LogoutComponent
    },
    {
        path: 'splash',
        component: SplashComponent
    },
    {
        path: 'inputs',
        component: InputsComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'dashboard',
        component: IntroComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'charts',
        component: ChartDataComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    }
]

export const routing = RouterModule.forRoot(appRoutes, { useHash: true});