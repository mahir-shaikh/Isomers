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
import { RegionTeritoryComponent } from './regionteritory/regionteritory.component';
import { RegionTeritoryDataComponent } from './regionteritorydata/regionteritorydata.component';
import { PerformanceDashboardComponent } from './performancedashboard/performancedashboard.component';

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
        RegionTeritoryComponent,
        RegionTeritoryDataComponent,
        PerformanceDashboardComponent
    ],
    exports: [
        IntroComponent,
        DashboardComponent,
        RegionTeritoryComponent,
        RegionTeritoryDataComponent,
        PerformanceDashboardComponent
    ],
    providers: [DataStore, FileSaver]
})
export class ViewsModule { }
