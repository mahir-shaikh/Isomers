import { Routes, RouterModule } from '@angular/router';
import { CalcModelLoadedGuard } from '../calcmodule/calc-model-loaded-guard';
import { SplashComponent, LogoutComponent } from '../shared/shared.module';
import { IntroComponent, DashboardComponent } from '../viewsmodule';

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
        path: 'dashboard',
        component: IntroComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    }
]

export const routing = RouterModule.forRoot(appRoutes, { useHash: true});