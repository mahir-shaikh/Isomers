import { Component } from '@angular/core';
import { ComponentFixture, TestBed, inject, async, tick, fakeAsync } from '@angular/core/testing';
import { CalcService } from './../calcmodule';
import { DataAdaptorService } from '../dataadaptor/data-adaptor.service';
import { DataAdaptorStubService } from '../dataadaptor/data-adaptor-stub.service';
import { FileSaver } from '../utils';
import { FileSaverStub } from '../utils/filesaverstub';
import { CalcApi } from './calcapi';
import { CalcApiStub } from './calcapistub';



describe('calc service ', () => {

    let component: CalcService;
    let fixture: ComponentFixture < CalcService > ;

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [],
            providers: [
                CalcService,
                { provide: DataAdaptorService, useClass: DataAdaptorStubService },
                { provide: FileSaver, useClass: FileSaverStub }
            ]
        });
    });

    beforeEach(inject([CalcService], (calcService: CalcService) => {
        component = calcService;
        component.setApi(new CalcApiStub(component));
    }));

    var originalTimeout;

    beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('calcservice should not be equal to null',
        function() {
            expect(component).not.toEqual(null);
        });

    it('should be true as api is ready',
        function() {
            expect(component.isApiReady()).toEqual(true);
        });

    it('should set and get state url',
        function() {
            component.setStateUrl("abc");
            expect(component.getStateUrl()).toEqual("abc");
        });

    it('should call initialize',
        function() {
            spyOn(component, "initialize");
            component.setApi(null);
            component.getApi();
            expect(component.initialize).toHaveBeenCalled();
        });

    it('should call loadModelData',
        function() {
            spyOn(component, "loadModelData");
            component.setApi(null);
            component.getApi();
            expect(component.loadModelData).toHaveBeenCalled();
        });

    it('should be true as getapi returns an api',
        function() {
            expect(component.isApiReady()).toEqual(true);
        });

    it('should set and get value for a particular range ref',
        function() {
            component.setValue("1", "1");
            expect(component.getValue("1")).toEqual("1");
        });

    it('should set and get value for a particular range ref',
        function() {
            component.setValueForYear("1", "1", "1");
            expect(component.getValueForYear("1", "1")).toEqual("1_R1");
        });

});
