import { NgModule } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { UiSwitchModule } from 'angular2-ui-switch';
import { CalcModule } from '../calcmodule/calc.module';
import { TextEngineModule } from '../textengine/text.module';
import { TabsModule, ButtonsModule, DropdownModule, ModalModule, CarouselModule, TooltipModule, AccordionModule } from 'ng2-bootstrap';
import { ChartsModule } from '../charts/charts.module';
import { ConnectModule } from '../connect/connect.module';
import { SharedModule } from '../shared/shared.module';
import { DataStore, FileSaver } from '../utils';

// load isomer app components
import { IntroComponent } from './intro/intro.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardGraphComponent } from './dashboardgraph/dashboardgraph.component';
import { DashboardMetricsComponent } from './dashboardmetrics/dashboardmetrics.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PNLComponent } from './pnl/pnl.component';
import { ClickOutsideDirective } from './clickoutsidedirective/clickoutside.directive';
import { PracticeComponent } from './practice/practice.component';
import { PracticedataComponent } from './practicedata/practicedata.component';
import { DecsummaryreportComponent } from './decsummaryreport/decsummaryreport.component';
import { SalesmarketingComponent } from './salesmarketing/salesmarketing.component';
import { CorporateComponent } from './corporate/corporate.component';
import { StratergicinitiativesComponent } from './stratergicinitiatives/stratergicinitiatives.component';
import { OverviewComponent } from './overview/overview.component';
import { FooterComponent } from './footer/footer.component';
import { CustomaccordianComponent } from './customaccordian/customaccordian.component';
import { HoldScreenComponent } from './holdscreen/holdscreen.component';



@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        UiSwitchModule,
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
        ConnectModule,
        SharedModule
    ],
    declarations: [
        IntroComponent,
        DashboardComponent,
        NavbarComponent,
        PNLComponent,
        ClickOutsideDirective,
        DashboardGraphComponent,
        DashboardMetricsComponent,
        PracticeComponent,
        PracticedataComponent,
        DecsummaryreportComponent,
        SalesmarketingComponent,
        CorporateComponent,
        StratergicinitiativesComponent,
        OverviewComponent,
        FooterComponent,
        CustomaccordianComponent,
        HoldScreenComponent
],
    exports: [
        IntroComponent,
        DashboardComponent,
        NavbarComponent,
        PNLComponent,
        ClickOutsideDirective,
        DashboardGraphComponent,
        DashboardMetricsComponent,
        PracticeComponent,
        PracticedataComponent,
        DecsummaryreportComponent,
        SalesmarketingComponent,
        CorporateComponent,
        StratergicinitiativesComponent,
        OverviewComponent,
        FooterComponent,
        CustomaccordianComponent,
        HoldScreenComponent
    ],
    providers: [
        DataStore,
        FileSaver
    ]
})
export class ViewsModule { }
