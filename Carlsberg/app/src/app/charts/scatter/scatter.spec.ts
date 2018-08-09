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
import { ScatterComponent } from './scatter';


describe('scatter chart', () => {
    let scatterComponent;
    let myService : any;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations:[ScatterComponent],
            providers:[{ provide: CalcService, useClass:CalcServiceStub  }, { provide: TextEngineService, useClass:TextEngineServiceStub  }, ChartDefaults]
        }).compileComponents();
        scatterComponent = TestBed.createComponent(ScatterComponent);
        myService = TestBed.get(CalcService);
    });
    it("it should make scatter chart",() => {
        expect(scatterComponent.componentInstance instanceof ScatterComponent).toBe(true, 'should create scatterComponent');
    });
    it("it should call processComponentInputs",() => {
        spyOn(scatterComponent.componentInstance, "processComponentInputs")
        scatterComponent.componentInstance.initializeModel();
        expect(scatterComponent.componentInstance.processComponentInputs).toHaveBeenCalled();
    });
    it("it should set localCategoryLabels",() => {
        spyOn(scatterComponent.componentInstance, "localCategoryLabelsArray");
        scatterComponent.componentInstance.processComponentInputs();
        expect(scatterComponent.componentInstance.localCategoryLabelsArray).toEqual(['']);
    });    
    it("it should create chart",() => {
        // spyOn(myService, "getApi")
        scatterComponent.componentInstance.rangeref="1,2,3,4,5,6,7,8,9";
        scatterComponent.componentInstance.categorylabels="2,3,4";
        scatterComponent.componentInstance.serieslabels="2,3,4";
        scatterComponent.componentInstance.ngOnInit();
        expect(scatterComponent.componentInstance.chart).toBeDefined();
    });   
    it("it should not create chart",() => {
        // spyOn(myService, "getApi")
        scatterComponent.componentInstance.rangeref="a";
        scatterComponent.componentInstance.categorylabels='';
        scatterComponent.componentInstance.numberformat="0,0a";
        // scatterComponent.componentInstance.year="0,0a";
        scatterComponent.componentInstance.serieslabels='a';
        scatterComponent.componentInstance.chartoptions='"tooltip": { "useHTML": "true", "pointFormat": "Volume : {point.x} </br> Price : {point.y} </br> Size : {point.z} ",  "followPointer": "true" } }';
        scatterComponent.componentInstance.initializeModel();
        expect(scatterComponent.componentInstance.chartNotRender).toEqual("Could not render chart due to data issues");
    }); 
    it("it should destroy observer",() => {
        // spyOn(myService, "getApi")Init
        scatterComponent.componentInstance.ngOnDestroy();
        expect(scatterComponent.componentInstance.observer).toBeUndefined();
    });
});
