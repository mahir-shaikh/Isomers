import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BubbleChartComponent } from './bubblechart'
import { CalcService } from '../../calcmodule';
import { CalcServiceStub } from '../../calcmodule/calcstub.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { TextEngineServiceStub } from '../../textengine/textenginestub.service';
import { ChartDefaults } from '../chartdefaults';
import * as Highcharts from 'highcharts';

describe('Bubble Chart ', () => {

    let component: BubbleChartComponent;
    let fixture: ComponentFixture < BubbleChartComponent > ;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [BubbleChartComponent],
            providers: [{ provide: CalcService, useClass: CalcServiceStub }, { provide: TextEngineService, useClass: TextEngineServiceStub }, { provide: ChartDefaults, useClass: ChartDefaults }]
        });

        fixture = TestBed.createComponent(BubbleChartComponent);
        component = fixture.componentInstance;
    });

    it("it should make bubble chart",() => {
        expect(component instanceof BubbleChartComponent).toBe(true, 'should create BubbleChartComponent');
    });
    it("it should call processChartInputs",() => {
        spyOn(component, "processChartInputs")
        component.initializeChart();
        expect(component.processChartInputs).toHaveBeenCalled();
    });
    it("it should set localCategoryLabels",() => {

        component.processChartInputs();
        expect(component.getLocalSeriesLabels()).toEqual(['']);
    });    
    it("it should create chart",() => {
        component.rangeRefX="2,3,4";
        component.rangeRefY="2,3,4";
        component.rangeRefZ="2,3,4";
        component.seriesLabels="2,3,4";
        component.ngOnInit();
        expect(component.getChart()).toBeDefined();
    });     
    it("it should not create chart",() => {
        component.rangeRefX="";
        component.rangeRefY="";
        component.rangeRefZ="";

        component.seriesLabels="";
        component.chartOptions=' "tooltip": { "useHTML": "true", "pointFormat": "Volume : {point.x} </br> Price : {point.y} </br> Size : {point.z} ",  "followPointer": "true" } ';

        component.ngOnInit();
        expect(component.chartNotRender).toEqual("couldn't render chart");
    }); 
    it("it should destroy observer",() => {
        component.ngOnDestroy();
        expect(component.getObserver()).toBeUndefined();
    });
});
