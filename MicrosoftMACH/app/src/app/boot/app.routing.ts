import { Routes, RouterModule } from '@angular/router';
import { CalcModelLoadedGuard } from '../calcmodule/calc-model-loaded-guard';
import { SplashComponent, LogoutComponent } from '../shared/shared.module';
import { IntroComponent, DashboardComponent, PNLComponent, OpsOperationDataComponent, OpsInfrastructureData, 
        PartnerDataComponent, PricingForecastingDataComponent, SalesServiceDataComponent, TalentDevelopmentDataComponent,
        OpsMarketingDataComponent, ERPlatformDataComponent, ERProductDataComponent  } from '../viewsmodule';

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
        component: DashboardComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'pnl',
        component: PNLComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'erPlatform',
        component: ERPlatformDataComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'erProduct/:prod',
        component: ERProductDataComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'opsOperation',
        component: OpsOperationDataComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'opsInfrastructure',
        component: OpsInfrastructureData,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'opsMarketing',
        component: OpsMarketingDataComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'pricingForecasting/:type',
        component: PricingForecastingDataComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'talentdevelopment/:type',
        component: TalentDevelopmentDataComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'salesService/:type',
        component: SalesServiceDataComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'partner/:type',
        component: PartnerDataComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: '',
        redirectTo: 'intro',
        pathMatch: 'full'
    }
]

export const routing = RouterModule.forRoot(appRoutes, { useHash: true});