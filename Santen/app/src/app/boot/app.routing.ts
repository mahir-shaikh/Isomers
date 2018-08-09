import { Routes, RouterModule } from '@angular/router';
import { CalcModelLoadedGuard } from '../calcmodule/calc-model-loaded-guard';
import { SplashComponent, LogoutComponent } from '../shared/shared.module';
import { LandingPageComponent } from '../viewsmodule';
import { DashboardComponent } from '../viewsmodule';
import { DevelopmentPlanComponent } from '../viewsmodule/views.module';
import { SceanrioComponent } from '../viewsmodule/views.module';
import { ActionsComponent } from '../viewsmodule/views.module';
import { ReportsComponent } from '../viewsmodule/views.module';

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
        component: LandingPageComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'developmentPlan',
        component: DevelopmentPlanComponent,
        canActivate: [CalcModelLoadedGuard]
    }, {
        path: 'scenario',
        component: SceanrioComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'actionPlan',
        component: ActionsComponent,
        canActivate: [CalcModelLoadedGuard]
    }, {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    }
]

export const routing = RouterModule.forRoot(appRoutes, { useHash: true});