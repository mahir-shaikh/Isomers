import { Routes, RouterModule } from '@angular/router';
import { CalcModelLoadedGuard } from '../calcmodule/calc-model-loaded-guard';
import { SplashComponent, LogoutComponent } from '../shared/shared.module';
import { IntroComponent } from '../viewsmodule';
import { RegionTeritoryComponent } from '../viewsmodule';
import { DashboardComponent } from '../viewsmodule';
import { PerformanceDashboardComponent } from '../viewsmodule';

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
        path: 'intro',
        component: IntroComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'dashboard',
        component: RegionTeritoryComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: '',
        redirectTo: '/intro',
        pathMatch: 'full'
    }
]

export const routing = RouterModule.forRoot(appRoutes, { useHash: true});