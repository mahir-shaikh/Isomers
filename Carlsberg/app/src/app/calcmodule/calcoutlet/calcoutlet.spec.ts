import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalcOutlet } from './calcoutlet'
import { CalcService } from '../../calcmodule';
import { CalcServiceStub } from '../../calcmodule/calcstub.service';
import { NumberFormattingPipe } from '../number-formatting.pipe';
import { TextEngineService } from '../../textengine/textengine.service';
import { TextEngineServiceStub } from '../../textengine/textenginestub.service';

describe('calc outlet ', () => {

    let component: CalcOutlet;
    let fixture: ComponentFixture < CalcOutlet > ;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [CalcOutlet, NumberFormattingPipe],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [{ provide: CalcService, useClass: CalcServiceStub }, { provide: TextEngineService, useClass: TextEngineServiceStub }]
        });

        fixture = TestBed.createComponent(CalcOutlet);
        component = fixture.componentInstance;
    });

    it("it should make calc outlet", () => {
        expect(component instanceof CalcOutlet).toBe(true, 'should create calc outlet  component');
    });

    it("it should destroy observer", () => {
        component.ngOnDestroy();
        expect(component.getSubscriber()).toBeUndefined();
    });

    it("it should call updateValue", () => {
        spyOn(component, "updateValue");
        component.ref = "a";
        component.ngOnInit();
        expect(component.updateValue).toHaveBeenCalled();
    });

});