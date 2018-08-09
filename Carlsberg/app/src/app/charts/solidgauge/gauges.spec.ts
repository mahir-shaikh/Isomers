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
import { GaugeComponent } from './gauges';


describe('Solid Gauges chart', () => {
    let gaugeComponent;
    let myService : any;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations:[GaugeComponent],
            providers:[{ provide: CalcService, useClass:CalcServiceStub  }, { provide: TextEngineService, useClass:TextEngineServiceStub  }, ChartDefaults]
        }).compileComponents();
        gaugeComponent = TestBed.createComponent(GaugeComponent);
        myService = TestBed.get(CalcService);
    });
    it("it should make solid gauge chart",() => {
        expect(gaugeComponent.componentInstance instanceof GaugeComponent).toBe(true, 'should create gaugeComponent');
    });
    it("it should create chart",() => {
        // spyOn(myService, "getApi")
        gaugeComponent.componentInstance.rangeref="1";
        gaugeComponent.componentInstance.ngOnInit();
        expect(gaugeComponent.componentInstance.chart).toBeDefined();
    });   
    it("it should not create chart",() => {
        // spyOn(myService, "getApi")
        gaugeComponent.componentInstance.rangeref="a";
        // gaugeComponent.componentInstance.year="0,0a";
        gaugeComponent.componentInstance.chartOptions='"tooltip": { "useHTML": "true", "pointFormat": "Volume : {point.x} </br> Price : {point.y} </br> Size : {point.z} ",  "followPointer": "true" } }';
        gaugeComponent.componentInstance.ngOnInit();
        expect(gaugeComponent.componentInstance.chartNotRender).toEqual("Could not render chart due to data issues");
    }); 
    it("it should destroy observer",() => {
        // spyOn(myService, "getApi")Init
        gaugeComponent.componentInstance.ngOnDestroy();
        expect(gaugeComponent.componentInstance.observer).toBeUndefined();
    });
});
