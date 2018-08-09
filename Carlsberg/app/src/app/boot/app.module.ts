import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { CalcModule } from '../calcmodule/calc.module';
import { HttpModule } from '@angular/http';
import { routing } from './app.routing';
import { DataAdaptorModule } from '../dataadaptor/data-adaptor.module';
import { ViewsModule } from '../viewsmodule/views.module';
import { ChartsModule } from '../charts/charts.module';
import { Utils, CsvFileReaderService } from '../utils';
import { ConnectModule } from '../connect/connect.module';
import { ComponentLoaderFactory } from 'ng2-bootstrap/component-loader';
import { TabsModule, ButtonsModule, DropdownModule, ModalModule, CarouselModule, TooltipModule, AccordionModule } from 'ng2-bootstrap';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        CalcModule,
        DataAdaptorModule,
        routing,
        ViewsModule,
        ConnectModule,
        ChartsModule.forRoot(require('highcharts'), require('highcharts/highcharts-more'), require('highcharts/modules/solid-gauge'), require('highcharts/modules/heatmap'), require('highcharts/modules/exporting')),
        TabsModule.forRoot(), 
        ButtonsModule.forRoot(), 
        DropdownModule.forRoot(), 
        ModalModule.forRoot(), 
        CarouselModule.forRoot(), 
        TooltipModule.forRoot(), 
        AccordionModule.forRoot()
    ],
    declarations: [
        AppComponent
    ],
    providers: [Utils, ComponentLoaderFactory, CsvFileReaderService],
    bootstrap: [AppComponent]
})
export class AppModule { }
