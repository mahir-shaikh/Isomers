import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { CalcSliderComponent } from './calc-slider.component';
import { CalcService } from '../calc.service';
import { CalcServiceStub } from '../../../test/calc-service.stub';

describe('CalcSliderComponent', () => {
  let component: CalcSliderComponent;
  let fixture: ComponentFixture<CalcSliderComponent>;
  let sliderEl: DebugElement;
  let calcService: CalcServiceStub;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalcSliderComponent ],
      providers: [{
        provide: CalcService, useClass: CalcServiceStub
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalcSliderComponent);
    component = fixture.componentInstance;
    component.ref = 'test';
    component.yearRef = 'testyear';
    component.min = 0;
    component.max = 10;
    component.step = 1;
    component.format = '0.000';
    calcService = TestBed.get(CalcService);
    calcService.setValue('test', 2);
    fixture.detectChanges();
    sliderEl = fixture.debugElement.query(By.css('.calc-slider'));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    /* TODO: add more coverage */
    let value = sliderEl.nativeElement.noUiSlider.get();
    expect(value).toEqual('2.000');
    sliderEl.nativeElement.noUiSlider.set(5);
    // sliderEl.nativeElement.noUiSlider.change();
    // debugger;
    value = sliderEl.nativeElement.noUiSlider.get();
    expect(value).toEqual('5.000');
  });
});
