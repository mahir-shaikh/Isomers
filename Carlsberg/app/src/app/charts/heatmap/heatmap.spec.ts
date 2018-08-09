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
import { HeatMapComponent } from './heatmap';


describe('Heat map chart', () => {
    let heatComponent;
    let myService : any;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations:[HeatMapComponent],
            providers:[{ provide: CalcService, useClass:CalcServiceStub  }, { provide: TextEngineService, useClass:TextEngineServiceStub  }, ChartDefaults]
        }).compileComponents();
        heatComponent = TestBed.createComponent(HeatMapComponent);
        myService = TestBed.get(CalcService);
    });
    it("it should make heat chart",() => {
        expect(heatComponent.componentInstance instanceof HeatMapComponent).toBe(true, 'should create heatComponent');
    });
    it("it should call processComponentInputs",() => {
        spyOn(heatComponent.componentInstance, "processComponentInputs")
        heatComponent.componentInstance.ngOnInit();
        expect(heatComponent.componentInstance.processComponentInputs).toHaveBeenCalled();
    });
    it("it should set localCategoryLabels",() => {
        spyOn(heatComponent.componentInstance, "localCategoryLabelsArray");
        heatComponent.componentInstance.processComponentInputs();
        expect(heatComponent.componentInstance.localCategoryLabelsArray).toEqual(['']);
    });    
    it("it should create chart",() => {
        // spyOn(myService, "getApi")
        heatComponent.componentInstance.rangeref="1,2,3,4,5,6,7,8,9";
        heatComponent.componentInstance.categorylabels="2,3,4";
        heatComponent.componentInstance.serieslabels="2,3,4";
        heatComponent.componentInstance.ngOnInit();
        expect(heatComponent.componentInstance.chart).toBeDefined();
    });   
    it("it should not create chart",() => {
        // spyOn(myService, "getApi")
        heatComponent.componentInstance.rangeref="a";
        heatComponent.componentInstance.categorylabels='';
        heatComponent.componentInstance.numberformat="0,0a";
        // heatComponent.componentInstance.year="0,0a";
        heatComponent.componentInstance.serieslabels='a';
        heatComponent.componentInstance.chartoptions='"tooltip": { "useHTML": "true", "pointFormat": "Volume : {point.x} </br> Price : {point.y} </br> Size : {point.z} ",  "followPointer": "true" } }';
        heatComponent.componentInstance.ngOnInit();
        expect(heatComponent.componentInstance.chartNotRender).toEqual("Could not render chart due to data issues");
    }); 
    it("it should destroy observer",() => {
        // spyOn(myService, "getApi")Init
        heatComponent.componentInstance.ngOnDestroy();
        expect(heatComponent.componentInstance.observer).toBeUndefined();
    });
});
