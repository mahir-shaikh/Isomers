import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonutComponent } from './donut'
import { CalcService } from '../../calcmodule';
import { CalcServiceStub } from '../../calcmodule/calcstub.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { TextEngineServiceStub } from '../../textengine/textenginestub.service';
import { ChartDefaults } from '../chartdefaults';
import * as Highcharts from 'highcharts';

describe('Donut Chart ', () => {

    let component: DonutComponent;
    let fixture: ComponentFixture < DonutComponent > ;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [DonutComponent],
            providers: [{ provide: CalcService, useClass: CalcServiceStub }, { provide: TextEngineService, useClass: TextEngineServiceStub }, { provide: ChartDefaults, useClass: ChartDefaults }]
        });

        fixture = TestBed.createComponent(DonutComponent);
        component = fixture.componentInstance;
    });

    it("it should make Donut chart", () => {
        expect(component instanceof DonutComponent).toBe(true, 'should create WaterfallComponent');
    });
    it("it should call processChartInputs", () => {
        spyOn(component, "processChartInputs")
        component.ngOnInit();
        expect(component.processChartInputs).toHaveBeenCalled();
    });
    it("it should set localSeriesLabels", () => {
        component.processChartInputs();
        expect(component.getLocalSeriesLabels()).toEqual(['']);
    });
    it("it should create chart", () => {
        component.rangeRef = "2,3,4";
        component.seriesLabels = "2,3,4";
        component.ngOnInit();
        expect(component.getChart()).toBeDefined();
    });
    it("it should not create chart", () => {
        component.rangeRef = "";
        component.seriesLabels = "";
        component.chartOptions =' "tooltip": { "useHTML": "true", "pointFormat": "Volume : {point.x} </br> Price : {point.y} </br> Size : {point.z} ",  "followPointer": "true" } ';

        component.ngOnInit();
        expect(component.chartNotRender).toEqual("couldn't render chart");
    });
    it("it should destroy observer", () => {
        component.ngOnDestroy();
        expect(component.getObserver()).toBeUndefined();
    });

});
