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
import { ScenarioComponent } from './scenario/scenario.component';
import { InputsComponent } from './inputs/inputs.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportTableCompopnent } from './reportTable/reportTable.component';
import { StaticReportCompopnent } from './staticreport/staticreport.component';
import { DashboardmetricsComponent } from './dashboardmetrics/dashboardmetrics.component';
import { ClickOutsideDirective } from './clickoutsidedirective/clickoutside.directive';

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
        ScenarioComponent,
        DashboardmetricsComponent,
        InputsComponent,
        ReportTableCompopnent,
        StaticReportCompopnent,
		ClickOutsideDirective
    ],
    exports: [
        IntroComponent,
        DashboardComponent,
        InputsComponent,
        ScenarioComponent,
        DashboardmetricsComponent,
        ReportTableCompopnent,
        StaticReportCompopnent,
		ClickOutsideDirective
    ],
    providers: [
        DataStore,
        FileSaver
    ]
})
export class ViewsModule { }
