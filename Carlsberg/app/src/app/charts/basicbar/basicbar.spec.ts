import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasicBarComponent } from './basicbar'
import { CalcService } from '../../calcmodule';
import { CalcServiceStub } from '../../calcmodule/calcstub.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { TextEngineServiceStub } from '../../textengine/textenginestub.service';
import { ChartDefaults } from '../chartdefaults';
import * as Highcharts from 'highcharts';

describe('BasicBar Chart ', () => {

    let component: BasicBarComponent;
    let fixture: ComponentFixture < BasicBarComponent > ;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [BasicBarComponent],
            providers: [{ provide: CalcService, useClass: CalcServiceStub }, { provide: TextEngineService, useClass: TextEngineServiceStub }, { provide: ChartDefaults, useClass: ChartDefaults }]
        });

        fixture = TestBed.createComponent(BasicBarComponent);
        component = fixture.componentInstance;
    });

    it("it should make basicbar chart",() => {
        expect(component instanceof BasicBarComponent).toBe(true, 'should create BasicBarComponent');
    });
    it("it should call processChartInputs",() => {
        spyOn(component, "processChartInputs")
        component.ngOnInit();
        expect(component.processChartInputs).toHaveBeenCalled();
    });
    it("it should set localCategoryLabels",() => {

        component.processChartInputs();
        expect(component.getLocalCategoryLabels()).toEqual(['']);
    });    
    it("it should create chart",() => {
        component.rangeRef="2,3,4";
        component.categoryLabels="2,3,4";
        component.seriesLabels="2,3,4";
        component.ngOnInit();
        expect(component.getChart()).toBeDefined();
    });     
    it("it should not create chart",() => {
        component.rangeRef="";
        component.categoryLabels="";
        component.seriesLabels="";
        // component.numberFormat = "0,0a";
        component.chartOptions=' "tooltip": { "useHTML": true, "pointFormat": "Volume : {point.x} </br> Price : {point.y} </br> Size : {point.z} ",  "followPointer": "true" } ';

        component.ngOnInit();
        expect(component.chartNotRender).toEqual("couldn't render chart");
    }); 
    it("it should destroy observer",() => {
        component.ngOnDestroy();
        expect(component.getObserver()).toBeUndefined();
    });
});
