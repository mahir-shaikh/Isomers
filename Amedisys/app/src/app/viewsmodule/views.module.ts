import { NgModule } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CalcModule } from '../calcmodule/calc.module';
import { TextEngineModule } from '../textengine/text.module';
import { TabsModule, TabsetConfig, ButtonsModule, DropdownModule, DropdownConfig, ModalModule, CarouselModule, TooltipModule, TooltipConfig, AccordionModule, AccordionConfig } from 'ng2-bootstrap';
// import { ButtonsModule } from 'ng2-bootstrap';
import { ChartsModule } from '../charts/charts.module';
// import { DropdownModule  } from 'ng2-bootstrap';
// import { ModalModule } from 'ng2-bootstrap';
// import { CarouselModule, CarouselComponent, SlideComponent } from 'ng2-bootstrap/components/carousel';
// import { SyncComponent } from '../connect/component/sync.component'
import { DooFocusComponent } from './doofocus/doofocus.component';
import {CareCenterComponent } from './carecenter/carecenter.component';
import { StaffingComponent } from './staffing/staffing.component';
import { Categories } from './categories/categories';
import { ForecastComponent } from './forecast/forecast.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PlanningToolDash } from './planningtool/planning-tool-dashboard';
import { MessagesDash } from './messagesdash/messages-dashboard';
import { TextMetric } from './textmetric/text-metric';
import { Messages } from './messages/messages';
import { Meetings } from './meetings/meetings';
import { Reports } from './reports/reports';
import { InfoComponent } from './info/info';
import { ChoiceComponent } from './choice/choice';
import { SingleSelect } from './choice/single-select';
import { Tips } from './tips/tips';
import { PlanningTool } from './planningtool/planning-tool';
import { MarketReport } from './marketreport/marketreport';
import { FeedbackComponent } from './feedback/feedback';
import { ChoiceMadeGuard } from './choice/choice-made-guard';
import { DataStore } from '../utils/utils';
import { DashboardRoute } from './dashboard/dashboardroute/dashboard.route';
import { Tutorials } from './tutorials/tutorials';
import { TutorialContent } from './tutorials/tutorialcontent';
import { LinkComponent } from './link/link.component';
import { Resources } from './resources/resources';
import { SubmitDecisions } from './submitdecisions/submit-decisions.component';
import { EndOfRoundFeedback } from './endofroundfeedback/end-of-round-feedback.component';
import { YearRoute } from './endofroundfeedback/yearroute';
import { FeedbackTextAndImage } from './endofroundfeedback/feedbacktextandimage';
import { FeedbackTextAndChart } from './endofroundfeedback/feedbacktextandchart';
import { FeedbackTextAndTable } from './endofroundfeedback/feedbacktextandtable';
import { PlanningToolNav } from './planningtool/planning-tool-nav';
import { Tooltip } from './tooltip/tooltip';
import { MyAccordionComponent } from './accordion/accordion';
import { Glossary } from './glossary/glossary';
import { SearchGlossaryPipe } from './glossary/search-glossary.pipe';
import { PasswordComponent } from './password/password.component';
import { IntroModule } from './intro/intro.module';
import { FileSaver } from '../utils/filesaver';
import { Staffmeeting } from './staffingmeeting/staffmeeting.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { TextareaComponent } from './textarea/textarea';
@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ButtonsModule,
        TextEngineModule,
        CalcModule,
        TabsModule,
        ChartsModule,
        ModalModule,
        CarouselModule,
        DropdownModule,
        TooltipModule,
        AccordionModule,
        IntroModule
        // messagesDashRouting
    ],
    declarations: [
        DashboardComponent,
        PlanningToolDash,
        MessagesDash,
        Messages,
        Meetings,
        DooFocusComponent,
        CareCenterComponent,
        ForecastComponent,
        Categories,
        Reports,
        InfoComponent,
        SingleSelect,
        Tips,
        PlanningTool,
        MarketReport,
        ChoiceComponent,
        FeedbackComponent,
        TextMetric,
        DashboardRoute,
        Tutorials,
        PlanningToolNav,
        YearRoute,
        LinkComponent,
        Resources,
        SubmitDecisions,
        EndOfRoundFeedback,
        FeedbackTextAndImage,
        FeedbackTextAndChart,
        FeedbackTextAndTable,
        Tooltip,
        MyAccordionComponent,
        Glossary,
        SearchGlossaryPipe,
        TutorialContent,
        // SyncComponent,
        PasswordComponent,
        StaffingComponent,
        Staffmeeting,
        AnalysisComponent,
        TextareaComponent
    ],
    exports: [
        DashboardComponent,
        PlanningToolDash,
        MessagesDash,
        Messages,
        Meetings,
        DooFocusComponent,
        CareCenterComponent,
        ForecastComponent,
        Categories,
        Reports,
        InfoComponent,
        SingleSelect,
        Tips,
        PlanningTool,
        MarketReport,
        ChoiceComponent,
        FeedbackComponent,
        TextMetric,
        DashboardRoute,
        Tutorials,
        PlanningToolNav,
        YearRoute,
        LinkComponent,
        Resources,
        SubmitDecisions,
        EndOfRoundFeedback,
        FeedbackTextAndImage,
        FeedbackTextAndChart,
        FeedbackTextAndTable,
        MyAccordionComponent,
        Glossary,
        TutorialContent,
        // SyncComponent,
        PasswordComponent,
        StaffingComponent,
        Staffmeeting,
        AnalysisComponent,
        TextareaComponent
    ],
    providers: [ChoiceMadeGuard, DataStore, FileSaver, DropdownConfig, TooltipConfig, TabsetConfig, AccordionConfig]
})
export class ViewsModule { }
