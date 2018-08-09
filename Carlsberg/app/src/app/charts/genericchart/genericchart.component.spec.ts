import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenericChartComponent } from './genericchart.component'
import { CalcService} from '../../calcmodule';
import { CalcServiceStub } from '../../calcmodule/calcstub.service';
import { TextEngineService } from '../../textengine/textengine.service';
import { TextEngineServiceStub } from '../../textengine/textenginestub.service';
import { ChartDefaults } from '../chartdefaults';
import * as Highcharts from 'highcharts';

describe('Generic Chart ', () => {

    let component: GenericChartComponent;
    let fixture: ComponentFixture < GenericChartComponent > ;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [GenericChartComponent],
            providers: [{ provide: CalcService, useClass: CalcServiceStub }, { provide: TextEngineService, useClass: TextEngineServiceStub }, { provide: ChartDefaults, useClass: ChartDefaults }]
        });

        fixture = TestBed.createComponent(GenericChartComponent);
        component = fixture.componentInstance;
    });

    it("it should make Generic chart", () => {
        expect(component instanceof GenericChartComponent).toBe(true, 'should create WaterfallComponent');
    });
    it("it should call processComponentInputs", () => {
        spyOn(component, "processComponentInputs")
        component.type = "bar";
        component.ngOnInit();
        expect(component.processComponentInputs).toHaveBeenCalled();
    });
    it("it should set localSeriesLabels", () => {
        component.type = "bar";
        component.serieslabels = "1,2,3";
        component.rangeRef = "1,2,3";
        component.processComponentInputs();
        expect(component.getLocalSeriesLabels().length).toBeGreaterThan(0);
    });
    it("it should create chart", () => {
        component.rangeRef = "2,3,4";
        component.serieslabels = "2,3,4";
        component.type = "bar";
        component.ngOnInit();
        expect(component.getChart()).toBeDefined();
    });
    it("it should not create chart", () => {

        component.rangeRef = "";
        component.serieslabels = "";
        component.type = "bar";
        component.chartoptions = ' "tooltip": { "useHTML": "true", "pointFormat": "Volume : {point.x} </br> Price : {point.y} </br> Size : {point.z} ",  "followPointer": "true" } ';

        component.ngOnInit();
        expect(component.chartNotRender).toEqual("couldn't render chart");
    });
    it("it should destroy observer", () => {
        component.ngOnDestroy();
        expect(component.getObserver()).toBeUndefined();
    });
    it("it should not process anthing", () => {
        spyOn(component, "processComponentInputs")
        component.ngOnInit();
        expect(component.processComponentInputs).not.toHaveBeenCalled();
    });


});
