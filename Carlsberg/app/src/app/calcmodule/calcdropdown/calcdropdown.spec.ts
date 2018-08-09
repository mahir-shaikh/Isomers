import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalcDropdown } from './calcdropdown'
import { CalcService } from '../../calcmodule';
import { CalcServiceStub } from '../../calcmodule/calcstub.service';
import { NumberFormattingPipe } from '../number-formatting.pipe';
import { TextEngineService } from '../../textengine/textengine.service';
import { TextEngineServiceStub } from '../../textengine/textenginestub.service';



describe('calc dropdown ', () => {

    let component: CalcDropdown;
    let fixture: ComponentFixture < CalcDropdown > ;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [CalcDropdown, NumberFormattingPipe],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [{ provide: CalcService, useClass: CalcServiceStub }, { provide: TextEngineService, useClass: TextEngineServiceStub }]
        });

        fixture = TestBed.createComponent(CalcDropdown);
        component = fixture.componentInstance;
    });

    it("it should make calc dropdown", () => {
        expect(component instanceof CalcDropdown).toBe(true, 'should create calc dropdown  component');
    });


    it("it should call processItems", () => {
        spyOn(component, "processItems");
        component.ref="a";
        component.ngOnInit();
        component.processItems();
        expect(component.processItems).toHaveBeenCalled();
    });

    it("it should destroy observer",() => {
        component.ngOnDestroy();
        expect(component.getObserver()).toBeUndefined();
    });

    it("selecteditem value sould change",() => {
        component.ref="a";
        component.items=["a","b"];
        component.ngOnInit();
        component.ref="b";
        fixture.detectChanges();
        expect(component.getSelectedItem()).toEqual("b");
        
    });



});
