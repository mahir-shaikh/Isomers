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
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG }  from '@angular/platform-browser';

// load isomer app components
import { IntroComponent } from './intro/intro.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardGraphComponent } from './dashboardgraph/dashboardgraph.component';
import { DashboardMetricsComponent } from './dashboardmetrics/dashboardmetrics.component';
import { IntegrationPlanningTableComponent } from './integrationplanningtable/integrationplanningtable.component';
import { PeopleDataComponent } from './peopledata/peopledata.component';
import { BackOfficeDataComponent } from './backofficedata/backofficedata.component';
import { GtmDataComponent } from './gtmdata/gtmdata.component';
import { ProductDataComponent } from './productdata/productdata.component';
import { TimelineBudgetDataComponent } from './timelinebudgetdata/timelinebudgetdata.component';
import { IntegrationPlanStratergyComponent } from './integrationplanstratergy/integrationplanstratergy.component';
import { IntegrationPlanComponent } from './integrationplan/integrationplan.component';
import { TextareaComponent } from './textarea/textarea';
import { ScenarioDataComponent } from './scenariodata/scenariodata.component';
import { ScenarioComponent } from './scenario/scenario.component';
import { ClickOutsideDirective } from './clickoutsidedirective/clickoutside.directive';
import { EndScreenComponent } from './endscreen/endscreen.component';



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
        ModalModule,
        CarouselModule,
        DropdownModule,
        TooltipModule,
        AccordionModule,
        ConnectModule,
        SharedModule,
        ChartsModule
    ],
    declarations: [
        IntroComponent,
        DashboardComponent,
        DashboardGraphComponent,
        IntegrationPlanningTableComponent,
        PeopleDataComponent,
        BackOfficeDataComponent,
        GtmDataComponent,
        ProductDataComponent,
        TimelineBudgetDataComponent,
        IntegrationPlanStratergyComponent,
        IntegrationPlanComponent,
        TextareaComponent,
        DashboardMetricsComponent,
        ScenarioDataComponent,
        ScenarioComponent,
        ClickOutsideDirective,
        EndScreenComponent
],
    exports: [
        IntroComponent,
        DashboardComponent,
        DashboardGraphComponent,
        IntegrationPlanningTableComponent,
        PeopleDataComponent,
        BackOfficeDataComponent,
        GtmDataComponent,
        ProductDataComponent,
        TimelineBudgetDataComponent,
        IntegrationPlanStratergyComponent,
        IntegrationPlanComponent,
        TextareaComponent,
        DashboardMetricsComponent,
        ScenarioDataComponent,
        ScenarioComponent,
        ClickOutsideDirective,
        EndScreenComponent
    ],
    providers: [
        DataStore,
        FileSaver]
})
export class ViewsModule { }
 