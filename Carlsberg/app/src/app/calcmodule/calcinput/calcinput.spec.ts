import { Component, NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CalcInput } from './calcinput'
import { CalcService } from '../../calcmodule';
import { CalcServiceStub } from '../../calcmodule/calcstub.service';
import { NumberFormattingPipe } from '../number-formatting.pipe';
import { TextEngineService } from '../../textengine/textengine.service';
import { TextEngineServiceStub } from '../../textengine/textenginestub.service';
import { By } from '@angular/platform-browser';


describe('calc input ', () => {

    let component: CalcInput;
    let fixture: ComponentFixture < CalcInput > ;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [CalcInput, NumberFormattingPipe],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [{ provide: CalcService, useClass: CalcServiceStub }, { provide: TextEngineService, useClass: TextEngineServiceStub }]
        });

        fixture = TestBed.createComponent(CalcInput);
        component = fixture.componentInstance;
    });

    it("it should make calc input", () => {
        expect(component instanceof CalcInput).toBe(true, 'should create calc input  component');
    });

    it("it should destroy observer", () => {
        component.ngOnDestroy();
        expect(component.getSubscription()).toBeUndefined();
    });

    it("it should call saveDataToModel", () => {
        let de: DebugElement;
        let el;
        spyOn(component, "saveDataToModel");
        component.ref = "a";
        component.ngOnInit();
        fixture.whenStable().then(() => {
            fixture.debugElement.nativeElement.querySelector('input').dispatchEvent(new Event('blur'));;
            expect(component.saveDataToModel).toHaveBeenCalled();
        })

    });

});
