import { Routes, RouterModule } from '@angular/router';
// import { CalcModelLoadedGuard } from '../calcmodule/calc-model-loaded-guard';
import { CalcModelLoadedGuard } from '@btsdigital/ngx-isomer-core';
import { SplashComponent, LogoutComponent } from '../shared/shared.module';
import { IntroComponent, DashboardComponent, StratergicinitiativesComponent, MarketComponent, ResearchdevelopmentComponent, OperationsComponent, 
            GssComponent, ReportsComponent, TreesComponent, PlanningtoolComponent, HoldScreenComponent } from '../viewsmodule';

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
        path: 'region/:regionName',
        component: MarketComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'rnd',
        component: ResearchdevelopmentComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'ops',
        component: OperationsComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'gss',
        component: GssComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'initiatives',
        component: StratergicinitiativesComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'trees',
        component: TreesComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'planningtool',
        component: PlanningtoolComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'holdScreen',
        component: HoldScreenComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: '',
        redirectTo: '/intro',
        pathMatch: 'full'
    },
];

export const routing = RouterModule.forRoot(appRoutes, { useHash: true});

