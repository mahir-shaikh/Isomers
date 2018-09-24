import { async, ComponentFixture, inject, TestBed, fakeAsync, tick, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CalcStepperComponent } from './calcstepper';
import { DebugElement } from '@angular/core/src/debug/debug_node';
import { CalcService, CommunicatorService, LoggerService, StorageService, HttpWrapperService, NumberFormattingPipe } from '@btsdigital/ngx-isomer-core';
// import { NumberFormattingPipe } from '../number-formatting.pipe';
import { HttpModule } from '@angular/http';
import { CalcServiceStub, } from '../../../test/calc-service.stub';
import { StorageServiceStub, } from '../../../test/storage-service.stub';
import { Observable } from 'rxjs/Observable';
import { Constants } from '../../../config/constants';

describe('CalcStepperComponent', () => {

    let component: CalcStepperComponent;
    let fixture: ComponentFixture<CalcStepperComponent>;
    let calcservice: CalcServiceStub;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, FormsModule, HttpModule],
            declarations: [CalcStepperComponent, NumberFormattingPipe],
            providers: [
                CommunicatorService,
                LoggerService, HttpWrapperService,
                StorageService,
                { provide: CalcService, useClass: CalcServiceStub }
            ]
        }).compileComponents();
    });

    beforeEach(() => {

        fixture = TestBed.createComponent(CalcStepperComponent);
        component = fixture.componentInstance;
        calcservice = TestBed.get(CalcService);
        calcservice.setValue('test', '123');
        component.ref = 'test';
        spyOn(calcservice, 'getObservable').and.returnValue({ subscribe: () => { } });
        fixture.detectChanges();
    });

    it('should be Truthy', () => {
        expect(component).toBeTruthy();
    });

    it('should be created', fakeAsync(() => {
        expect(component.value).toBe('123');
        fixture.detectChanges();
        tick();
        expect(component.value).toBe('123');
    }));

    it('should update model on changes to input', () => {
        component.min = 0;
        component.max = 123;
        fixture.detectChanges();
        const element = fixture.debugElement.query(By.css('input.field'));
        const comm: CommunicatorService = TestBed.get(CommunicatorService);
        const calcService: CalcService = TestBed.get(CalcService);
        element.nativeElement.value = 125;
        element.nativeElement.dispatchEvent(new Event('input'));
        comm.trigger(Constants.MODEL_CALC_COMPLETE);
        let val = calcService.getValue(component.ref);
        expect(Number(val)).toBe(123);

        // Type number in input field
        element.triggerEventHandler('focus', null);
        element.nativeElement.value = 60;
        element.nativeElement.dispatchEvent(new Event('input'));
        element.triggerEventHandler('blur', null);

        val = calcService.getValue(component.ref);
        fixture.detectChanges();
        expect(Number(val)).toBe(60);

    });

    it('should update model on changes to click', () => {
        component.min = 0;
        component.max = 150;
        fixture.detectChanges();
        const element = fixture.debugElement.query(By.css('input.field'));
        const minusBtn = fixture.debugElement.query(By.css('.fa.fa-minus.subtract.stepper-button'));
        const addBtn = fixture.debugElement.query(By.css('.fa.fa-plus.add.stepper-button'));

        // click minus button
        minusBtn.nativeElement.dispatchEvent(new Event('mousedown'));
        minusBtn.nativeElement.dispatchEvent(new Event('mouseup'));
        fixture.detectChanges();
        expect(Number(element.nativeElement.value)).toBe(122);

        // click plus button        
        addBtn.nativeElement.dispatchEvent(new Event('mousedown'));
        addBtn.nativeElement.dispatchEvent(new Event('mouseup'));
        fixture.detectChanges();
        expect(Number(element.nativeElement.value)).toBe(123);
    });


});
