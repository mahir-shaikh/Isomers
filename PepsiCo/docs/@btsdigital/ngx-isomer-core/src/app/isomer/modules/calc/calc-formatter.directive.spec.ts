import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CalcFormatterDirective } from './calc-formatter.directive';
import { NumberFormattingPipe } from '../services/number-formatting/number-formatting.pipe';
import { TestComponent } from '../../test/calc-formatter-test.component';

describe('CalcFormatterDirective', () => {

  // let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let el: DebugElement[];
  let component: TestComponent;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [TestComponent, CalcFormatterDirective]
    }).createComponent(TestComponent);

    fixture.detectChanges();
    component = fixture.componentInstance;
    el = fixture.debugElement.queryAll(By.directive(CalcFormatterDirective));
  });

  it('should create an element with directive instance', () => {
    // const directive = new CalcFormatterDirective();
    // expect(directive).toBeTruthy();
    expect(el.length).toBe(1);
  });

  it('should listen to events on component', (done: DoneFn) => {
    // const directive = new CalcFormatterDirective();
    // expect(directive).toBeTruthy();
    // expect(el.length).toBe(1);
    const elem: DebugElement = el[0];
    const directiveInstance = elem.injector.get(CalcFormatterDirective);
    // trigger focus event
    // elem.triggerEventHandler('focus', {});
    let value = elem.nativeElement.value;
    directiveInstance.onFocus(value);
    value = elem.nativeElement.value;

    expect(value).toEqual('12345.21');
    // component.setValue(15432.10);
    // onfocus has a 300ms timeout for listening to onblur
    setTimeout(() => {
      directiveInstance.onBlur('15432.10');
      // elem.triggerEventHandler('blur', {});
      value = elem.nativeElement.value;
      expect(value).toBe('15,432.10');
      done();
    }, 350);

  });

  it('should listen do nothing if format is undefined', (done: DoneFn) => {
    // const directive = new CalcFormatterDirective();
    // expect(directive).toBeTruthy();
    // expect(el.length).toBe(1);
    component.format = undefined;
    fixture.detectChanges();

    const elem: DebugElement = el[0];
    const directiveInstance = elem.injector.get(CalcFormatterDirective);
    // trigger focus event
    // elem.triggerEventHandler('focus', {});
    let value = elem.nativeElement.value;
    directiveInstance.onFocus(value);
    value = elem.nativeElement.value;

    expect(value).toEqual('12345.21');
    // component.setValue(15432.10);
    // onfocus has a 300ms timeout for listening to onblur
    setTimeout(() => {
      directiveInstance.onBlur('15432.10');
      // elem.triggerEventHandler('blur', {});
      value = elem.nativeElement.value;
      expect(value).toBe('12345.21');
      done();
    }, 350);

  });

  it('should do nothing if listenToBlur is not set', () => {
    const elem: DebugElement = el[0];
    const directiveInstance = elem.injector.get(CalcFormatterDirective);
    // trigger focus event
    // elem.triggerEventHandler('focus', {});
    let value = elem.nativeElement.value;
    directiveInstance.onFocus(value);
    value = elem.nativeElement.value;

    expect(value).toEqual('12345.21');
    // component.setValue(15432.10);
    // onfocus has a 300ms timeout for listening to onblur
    directiveInstance.onBlur('15432.10');
    // elem.triggerEventHandler('blur', {});
    value = elem.nativeElement.value;
    expect(value).toBe('12345.21');
  });



  it('should work even when focus/blur is called multiple times', (done: DoneFn) => {
    const elem: DebugElement = el[0];
    const directiveInstance = elem.injector.get(CalcFormatterDirective);
    let value = elem.nativeElement.value;
    directiveInstance.onFocus(value);
    value = elem.nativeElement.value;

    expect(value).toEqual('12345.21');
    // onfocus has a 300ms timeout for listening to onblur
    setTimeout(() => {
      directiveInstance.onBlur('15432.10');
      value = elem.nativeElement.value;
      expect(value).toBe('15,432.10');

      directiveInstance.onFocus('123,467.14');
      value = elem.nativeElement.value;
      expect(value).toEqual('123467.14');

      setTimeout(() => {
        directiveInstance.onBlur('123467.14');
        value = elem.nativeElement.value;
        expect(value).toEqual('123,467.14');
        done();
      }, 350);
    }, 350);

  });
});
