import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentLoaderFactory } from 'ng2-bootstrap/component-loader';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { Component, Input, ViewChild, Directive, ElementRef, OnInit, OnDestroy, EventEmitter, OnChanges} from '@angular/core';
import { TabsModule, ButtonsModule, DropdownModule, ModalModule, CarouselModule, TooltipModule, AccordionModule } from 'ng2-bootstrap';
import { CalcService } from '../../calcmodule';
import { CalcServiceStub } from '../../calcmodule/calcstub.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { TextEngineServiceStub } from '../../textengine/textenginestub.service';
import * as _ from 'lodash';
import * as numberFormatting from '../../../libs/jsCalc/numberFormatting';
import * as Highcharts from 'highcharts';
import { ChartDefaults } from '../chartdefaults';
import { PieChartComponent } from './piechart';


describe('Pie chart', () => {
    let pieComponent;
    let myService : any;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations:[PieChartComponent],
            providers:[{ provide: CalcService, useClass:CalcServiceStub  }, { provide: TextEngineService, useClass:TextEngineServiceStub  }, ChartDefaults]
        }).compileComponents();
        pieComponent = TestBed.createComponent(PieChartComponent);
        myService = TestBed.get(CalcService);
    });
    it("it should make pie chart",() => {
        expect(pieComponent.componentInstance instanceof PieChartComponent).toBe(true, 'should create pieComponent');
    });
    it("it should call processChartInputs",() => {
        spyOn(pieComponent.componentInstance, "processChartInputs")
        pieComponent.componentInstance.ngOnInit();
        expect(pieComponent.componentInstance.processChartInputs).toHaveBeenCalled();
    });
    it("it should set localCategoryLabels",() => {
        spyOn(pieComponent.componentInstance, "localCategoryLabelsArray");
        pieComponent.componentInstance.processChartInputs();
        expect(pieComponent.componentInstance.localCategoryLabelsArray).toEqual(['']);
    });    
    it("it should create chart",() => {
        // spyOn(myService, "getApi")
        pieComponent.componentInstance.rangeref="1,2,3,4,5,6,7,8,9";
        pieComponent.componentInstance.categorylabels="2,3,4";
        pieComponent.componentInstance.serieslabels="2,3,4";
        pieComponent.componentInstance.ngOnInit();
        expect(pieComponent.componentInstance.chart).toBeDefined();
    });   
    it("it should not create chart",() => {
        // spyOn(myService, "getApi")
        pieComponent.componentInstance.rangeref="a";
        pieComponent.componentInstance.categorylabels='';
        pieComponent.componentInstance.numberformat="0,0a";
        // pieComponent.componentInstance.year="0,0a";
        pieComponent.componentInstance.serieslabels='a';
        pieComponent.componentInstance.chartOptions='"tooltip": { "useHTML": "true", "pointFormat": "Volume : {point.x} </br> Price : {point.y} </br> Size : {point.z} ",  "followPointer": "true" } }';
        pieComponent.componentInstance.ngOnInit();
        expect(pieComponent.componentInstance.chartNotRender).toEqual("Could not render chart due to data issues");
    }); 
    it("it should destroy observer",() => {
        // spyOn(myService, "getApi")Init
        pieComponent.componentInstance.ngOnDestroy();
        expect(pieComponent.componentInstance.observer).toBeUndefined();
    });
});
