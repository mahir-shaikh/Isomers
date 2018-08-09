import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentLoaderFactory } from 'ng2-bootstrap/component-loader';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { Component, Input, ViewChild, Directive, ElementRef, OnInit, OnDestroy, EventEmitter, OnChanges} from '@angular/core';
import { TabsModule, ButtonsModule, DropdownModule, ModalModule, CarouselModule, TooltipModule, AccordionModule } from 'ng2-bootstrap';
import { CalcService} from '../../calcmodule';
import { CalcServiceStub } from '../../calcmodule/calcstub.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { TextEngineServiceStub } from '../../textengine/textenginestub.service';
import * as _ from 'lodash';
import * as numberFormatting from '../../../libs/jsCalc/numberFormatting';
import * as Highcharts from 'highcharts';
import { ChartDefaults } from '../chartdefaults';
import { StackedBarComponent } from './stackedbar';


describe('Stack Bar chart', () => {
    let stackedBarComponent;
    let myService : any;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations:[StackedBarComponent],
            providers:[{ provide: CalcService, useClass:CalcServiceStub  }, { provide: TextEngineService, useClass:TextEngineServiceStub  }, ChartDefaults]
        }).compileComponents();
        stackedBarComponent = TestBed.createComponent(StackedBarComponent);
        myService = TestBed.get(CalcService);
    });
    it("it should make stacked bar chart",() => {
        expect(stackedBarComponent.componentInstance instanceof StackedBarComponent).toBe(true, 'should create stackedBarComponent');
    });
    it("it should call processComponentInputs",() => {
        spyOn(stackedBarComponent.componentInstance, "processComponentInputs")
        stackedBarComponent.componentInstance.InitializeModel();
        expect(stackedBarComponent.componentInstance.processComponentInputs).toHaveBeenCalled();
    });
    it("it should set localCategoryLabels",() => {
        stackedBarComponent.componentInstance.ngOnInit();
        expect(stackedBarComponent.componentInstance.localCategoryLabelsArray).toEqual(['']);
    });    
    it("it should create chart",() => {
        // spyOn(myService, "getApi")
        stackedBarComponent.componentInstance.rangeref="1,2,3,4,5,6,7,8,9";
        stackedBarComponent.componentInstance.categorylabels="2,3,4";
        stackedBarComponent.componentInstance.serieslabels="2,3,4";
        stackedBarComponent.componentInstance.ngOnInit();
        expect(stackedBarComponent.componentInstance.chart).toBeDefined();
    });   
    it("it should not create chart",() => {
        // spyOn(myService, "getApi")
        stackedBarComponent.componentInstance.rangeref="a";
        stackedBarComponent.componentInstance.categorylabels='';
        stackedBarComponent.componentInstance.numberformat="0,0a";
        // stackedBarComponent.componentInstance.year="0,0a";
        stackedBarComponent.componentInstance.serieslabels='a';
        stackedBarComponent.componentInstance.chartoptions='"tooltip": { "useHTML": "true", "pointFormat": "Volume : {point.x} </br> Price : {point.y} </br> Size : {point.z} ",  "followPointer": "true" } }';
        stackedBarComponent.componentInstance.InitializeModel();
        expect(stackedBarComponent.componentInstance.chartNotRender).toEqual("Could not render chart due to data issues");
    }); 
    it("it should destroy observer",() => {
        // spyOn(myService, "getApi")Init
        stackedBarComponent.componentInstance.ngOnDestroy();
        expect(stackedBarComponent.componentInstance.observer).toBeUndefined();
    });
});
