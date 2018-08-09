import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentLoaderFactory } from 'ng2-bootstrap/component-loader';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { Component, Input, ViewChild, Directive, ElementRef, OnInit, OnDestroy, EventEmitter, OnChanges} from '@angular/core';
import { CalcService } from '../../calcmodule';
import { CalcServiceStub } from '../../calcmodule/calcstub.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { TextEngineServiceStub } from '../../textengine/textenginestub.service';
import * as _ from 'lodash';
import * as numberFormatting from '../../../libs/jsCalc/numberFormatting';
import * as Highcharts from 'highcharts';
import { ChartDefaults } from '../chartdefaults';
import { WaterfallColumnComponent } from './waterfall';


describe('Waterfall', () => {
    let waterfallComponent;
    let myService : any;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations:[WaterfallColumnComponent],
            providers:[{ provide: CalcService, useClass:CalcServiceStub  }, { provide: TextEngineService, useClass:TextEngineServiceStub  }, ChartDefaults]
        }).compileComponents();
        waterfallComponent = TestBed.createComponent(WaterfallColumnComponent);
        myService = TestBed.get(CalcService);
    });
    it("it should make waterfall chart",() => {
        expect(waterfallComponent.componentInstance instanceof WaterfallColumnComponent).toBe(true, 'should create WaterfallComponent');
    });
    it("it should call processComponentInputs",() => {
        spyOn(waterfallComponent.componentInstance, "processComponentInputs")
        waterfallComponent.componentInstance.initializeModel();
        expect(waterfallComponent.componentInstance.processComponentInputs).toHaveBeenCalled();
    });
    it("it should set localCategoryLabels",() => {
        spyOn(waterfallComponent.componentInstance, "localCategoryLabelsArray");
        waterfallComponent.componentInstance.processComponentInputs();
        expect(waterfallComponent.componentInstance.localCategoryLabelsArray).toEqual(['']);
    });    
    it("it should create chart",() => {
        // spyOn(myService, "getApi")
        waterfallComponent.componentInstance.rangeref="2,3,4";
        waterfallComponent.componentInstance.categorylabels="2,3,4";
        waterfallComponent.componentInstance.serieslabels="2,3,4";
        waterfallComponent.componentInstance.ngOnInit();
        expect(waterfallComponent.componentInstance.chart).toBeDefined();
    });     
    it("it should not create chart",() => {
        // spyOn(myService, "getApi")
        waterfallComponent.componentInstance.rangeref="Nan";
        waterfallComponent.componentInstance.categorylabels="2";
        waterfallComponent.componentInstance.serieslabels="2";
        waterfallComponent.componentInstance.numberformat="0";

        // waterfallComponent.componentInstance.chartoptions='"tooltip": { "useHTML": "true", "pointFormat": "Volume : {point.x} </br> Price : {point.y} </br> Size : {point.z} ",  "followPointer": "true" } }';

        waterfallComponent.componentInstance.initializeModel();
        expect(waterfallComponent.componentInstance.chartNotRender).toEqual("couldn't render chart");
    }); 
    it("it should destroy observer",() => {
        // spyOn(myService, "getApi")Init
        waterfallComponent.componentInstance.ngOnDestroy();
        expect(waterfallComponent.componentInstance.observer).toBeUndefined();
    });
});
