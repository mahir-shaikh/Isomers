import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ViewsModule } from '../viewsmodule/views.module';
import { ConnectModule } from '../connect/connect.module';
import { Utils, CsvFileReaderService } from '../utils';
import { ComponentLoaderFactory } from 'ng2-bootstrap/component-loader';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { routing } from './app.routing';
import { CalcModule } from '../calcmodule/calc.module';
import { DataAdaptorModule } from '../dataadaptor/data-adaptor.module';
import { SharedModule } from '../shared/shared.module';
import { BrowserModule }  from '@angular/platform-browser';
import { ChartsModule } from '../charts/charts.module';
import { TabsModule, ButtonsModule, DropdownModule, ModalModule, CarouselModule, TooltipModule, AccordionModule } from 'ng2-bootstrap';

describe('App', () => {
    beforeEach(() => {
        TestBed.configureTestingModule(
            { 
                declarations: [AppComponent],
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
                    AccordionModule.forRoot()],
                providers: [Utils, ComponentLoaderFactory, CsvFileReaderService] 
            }
        );
    });
    it('should work', () => {
        let fixture = TestBed.createComponent(AppComponent);
        expect(fixture.componentInstance instanceof AppComponent).toBe(true, 'should create AppComponent');
    });
});
