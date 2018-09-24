import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CalcCheckboxComponent } from './calc-checkbox.component';
import { CalcService } from '../calc.service';
import { TextService } from '../../text-engine/text.service';
import { NumberFormattingPipe } from '../../services/number-formatting/number-formatting.pipe';
import { CommunicatorService } from '../../services/communicator/communicator.service';
import { CalcServiceStub } from '../../../test/calc-service.stub';
import { TextServiceStub } from '../../../test/text-service.stub';
import { LoggerService } from '../../services/logger/logger.service';
import { Constants } from '../../../config/constants';

describe('CalcCheckboxComponent', () => {
  let component: CalcCheckboxComponent;
  let fixture: ComponentFixture<CalcCheckboxComponent>;
  let calcService: CalcServiceStub;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalcCheckboxComponent, NumberFormattingPipe],
      providers: [CommunicatorService, NumberFormattingPipe, LoggerService,
        { provide: CalcService, useClass: CalcServiceStub },
        { provide: TextService, useClass: TextServiceStub }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalcCheckboxComponent);

    component = fixture.componentInstance;
    component.ref = 'test';

    calcService = TestBed.get(CalcService);
    calcService.setValue('test', true);

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(component.value).toBeTruthy();
  });

  it('should call modelUpdate when calc-model is updated', () => {
    expect(component).toBeTruthy();
    const commService: CommunicatorService = TestBed.get(CommunicatorService);
    const spy = spyOn(component, 'onModelUpdate').and.callThrough();
    commService.trigger(Constants.MODEL_CALC_COMPLETE);
    expect(spy.calls.count()).toBe(1);
  });

  it('should uncheck on click', () => {
    // find and click the checkbox
    const checkBox = fixture.debugElement.query(By.css('input'));
    checkBox.triggerEventHandler('click', {});

    fixture.detectChanges();

    expect(component.value).toBeFalsy();
  });

});
