import { DebugElement } from '@angular/core';
import { HttpModule } from '@angular/http';
import { async, ComponentFixture, inject, TestBed, fakeAsync, tick, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';

import { CalcServiceStub } from '../../../test/calc-service.stub';
import { StorageServiceStub } from '../../../test/storage-service.stub';

import { CalcService } from '../calc.service';
import { CommunicatorService } from '../../services/communicator/communicator.service';
import { LoggerService } from '../../services/logger/logger.service';
import { StorageService } from '../../services/storage/storage.service';
import { NumberFormattingPipe } from '../../services/number-formatting/number-formatting.pipe';
import { HttpWrapperService } from '../../connect/httpwrapper/http-wrapper.service';

import { CalcStepperComponent } from './calc-stepper.component';

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
        StorageService, NumberFormattingPipe,
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
    // spyOn(calcservice, 'getObservable').and.returnValue({ subscribe: () => { } });
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

    // Type number in input field run 1
    element.triggerEventHandler('focus', null);
    element.nativeElement.value = 60;
    element.nativeElement.dispatchEvent(new Event('input'));
    element.triggerEventHandler('blur', null);

    val = calcService.getValue(component.ref);
    fixture.detectChanges();
    expect(Number(val)).toBe(60);

    // Type number in input field run 2
    element.triggerEventHandler('focus', null);
    element.nativeElement.value = '';
    element.nativeElement.dispatchEvent(new Event('input'));
    element.triggerEventHandler('blur', null);

    val = calcService.getValue(component.ref);
    fixture.detectChanges();
    expect(Number(val)).toBe(0);

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

  it('should format values correctly', fakeAsync(() => {
    component.min = 0;
    component.max = 150;
    component.format = '0%';
    component.scaler = 1;
    component.inputFormat = '0%';
    component.inputScaler = 1;
    component.isFocused = true;
    const addBtn = fixture.debugElement.query(By.css('.fa.fa-plus.add.stepper-button'));

    fixture.detectChanges();
    expect(component.value).toBe('123');
    tick();

    component.inputFormat = '0.0%';
    component.inputScaler = 10;
    fixture.detectChanges();
    // click plus button
    addBtn.nativeElement.dispatchEvent(new Event('mousedown'));
    addBtn.nativeElement.dispatchEvent(new Event('mouseup'));
    fixture.whenStable()
      .then(() => {
        const value = calcservice.getValueForYear(component.ref, component.yearRef);
        expect(Number(value)).toBe(12.4);
      });
    tick();

    component.inputFormat = '0.00%';
    component.inputScaler = 100;
    fixture.detectChanges();
    // click plus button
    addBtn.nativeElement.dispatchEvent(new Event('mousedown'));
    addBtn.nativeElement.dispatchEvent(new Event('mouseup'));
    fixture.whenStable()
      .then(() => {
        const value = calcservice.getValueForYear(component.ref, component.yearRef);
        expect(Number(value)).toBe(1.25);
      });
    tick();

  }));

  it('should update model on keyup event', () => {
    const element = fixture.debugElement.query(By.css('input.field'));

    element.triggerEventHandler('focus', null);
    element.nativeElement.value = '60';
    element.nativeElement.dispatchEvent(new Event('input'));
    component.isFocused = true;
    component['dirtyValue'] = '60';

    const event = new Event('keyup');
    Object.defineProperty(event, 'keyCode', { 'value': 13 });
    document.dispatchEvent(event);

    const value = calcservice.getValue(component.ref);
    fixture.detectChanges();
    expect(Number(value)).toBe(60);

    component.outputMin = 60;
    component.outputMax = 60;
    component.saveDataToModel(component['dirtyValue']);
    expect(Number(component.value)).toBe(60);

    component.outputMin = 70;
    component.saveDataToModel(component['dirtyValue']);
    expect(component.value).toBe(70);

    component.outputMax = 50;
    component.outputMin = 55;
    component.saveDataToModel(component['dirtyValue']);

    expect((component.value)).toBe(50);
});

  it('should call onModelChange on change detection', () => {
    component.ngOnInit();

    const modelVal = calcservice.getValueForYear(component.ref, component.yearRef, true);
    component.ngOnChanges();
    component.outRef = 'test';
    component.inRef = 'test123';

    calcservice.getValueForYear(this.ref, this.yearRef, true);
    const modelValChange = calcservice.getValueForYear(component.inRef, component.yearRef, true);

    expect(modelVal).not.toEqual(modelValChange);
  });

  it('should call onValueChange on change detection', () => {
    const element = fixture.debugElement.query(By.css('input.field'));
    element.triggerEventHandler('change', null);
    expect(Number(component['dirtyValue'])).toBe(123);

    element.nativeElement.value = '';
    fixture.detectChanges();
    element.triggerEventHandler('change', null);
    expect(Number(component['dirtyValue'])).toBe(0);
  });

  it('should call setFocusOnInput when user clicks on the value', fakeAsync(() => {

    fixture.detectChanges();
    component.isFocused = false;
    const btn = fixture.debugElement.query(By.css('span.field-value'));
    btn.triggerEventHandler('click', null);

    tick();
    fixture.detectChanges();
    expect(component.isFocused).toBeTruthy();
  }));

  it('should call ngOnInIt', () => {

    // Conditional statements
    component.min = 5;
    component.ngOnInit();

    expect(component.min).toBe(5);
    component.min = null;
    component.ngOnInit();
    expect(component.min).toBeUndefined();

    component.max = 5;
    component.ngOnInit();

    expect(component.max).toBe(5);
    component.max = null;
    component.ngOnInit();
    expect(component.max).toBeUndefined();

    component.format = '0%';
    component.ngOnInit();
    expect(component.value).toBe('123');

    component.format = '0.0%';
    component.ngOnInit();
    expect(component.value).toBe('123.0');

    component.format = '0.00%';
    component.ngOnInit();
    expect(component.value).toBe('123.00');

    component.ngOnInit();
    expect(calcservice.getValueForYear(component.inRef, component.yearRef, true)).toBe('123');

    component.inRef = 'test123';
    component.outRef = 'test456';
    component.ngOnInit();

    expect(calcservice.getValueForYear(component.inRef, component.yearRef, true)).toBeUndefined();
});

  it('should call onStepperButtonClick', () => {
    component.format = '0%';
    fixture.detectChanges();
    component.ngAfterViewInit();
    component.onStepperButtonClick(123);
    expect(component.value).toBe('123');

    component.format = '0.0%';
    fixture.detectChanges();
    component.ngAfterViewInit();
    component.onStepperButtonClick(123);

    expect(component.value).toBe('123.0');

    component.format = '0.00%';
    fixture.detectChanges();
    component.ngAfterViewInit();
    component.onStepperButtonClick(123);
    expect(component.value).toBe('123.00');
  });

  it('should call onModelChange on detect changes', () => {
    component.onModelChange();
    expect(calcservice.getValueForYear(component.ref, component.yearRef, true)).toBe('123');

    component.inRef = 'test123';
    component.outRef = 'test456';
    component.onModelChange();
    expect(calcservice.getValueForYear(component.ref, component.yearRef, true)).toBe('123');

    component.format = '0%';

    const calService = calcservice.getValueForYear(component.ref, component.yearRef, true);
    const numberFormatter = TestBed.get(NumberFormattingPipe);

    component.onModelChange();
    component.value = '' + (numberFormatter.parse(calService, component.inputScaler));

    expect(component.value).toBe('123');

    component.format = '0.0%';
    component.onModelChange();
    component.value = '' + (numberFormatter.parse(calService, component.inputScaler));

    expect(component.value).toBe('123');

    component.format = '0.00%';
    component.onModelChange();
    component.value = '' + (numberFormatter.parse(calService, component.inputScaler));

    expect(component.value).toBe('123');
  });

});
