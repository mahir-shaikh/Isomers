import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalcStepper } from './calcstepper'
import { CalcService } from '../../calcmodule';
import { CalcServiceStub } from '../../calcmodule/calcstub.service';
import { NumberFormattingPipe } from '../number-formatting.pipe';
import { TextEngineService } from '../../textengine/textengine.service';
import { TextEngineServiceStub } from '../../textengine/textenginestub.service';

describe('calc stepper ', () => {

    let component: CalcStepper;
    let fixture: ComponentFixture < CalcStepper > ;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [CalcStepper, NumberFormattingPipe],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [{ provide: CalcService, useClass: CalcServiceStub }, { provide: TextEngineService, useClass: TextEngineServiceStub }]
        });

        fixture = TestBed.createComponent(CalcStepper);
        component = fixture.componentInstance;
    });

    it("it should make calc stepper", () => {
        expect(component instanceof CalcStepper).toBe(true, 'should create calc stepper  component');
    });

    it("it should destroy observer", () => {
        component.ngOnDestroy();
        expect(component.getObservable()).toBeUndefined();
    });

    it("it should call updateValues and bindEvents", () => {
        component.min = 1;
        component.max = 5;
        component.ref = "1";
        component.ngOnInit();
        component.ngAfterViewInit();
        component.onStepperButtonClick("2");
        expect(component.getValue()).toEqual("2");

    });



});
