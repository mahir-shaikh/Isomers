import { NgModule } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { UiSwitchModule } from 'angular2-ui-switch';
import { CalcModule } from '../calcmodule/calc.module';
// import { TextEngineModule } from '../textengine/text.module';
import { TabsModule, ButtonsModule, DropdownModule, ModalModule, CarouselModule, TooltipModule, AccordionModule } from 'ng2-bootstrap';
import { ChartsModule } from '../charts/charts.module';
import { ConnectModule } from '../connect/connect.module';
import { SharedModule } from '../shared/shared.module';
import { DataStore, FileSaver } from '../utils';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG }  from '@angular/platform-browser';

// load isomer app components
import { IntroComponent } from './intro/intro.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InputsComponent } from './inputs/inputs.component';
import { ReportsComponent } from './reports/reports.component';
import { ChartDataComponent } from './chartdata/chartdata.component';
import { InputDataComponent } from './inputdata/inputdata.component';
import { ReportDataComponent } from './reportdata/reportdata.component';
import { DashboardDataComponent } from './dashboarddata/dashboarddata.component';
import { PrintComponent } from './print/print.component';
import { HammerConfig} from './hammerjsconfig/HammerConfig';



@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        UiSwitchModule,
        ButtonsModule,
        // TextEngineModule,
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
        InputsComponent,
        ReportsComponent,
        InputDataComponent,
        ReportDataComponent,
        ChartDataComponent,
        DashboardDataComponent,
        PrintComponent
    ],
    exports: [
        IntroComponent,
        DashboardComponent,
        InputsComponent,
        ReportsComponent,
        InputDataComponent,
        ReportDataComponent,
        ChartDataComponent,
        DashboardDataComponent,
        PrintComponent
    ],
    providers: [
        DataStore,
        FileSaver,
        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: HammerConfig
        }
    ]
})
export class ViewsModule { }
