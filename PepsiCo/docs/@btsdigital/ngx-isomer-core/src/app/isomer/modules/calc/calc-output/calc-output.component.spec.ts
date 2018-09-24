import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CalcOutputComponent } from './calc-output.component';

import { CalcService } from '../calc.service';
import { NumberFormattingPipe } from '../../services/number-formatting/number-formatting.pipe';
import { CommunicatorService, LoggerService, StorageService } from '../../services';
import { Constants } from '../../../index';
import { CalcServiceStub } from '../../../test/calc-service.stub';
import { StorageServiceStub } from '../../../test/storage-service.stub';


describe('CalcOutputComponent', () => {
  let component: CalcOutputComponent;
  let fixture: ComponentFixture<CalcOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [ CalcOutputComponent, NumberFormattingPipe ],
      providers: [{ provide: CalcService, useClass: CalcServiceStub }, CommunicatorService, LoggerService,
        { provide: StorageService, useClass: StorageServiceStub }, NumberFormattingPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalcOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should update value on model changes', fakeAsync(() => {
    // expect(component).toBeTruthy();
    const calcService: CalcServiceStub = TestBed.get(CalcService);
    const communicator: CommunicatorService = TestBed.get(CommunicatorService);
    calcService.apiReady = true;
    calcService.setValue('test', '123.43');

    component.ref = 'test';
    component.ngOnChanges();

    fixture.detectChanges();
    expect(component.value).toBe('123.43');
    calcService.setValue('test', '234.21');
    communicator.trigger(Constants.MODEL_CALC_COMPLETE);
    tick();
    expect(component.value).toBe('234.21');
    communicator.trigger(Constants.MODEL_CALC_COMPLETE);
    tick();
    expect(component.value).toBe('234.21');
  }));
});
