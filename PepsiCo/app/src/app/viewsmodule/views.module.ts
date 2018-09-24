import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ExternalModule } from '../shared/external-module/external-module.module';
// import { TextEngineModule } from '../textengine/text.module';
import { TextEngineService } from '../textengine/textengine.service';
import { TabsModule, ButtonsModule, BsDropdownModule, ModalModule, CarouselModule, TooltipModule, AccordionModule } from 'ngx-bootstrap';
// import { ChartsModule } from '../charts/charts.module';
// import { ConnectModule } from '../connect/connect.module';
import { SharedModule } from '../shared/shared.module';
import { DataStore, FileSaver } from '../utils';
import { IsomerCoreModule } from '@btsdigital/ngx-isomer-core';

// load isomer app components
import { IntroComponent } from './intro/intro.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PNLComponent } from './pnl/pnl.component';
import { ClickOutsideDirective } from './clickoutsidedirective/clickoutside.directive';
import { StratergicinitiativesComponent } from './stratergicinitiatives/stratergicinitiatives.component';
import { TopbarComponent } from './topbar/topbar.component';
import { ReportsComponent } from './reports/reports.component';
import { TreesComponent } from './trees/trees.component';
import { CashflowComponent } from './cashflow/cashflow.component';
import { BalancesheetComponent } from './balancesheet/balancesheet.component';
import { RoictreeComponent } from './roictree/roictree.component';
import { CashflowtreeComponent } from './cashflowtree/cashflowtree.component';
import { MarketComponent } from './market/market.component';
import { MarketdataComponent } from './marketdata/marketdata.component';
import { ResearchdevelopmentComponent } from './researchdevelopment/researchdevelopment.component';
import { OperationsComponent } from './operations/operations.component';
import { GssComponent } from './gss/gss.component';
import { GoalsettingComponent } from './goalsetting/goalsetting.component';
import { SwotComponent } from './swot/swot.component';
import { StrategysettingComponent } from './strategysetting/strategysetting.component';
import { PlanningtoolComponent } from './planningtool/planningtool.component';
import { TextareaComponent } from './textarea/textarea';
import { CustomaccordianComponent } from './customaccordian/customaccordian.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { InnovationComponent } from './innovation/innovation.component';
import { HoldScreenComponent } from './holdscreen/holdscreen.component';
import { DecisionsummaryComponent } from './decisionsummary/decisionsummary.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        IsomerCoreModule,
        UiSwitchModule,
        ButtonsModule.forRoot(),
        // TextEngineModule,
        ExternalModule,
        TabsModule.forRoot(),
        // ChartModule,
        ModalModule.forRoot(),
        CarouselModule.forRoot(),
        BsDropdownModule.forRoot(),
        TooltipModule.forRoot(),
        AccordionModule.forRoot(),
        // ConnectModule,
        SharedModule
    ],
    declarations: [
        IntroComponent,
        DashboardComponent,
        PNLComponent,
        ClickOutsideDirective,
        StratergicinitiativesComponent,
        TopbarComponent,
        ReportsComponent,
        TreesComponent,
        CashflowComponent,
        BalancesheetComponent,
        RoictreeComponent,
        CashflowtreeComponent,
        MarketComponent,
        MarketdataComponent,
        ResearchdevelopmentComponent,
        OperationsComponent,
        GssComponent,
        GoalsettingComponent,
        SwotComponent,
        StrategysettingComponent,
        PlanningtoolComponent,
        TextareaComponent,
        CustomaccordianComponent,
        InstructionsComponent,
        InnovationComponent,
        HoldScreenComponent,
        DecisionsummaryComponent
],
    exports: [
        IntroComponent,
        DashboardComponent,
        PNLComponent,
        ClickOutsideDirective,
        StratergicinitiativesComponent,
        TopbarComponent,
        ReportsComponent,
        TreesComponent,
        CashflowComponent,
        BalancesheetComponent,
        RoictreeComponent,
        CashflowtreeComponent,
        MarketComponent,
        MarketdataComponent,
        ResearchdevelopmentComponent,
        OperationsComponent,
        GssComponent,
        GoalsettingComponent,
        SwotComponent,
        StrategysettingComponent,
        PlanningtoolComponent,
        TextareaComponent,
        CustomaccordianComponent,
        InstructionsComponent,
        InnovationComponent,
        HoldScreenComponent
    ],
    providers: [
        DataStore,
        FileSaver,
        TextEngineService
    ]
})
export class ViewsModule { }
