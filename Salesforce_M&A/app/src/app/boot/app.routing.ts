import { Routes, RouterModule } from '@angular/router';
import { CalcModelLoadedGuard } from '../calcmodule/calc-model-loaded-guard';
import { SplashComponent, LogoutComponent } from '../shared/shared.module';
import { IntroComponent, DashboardComponent, IntegrationPlanStratergyComponent, IntegrationPlanComponent, ScenarioComponent, EndScreenComponent } from '../viewsmodule';

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
        path: 'intPlanStratergy',
        component: IntegrationPlanStratergyComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'intPlan',
        component: IntegrationPlanComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'execution',
        component: ScenarioComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'endScreen',
        component: EndScreenComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: '',
        redirectTo: '/intro',
        pathMatch: 'full'
    },
]

export const routing = RouterModule.forRoot(appRoutes, { useHash: true});

