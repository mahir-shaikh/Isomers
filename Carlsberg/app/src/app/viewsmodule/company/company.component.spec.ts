import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { CalcService } from '../../calcmodule';
import { CalcServiceStub } from '../../calcmodule/calcstub.service';
import { CompanyDecisionsComponent } from './company.component';

describe('Company Component', () => {

    let component: CompanyDecisionsComponent;
    let fixture: ComponentFixture < CompanyDecisionsComponent > ;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [CompanyDecisionsComponent],
            schemas : [NO_ERRORS_SCHEMA],
            providers: [{ provide: CalcService, useClass: CalcServiceStub }]
        });

        fixture = TestBed.createComponent(CompanyDecisionsComponent);
        component = fixture.componentInstance;
    });

    it("it should make Compnany Component", () => {
        expect(component instanceof CompanyDecisionsComponent).toBe(true, 'should create company component');
    });

    it("it should call initializeList", () => {
        spyOn(component, "initializePackList")
        spyOn(component, "initializeProjectList")
        component.ngOnInit();
        expect(component.initializePackList).toHaveBeenCalled();
        expect(component.initializeProjectList).toHaveBeenCalled();
    });

    it("it should destroy observer", () => {
        component.ngOnDestroy();
        expect(component.getListener()).toBeUndefined();
    });

    it("it should destroy observer", () => {
        component.ngOnDestroy();
        expect(component.getListener()).toBeUndefined();
    });

});