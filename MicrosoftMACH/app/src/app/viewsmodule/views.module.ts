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
import { HammerConfig} from './hammerjsconfig/HammerConfig';
import { TopNavbarComponent } from './topnavbar/topnavbar.component';
import { ERPlatformDataComponent } from './erplatformdata/erplatformdata.component';
import { ERProductDataComponent} from './erproductdata/erproductdata.component';
import { OpsOperationDataComponent } from './opsoperationdata/opsoperationdata.component';
import { OpsInfrastructureData } from './opsinfrastructuredata/opsinfrastructuredata.component';
import { PNLComponent } from './pnl/pnl.component';
import { PricingForecastingDataComponent } from './pricingforecastingdata/pricingforecastingdata.component';
import { TalentDevelopmentDataComponent } from './talentdevelopmentdata/talentdevelopmentdata.component';
import { SalesServiceDataComponent } from './salesservicedata/salesservicedata.component';
import { PartnerDataComponent } from './partnerdata/partnerdata.component';
import { OpsMarketingDataComponent } from './opsmarketingdata/opsmarketingdata.component';
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
        TopNavbarComponent,
        ERPlatformDataComponent,
        ERProductDataComponent,
        OpsOperationDataComponent,
        OpsInfrastructureData,
        OpsMarketingDataComponent,
        PricingForecastingDataComponent,
        TalentDevelopmentDataComponent,
        SalesServiceDataComponent,
        PartnerDataComponent,
        PNLComponent,
        ClickOutsideDirective
],
    exports: [
        IntroComponent,
        DashboardComponent,
        TopNavbarComponent,
        ERPlatformDataComponent,
        ERProductDataComponent,
        OpsOperationDataComponent,
        OpsInfrastructureData,
        OpsMarketingDataComponent,
        PricingForecastingDataComponent,
        TalentDevelopmentDataComponent,
        SalesServiceDataComponent,
        PartnerDataComponent,
        PNLComponent,
        ClickOutsideDirective
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
