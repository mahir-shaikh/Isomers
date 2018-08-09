import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalcCheckbox } from './calccheckbox'
import { CalcService } from '../../calcmodule';
import { CalcServiceStub } from '../../calcmodule/calcstub.service';

describe('calc checkbox ', () => {

    let component: CalcCheckbox;
    let fixture: ComponentFixture < CalcCheckbox > ;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [CalcCheckbox],
            providers: [{ provide: CalcService, useClass: CalcServiceStub }]
        });

        fixture = TestBed.createComponent(CalcCheckbox);
        component = fixture.componentInstance;
    });

    it("it should make calc checkbox", () => {
        expect(component instanceof CalcCheckbox).toBe(true, 'should create calccheckbox component');
    });

    it("initial value to be null", () => {
        // component.ngOnInit();
        expect(component.getvalue()).toBeUndefined();
    });

    it("it should call onModelChange", () => {
        spyOn(component, "onModelChange");
        component.ngOnInit();
        expect(component.onModelChange).toHaveBeenCalled();
    });

    it("it should call saveDataToModel", () => {
        spyOn(component, "saveDataToModel");
        component.ref="a";
        component.ngOnInit();
        component.toggleValue();
        expect(component.saveDataToModel).toHaveBeenCalled();
    });

    it("value should change on toggle", () => {
        component.ref="a";
        component.ngOnInit();
        component.toggleValue();
        expect(component.getvalue()).toBeFalsy();
        component.toggleValue();
        expect(component.getvalue()).toBeTruthy();
    });

    it("it should call respond to ng model change", () => {
        component.ref="false";
        component.ngOnInit();
        component.ref="true";
        fixture.detectChanges();
        expect(component.getvalue()).toEqual('true');
    });



});
