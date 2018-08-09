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
import { StackedColumnComponent } from './stackedcolumn';


describe('Stack Column chart', () => {
    let stackedColumnComponent;
    let myService : any;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations:[StackedColumnComponent],
            providers:[{ provide: CalcService, useClass:CalcServiceStub  }, { provide: TextEngineService, useClass:TextEngineServiceStub  }, ChartDefaults]
        }).compileComponents();
        stackedColumnComponent = TestBed.createComponent(StackedColumnComponent);
        myService = TestBed.get(CalcService);
    });
    it("it should make stacked column chart",() => {
        expect(stackedColumnComponent.componentInstance instanceof StackedColumnComponent).toBe(true, 'should create stackedColumnComponent');
    });
    it("it should call processComponentInputs",() => {
        spyOn(stackedColumnComponent.componentInstance, "processComponentInputs")
        stackedColumnComponent.componentInstance.InitializeModel();
        expect(stackedColumnComponent.componentInstance.processComponentInputs).toHaveBeenCalled();
    });
    it("it should set localCategoryLabels",() => {
        spyOn(stackedColumnComponent.componentInstance, "localCategoryLabelsArray");
        stackedColumnComponent.componentInstance.processComponentInputs();
        expect(stackedColumnComponent.componentInstance.localCategoryLabelsArray).toEqual(['']);
    });    
    it("it should create chart",() => {
        // spyOn(myService, "getApi")
        stackedColumnComponent.componentInstance.rangeref="1,2,3,4,5,6,7,8,9";
        stackedColumnComponent.componentInstance.categorylabels="2,3,4";
        stackedColumnComponent.componentInstance.serieslabels="2,3,4";
        stackedColumnComponent.componentInstance.ngOnInit();
        expect(stackedColumnComponent.componentInstance.chart).toBeDefined();
    });   
    it("it should not create chart",() => {
        // spyOn(myService, "getApi")
        stackedColumnComponent.componentInstance.rangeref="a";
        stackedColumnComponent.componentInstance.categorylabels='';
        stackedColumnComponent.componentInstance.numberformat="0,0a";
        // stackedColumnComponent.componentInstance.year="0,0a";
        stackedColumnComponent.componentInstance.serieslabels='a';
        stackedColumnComponent.componentInstance.chartoptions='"tooltip": { "useHTML": "true", "pointFormat": "Volume : {point.x} </br> Price : {point.y} </br> Size : {point.z} ",  "followPointer": "true" } }';
        stackedColumnComponent.componentInstance.InitializeModel();
        expect(stackedColumnComponent.componentInstance.chartNotRender).toEqual("Could not render chart due to data issues");
    }); 
    it("it should destroy observer",() => {
        // spyOn(myService, "getApi")Init
        stackedColumnComponent.componentInstance.ngOnDestroy();
        expect(stackedColumnComponent.componentInstance.observer).toBeUndefined();
    });
});
