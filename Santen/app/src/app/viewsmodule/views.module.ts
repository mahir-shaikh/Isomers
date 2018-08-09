import { NgModule } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CalcModule } from '../calcmodule/calc.module';
import { TextEngineModule } from '../textengine/text.module';
import { TabsModule, ButtonsModule, DropdownModule, ModalModule, CarouselModule, TooltipModule, AccordionModule } from 'ng2-bootstrap';
import { ChartsModule } from '../charts/charts.module';
import { ConnectModule } from '../connect/connect.module';
import { SharedModule } from '../shared/shared.module';
import { MyDatePickerModule } from 'mydatepicker';

// load isomer app components
import { LandingPageComponent } from './landingpage/landingpage.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TextareaComponent } from './textarea/textarea';
import { SceanrioDataComponent } from './scenariodata/scenariodata.component';
import { SceanrioComponent } from './scenario/scenario.component';
import { PrintComponent } from './print/print';
import { DevelopmentPlanComponent } from './developmentplan/development.plan.component';
import { DevelopmentPlanDetailsComponent } from './developmentplandetails/development.plan.details.component';
import { MyDatePickerComponent } from './datepicker/datepicker';
import { EmailDirective } from './emaildirective/emaildirective';
import { NotesComponent } from './notes/notes.component';
import { ActionsComponent } from './actions/action.component';
import { ReportsComponent } from './reports/report.component';
import { CommitmentRowComponent } from './commitmentrow/commitmentrow.component';
import { SceanrioTableComponent } from './scenariotable/scenariotable.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        MyDatePickerModule,
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
        LandingPageComponent,
        DashboardComponent,
        DevelopmentPlanComponent,
        TextareaComponent,
        SceanrioDataComponent,
        SceanrioComponent,
        PrintComponent,
        MyDatePickerComponent,
        EmailDirective,
        DevelopmentPlanDetailsComponent,
        NotesComponent,
        ActionsComponent,
        ReportsComponent,
        CommitmentRowComponent,
        SceanrioTableComponent
    ],
    exports: [
        LandingPageComponent,
        DashboardComponent,
        DevelopmentPlanComponent,
        TextareaComponent,
        SceanrioDataComponent,
        SceanrioComponent,
        PrintComponent,
        MyDatePickerComponent,
        DevelopmentPlanDetailsComponent,
        NotesComponent,
        ActionsComponent,
        ReportsComponent,
        CommitmentRowComponent,
        SceanrioTableComponent
    ],
    providers: []
})
export class ViewsModule { }


export { DevelopmentPlanComponent } from './developmentplan/development.plan.component';
export { SceanrioComponent } from './scenario/scenario.component';
export { MyDatePickerComponent } from './datepicker/datepicker';
export { ActionsComponent } from './actions/action.component';
export { ReportsComponent } from './reports/report.component';
