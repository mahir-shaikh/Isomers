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
import { CompanyDecisionsComponent } from './company/company.component';
import { ForecastingComponent } from './forecasting/forecasting.component';
import { SkuDecisionsComponent } from './skudecisions/skudecisions.component';
import { SlotsComponent } from './slots/slots.component';
import { SlotRowComponent } from './slotrow/slotrow.component';
import { CustomerReportComponent } from './customerreport/customerreport.component';
import { TotalIncomeStatementComponent } from './totalincomestatement/totalincomestatement.component';
import { IncomeStatementComponent } from './incomestatement/incomestatement.component';
import { AssortementAnalysisComponent } from './assortementanalysis/assortementanalysis.component';
import { PromotionAnalysisComponent } from './promotionanalysis/promotionanalysis.component';
import { DecisionSummaryComponent } from './decisionsummary/decisionsummary.component';
import { DecisionSummaryDataComponent } from './decisionsummarydata/decisionsummarydata.component';


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
        CompanyDecisionsComponent,
        ForecastingComponent,
        SkuDecisionsComponent,
        SlotsComponent,
        SlotRowComponent,
        CustomerReportComponent,
        TotalIncomeStatementComponent,
        IncomeStatementComponent,
        AssortementAnalysisComponent,
        PromotionAnalysisComponent,
        DecisionSummaryComponent,
        DecisionSummaryDataComponent
    ],
    exports: [
        IntroComponent,
        DashboardComponent,
        CompanyDecisionsComponent,
        SkuDecisionsComponent,
        ForecastingComponent,
        SlotsComponent,
        SlotRowComponent,
        CustomerReportComponent,
        TotalIncomeStatementComponent,
        IncomeStatementComponent,
        AssortementAnalysisComponent,
        PromotionAnalysisComponent,
        DecisionSummaryComponent,
        DecisionSummaryDataComponent
    ],
    providers: [DataStore, FileSaver]
})
export class ViewsModule { }
