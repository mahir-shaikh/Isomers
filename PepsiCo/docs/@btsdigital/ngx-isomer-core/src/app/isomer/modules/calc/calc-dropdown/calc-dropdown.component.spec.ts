import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CalcDropdownComponent } from './calc-dropdown.component';
import { CalcService } from '../calc.service';
import { TextService } from '../../text-engine/text.service';
import { NumberFormattingPipe } from '../../services/number-formatting/number-formatting.pipe';
import { CommunicatorService } from '../../services/communicator/communicator.service';
import { CalcServiceStub } from '../../../test/calc-service.stub';
import { TextServiceStub } from '../../../test/text-service.stub';
import { LoggerService } from '../../services/logger/logger.service';
import { BsDropdownModule } from 'ngx-bootstrap';
import { Constants } from '../../../config/constants';

describe('CalcDropdownComponent', () => {
  let component: CalcDropdownComponent;
  let fixture: ComponentFixture<CalcDropdownComponent>;
  let calcService: CalcServiceStub;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BsDropdownModule.forRoot()],
      declarations: [ CalcDropdownComponent, NumberFormattingPipe ],
      providers: [{provide: CalcService, useClass: CalcServiceStub},
      {provide: TextService, useClass: TextServiceStub},
      CommunicatorService, NumberFormattingPipe, LoggerService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalcDropdownComponent);
    component = fixture.componentInstance;
    component.ref = 'test';
    component.items = ['A', 'B', 'C'];
    calcService = TestBed.get(CalcService);
    calcService.setValue('test', 'A');
    calcService.setValue('testyear', '1');
    calcService.apiReady = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call modelUpdate when calc-model is updated', () => {
    expect(component).toBeTruthy();
    const commService: CommunicatorService = TestBed.get(CommunicatorService);
    const spy = spyOn(component, 'onModelUpdate').and.callThrough();
    commService.trigger(Constants.MODEL_CALC_COMPLETE);
    expect(spy.calls.count()).toBe(1);
  });

  it('should trigger dropdownChanged handler', fakeAsync(() => {
    // expect(component).toBeTruthy();
    fixture.debugElement.query(By.css('.dropdown-toggle')).nativeElement.click();
    tick();
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        const dropdownItem = fixture.debugElement.queryAll(By.css('.dropdown-item'));
        const spy = spyOn(component, 'dropdownChanged').and.callThrough();
        dropdownItem[1].triggerEventHandler('click', {});
        expect(spy.calls.count()).toBe(1);
      });
      tick();
  }));


  it('should update items list if Inputs are changed', fakeAsync(() => {
    // expect(component).toBeTruthy();
    fixture.debugElement.query(By.css('.dropdown-toggle')).nativeElement.click();
    tick();
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        const dropdownItems = fixture.debugElement.queryAll(By.css('.dropdown-item'));
        // const spy = spyOn(component, 'dropdownChanged').and.callThrough();
        // dropdownItem[1].triggerEventHandler('click', {});
        expect(dropdownItems.length).toBe(3);
      });
      tick();
    component.items = ['A', 'B', 'C', 'D'];
    component.yearRef = 'testyear';
    component.format = 'string';
    component.recheck = true;
    fixture.detectChanges();
    tick();
    let change = new SimpleChange(['A', 'B', 'C'], ['A', 'B', 'C', 'D'], false);
    component.ngOnChanges({items: change});
    fixture.debugElement.query(By.css('.dropdown-toggle')).nativeElement.click();
    tick();
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        const dropdownItems = fixture.debugElement.queryAll(By.css('.dropdown-item'));
        // const spy = spyOn(component, 'dropdownChanged').and.callThrough();
        expect(dropdownItems.length).toBe(4);
        dropdownItems[3].triggerEventHandler('click', {});
        tick();
        expect(component.getSelectedItem()).toBe('D');
      });
    tick();
    // run #2
    component.items = ['A', 'B', 'C', 'E'];
    component.format = 'string';
    component.recheck = true;
    fixture.detectChanges();
    tick();
    change = new SimpleChange(['A', 'B', 'C', 'D'], ['A', 'B', 'C', 'E'], false);
    component.ngOnChanges({items: change});
    fixture.debugElement.query(By.css('.dropdown-toggle')).nativeElement.click();
    tick();
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        const dropdownItems = fixture.debugElement.queryAll(By.css('.dropdown-item'));
        // const spy = spyOn(component, 'dropdownChanged').and.callThrough();
        expect(dropdownItems.length).toBe(4);
        dropdownItems[3].triggerEventHandler('click', {});
        tick();
        expect(component.getSelectedItem()).toBe('E');
      });
    tick();
  }));
});
