import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalcSlider } from './calcslider'
import { CalcService } from '../../calcmodule';
import { CalcServiceStub } from '../../calcmodule/calcstub.service';
import { NumberFormattingPipe } from '../number-formatting.pipe';
import { TextEngineService } from '../../textengine/textengine.service';
import { TextEngineServiceStub } from '../../textengine/textenginestub.service';

describe('calc slider ', () => {

    let component: CalcSlider;
    let fixture: ComponentFixture < CalcSlider > ;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [CalcSlider, NumberFormattingPipe],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [{ provide: CalcService, useClass: CalcServiceStub }, { provide: TextEngineService, useClass: TextEngineServiceStub }]
        });

        fixture = TestBed.createComponent(CalcSlider);
        component = fixture.componentInstance;
    });

    it("it should make calc slider", () => {
        expect(component instanceof CalcSlider).toBe(true, 'should create calc slider  component');
    });

    it("it should destroy observer", () => {
        component.ngOnDestroy();
        expect(component.getsubscription()).toBeUndefined();
    });

    it("it should call updateValues and bindEvents", () => {
        spyOn(component, "updateValues");
        spyOn(component, "bindEvents");
        component.min = 1;
        component.max = 5;
        component.ref = "1";
        component.ngOnInit();
        expect(component.updateValues).toHaveBeenCalled();
        expect(component.bindEvents).toHaveBeenCalled();

    });

});
