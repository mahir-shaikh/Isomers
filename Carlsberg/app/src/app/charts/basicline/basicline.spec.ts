import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasicLineComponent } from './basicline'
import { CalcService } from '../../calcmodule';
import { CalcServiceStub } from '../../calcmodule/calcstub.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { TextEngineServiceStub } from '../../textengine/textenginestub.service';
import { ChartDefaults } from '../chartdefaults';
import * as Highcharts from 'highcharts';

describe('BasicLine Chart ', () => {

    let component: BasicLineComponent;
    let fixture: ComponentFixture < BasicLineComponent > ;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [BasicLineComponent],
            providers: [{ provide: CalcService, useClass: CalcServiceStub }, { provide: TextEngineService, useClass: TextEngineServiceStub }, { provide: ChartDefaults, useClass: ChartDefaults }]
        });

        fixture = TestBed.createComponent(BasicLineComponent);
        component = fixture.componentInstance;
    });

    it("it should make waterfall chart", () => {
        expect(component instanceof BasicLineComponent).toBe(true, 'should create BasicLineComponent');
    });
    it("it should call processChartInputs", () => {
        spyOn(component, "processChartInputs")
        component.ngOnInit();
        expect(component.processChartInputs).toHaveBeenCalled();
    });
    it("it should set localCategoryLabels", () => {
        component.processChartInputs();
        expect(component.getLocalCategoryLabels()).toEqual(['']);
    });
    it("it should create chart", () => {
        component.rangeref = "2,3,4";
        component.categorylabels = "2,3,4";
        component.serieslabels = "2,3,4";
        component.ngOnInit();
        expect(component.getChart()).toBeDefined();
    });
    it("it should not create chart", () => {
        component.rangeref = "";
        component.categorylabels = "";
        component.serieslabels = "";
        component.chartoptions =' "tooltip": { "useHTML": "true", "pointFormat": "Volume : {point.x} </br> Price : {point.y} </br> Size : {point.z} ",  "followPointer": "true" } ';

        component.ngOnInit();
        expect(component.chartNotRender).toEqual("couldn't render chart");
    });
    it("it should destroy observer", () => {
        component.ngOnDestroy();
        expect(component.getObserver()).toBeUndefined();
    });

});
