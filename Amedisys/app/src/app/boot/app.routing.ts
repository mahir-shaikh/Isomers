import { Routes, RouterModule } from '@angular/router';
import { CalcModelLoadedGuard } from '../calcmodule/calc-model-loaded-guard';
import { SplashComponent, LogoutComponent, SwotComponent, SwotInput} from '../shared/shared.module';
import { DashboardComponent, InfoComponent, ChoiceComponent, PlanningToolDash, PlanningTool, DooFocusComponent, AnalysisComponent, StaffingComponent, ForecastComponent, Categories, Tutorials, Resources,  Reports, Tips, FeedbackComponent, ChoiceMadeGuard, DashboardRoute, YearRoute, EndOfRoundFeedback, PasswordComponent, CareCenterComponent } from '../viewsmodule';
// import { CalcModelResolveService } from '../calcmodule/calcmodel-resolved.service';
import { IntroComponent, IntroText, IntroEmail, IntroOverview, GoalSettingComponent, Registration } from '../viewsmodule/intro/intro';
// import { messagesDashRouting } from '../messagesdash/messages-dashboard-routing';

const appRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardRoute,
        canActivate: [CalcModelLoadedGuard],
        children: [{
            path: 'message/:id',
            component: InfoComponent,
            outlet: 'messages'
        }, {
            path: 'meeting/:id',
            component: ChoiceComponent,
            canActivate: [ChoiceMadeGuard],
            outlet: 'messages'
        }, {
            path: 'feedback/:id',
            component: FeedbackComponent,
            outlet: 'messages'
        }, {
            path: 'planning',
            component: PlanningTool,
            outlet: 'planning',
            children: [{
                    path: 'doofocus',
                    component: DooFocusComponent
                },{
                    path: 'doofocus/:tabid',
                    component: DooFocusComponent
                },{
                    path: 'carecenter',
                    component: CareCenterComponent
                },{
                    path: 'carecenter/:tabid',
                    component: CareCenterComponent
                },{
                    path: 'carecenter/:centerid/:tabid',
                    component: CareCenterComponent
                },{
                    path: 'forecast',
                    component: ForecastComponent
                },{
                    path: 'forecast/:tabid',
                    component: ForecastComponent
                },{
                    path: 'staffing',
                    component: StaffingComponent
                },{
                    path: 'staffing/:tabid',
                    component: StaffingComponent
                },  {
                    path: 'reports',
                    component: Reports
                }, {
                    path: 'reports/:tabid',
                    component: Reports
                }, {
                    path: 'tips',
                    component: Tips
                }]
        }, {
            path: 'tutorials',
            canActivate: [CalcModelLoadedGuard],
            component: Tutorials
        },{
            path: 'resources',
            canActivate: [CalcModelLoadedGuard],
            component: Resources
        },{
            path: 'endofroundfeedback',
            canActivate: [CalcModelLoadedGuard],
            component: YearRoute,
            children: [{
                component: EndOfRoundFeedback,
                path: ':year',
                outlet: 'year'
            }]
        }, {
            path: 'swot',
            canActivate: [CalcModelLoadedGuard],
            component: SwotComponent
        }, {
            path: 'analysis',
            canActivate: [CalcModelLoadedGuard],
            component: AnalysisComponent
        }]
    },
    {
        path: 'dashboard',
        component: DashboardRoute,
        canActivate: [CalcModelLoadedGuard]
    },{
        path: 'choosecategory',
        component: Categories,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'password',
        component: PasswordComponent,
        canActivate: [CalcModelLoadedGuard]
    },
    {
        path: 'splash',
        component: SplashComponent
    },
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'intro',
        component: IntroComponent,
        canActivate: [CalcModelLoadedGuard],
        children: [{
            path: 'registration',
            component: Registration
        }, {
            path: 'welcome',
            component: IntroText
        }, {
            path: 'email',
            component: IntroEmail
        }, {
            path: 'overview',
            component: IntroOverview
        }, {
            path: 'swot',
            component: SwotComponent
        }]
    },
    {
        path: 'logout',
        component: LogoutComponent
    }
]

export const appRoutingProviders: any[] = [CalcModelLoadedGuard];

export const routing = RouterModule.forRoot(appRoutes, { useHash: true});