import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
// import { SplashComponent } from '../splash/splash.component';
// import { DashboardComponent } from '../dashboard/dashboard.component';
import { CalcModule } from '../calcmodule/calc.module';
import { HttpModule } from '@angular/http';
import { routing, appRoutingProviders } from './app.routing';
import { DataAdaptorModule } from '../dataadaptor/data-adaptor.module';
// import { PlanningToolDash } from '../planningtool/planning-tool-dashboard';
import { ViewsModule } from '../viewsmodule/views.module';
import { Utils, DataStore, FileSaver } from '../utils/utils';
import { ConnectModule } from '../connect/connect.module';
import { TabsModule, DropdownModule } from 'ng2-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { ComponentLoaderFactory } from 'ng2-bootstrap/component-loader';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        CalcModule,
        DataAdaptorModule,
        routing,
        ViewsModule,
        TabsModule.forRoot(),
        DropdownModule,SharedModule,
        ConnectModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [appRoutingProviders, Utils, DataStore, FileSaver, ComponentLoaderFactory],
    bootstrap: [AppComponent]
})
export class AppModule { }
