import { Routes, RouterModule } from '@angular/router';
import { CalcModelLoadedGuard } from '../calcmodule/calc-model-loaded-guard';
import { SplashComponent, LogoutComponent } from '../shared/shared.module';
import { IntroComponent, ForecastingComponent, CompanyDecisionsComponent, SkuDecisionsComponent, DashboardComponent, CustomerReportComponent, TotalIncomeStatementComponent, IncomeStatementComponent, DecisionSummaryComponent } from '../viewsmodule';

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
        component: CompanyDecisionsComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'customer-report',
        component: CustomerReportComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'income-statement',
        component: TotalIncomeStatementComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'SKUs/:ChannelName',
        component: SkuDecisionsComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'channel/:ChannelName',
        component: ForecastingComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'income-statement/:StatementOf',
        component: IncomeStatementComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'decision-summary',
        component: DecisionSummaryComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: '',
        redirectTo: '/intro',
        pathMatch: 'full'
    }
]

export const routing = RouterModule.forRoot(appRoutes, { useHash: true});