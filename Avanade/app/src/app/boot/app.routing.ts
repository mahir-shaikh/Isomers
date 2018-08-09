import { Routes, RouterModule } from '@angular/router';
import { CalcModelLoadedGuard } from '../calcmodule/calc-model-loaded-guard';
import { SplashComponent, LogoutComponent } from '../shared/shared.module';
import { IntroComponent, DashboardComponent, OverviewComponent, SalesmarketingComponent, CorporateComponent, StratergicinitiativesComponent,
    PracticeComponent, PNLComponent, DecsummaryreportComponent, HoldScreenComponent } from '../viewsmodule';

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
        path: 'holdScreen',
        component: HoldScreenComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'intro',
        component: IntroComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'overview',
        component: OverviewComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'salesMarketing',
        component: SalesmarketingComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'corporate',
        component: CorporateComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'stratergicInitiatives',
        component: StratergicinitiativesComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'pnl',
        component: PNLComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'decSummary',
        component: DecsummaryreportComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'practice/:practiceName',
        component: PracticeComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: '',
        redirectTo: '/intro',
        pathMatch: 'full'
    },
]

export const routing = RouterModule.forRoot(appRoutes, { useHash: true});

