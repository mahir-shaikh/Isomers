import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CalcInputComponent } from './calc-input.component';
import { By } from '@angular/platform-browser';
import { CalcService } from '../calc.service';
import { NumberFormattingPipe } from '../../services/number-formatting/number-formatting.pipe';
import { CommunicatorService, LoggerService, StorageService } from '../../services';
import { CalcFormatterDirective } from '../calc-formatter.directive';
import { CalcServiceStub } from '../../../test/calc-service.stub';
import { StorageServiceStub } from '../../../test/storage-service.stub';
import { Constants } from '../../../config/constants';

describe('CalcInputComponent', () => {
  let component: CalcInputComponent;
  let fixture: ComponentFixture<CalcInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ CalcInputComponent, CalcFormatterDirective ],
      providers: [CommunicatorService, LoggerService, NumberFormattingPipe,
        { provide: StorageService, useClass: StorageServiceStub },
        { provide: CalcService, useClass: CalcServiceStub } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalcInputComponent);
    component = fixture.componentInstance;
    const calcService: CalcServiceStub = TestBed.get(CalcService);
    calcService.setValue('test', '123');
    component.ref = 'test';
    fixture.detectChanges();
  });

  it('should be created', (done: DoneFn) => {
    expect(component).toBeTruthy();
    expect(component.value).toBe('123');
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.value).toBe('123');
    done();
  });

  it('should update model on changes to input', (done: DoneFn) => {
    component.min = 0;
    component.max = 123;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.calc-input')).nativeElement;
    const comm: CommunicatorService = TestBed.get(CommunicatorService);
    const calcService: CalcService = TestBed.get(CalcService);
    element.value = 125;
    element.dispatchEvent(new Event('input'));
    fixture.whenStable()
      .then(() => {
        component.saveDataToModel();
        comm.trigger(Constants.MODEL_CALC_COMPLETE);
        let val = calcService.getValueForYear(component.ref);
        expect(Number(val)).toBe(123);
        element.value = -10;
        element.dispatchEvent(new Event('input'));

        fixture.whenStable()
          .then(() => {
            component.saveDataToModel();
            val = calcService.getValueForYear(component.ref);
            expect(Number(val)).toBe(0);
            done();
          });
      });
  });

  it('should update model on changes to input with format', (done: DoneFn) => {
    // expect(component).toBeTruthy();
    // component.ref = 'test';
    component.min = 0;
    component.max = 1;
    component.format = '0.00%';
    component.scaler = 1;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.calc-input')).nativeElement;
    element.value = .5596;
    element.dispatchEvent(new Event('input'));
    fixture.whenStable()
      .then(() => {
        component.saveDataToModel();
        const calcService: CalcService = TestBed.get(CalcService);
        const val = calcService.getValueForYear(component.ref);
        expect(component.value).toBe('55.96%');
        expect(Number(val)).toBe(0.5596);
        done();
      });
  });

  it('should handle bad input', (done: DoneFn) => {
    // expect(component).toBeTruthy();
    // component.ref = 'test';
    component.min = 0;
    component.max = 1;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.calc-input')).nativeElement;
    element.value = '';
    element.dispatchEvent(new Event('input'));
    fixture.whenStable()
      .then(() => {
        component.saveDataToModel();
        const calcService: CalcService = TestBed.get(CalcService);
        const val = calcService.getValueForYear(component.ref);
        expect(component.value).toBe('123');
        expect(Number(val)).toBe(123);
        done();
      });
  });
});
