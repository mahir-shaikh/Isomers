import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SimpleChange, SimpleChanges } from '@angular/core';
import { TextService } from '../text.service';
import { TextServiceStub } from '../../../test/text-service.stub';
import { TextOutputComponent } from './text-output.component';
import { CommunicatorService, LoggerService } from '../../services';
import { Constants } from '../../../config/constants';

describe('TextOutputComponent', () => {
  let component: TextOutputComponent;
  let fixture: ComponentFixture<TextOutputComponent>;
  let commService: CommunicatorService;
  let textService: TextServiceStub;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextOutputComponent],
      providers: [{ provide: TextService, useClass: TextServiceStub }, CommunicatorService, LoggerService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextOutputComponent);
    component = fixture.componentInstance;
    commService = TestBed.get(CommunicatorService);
    textService = TestBed.get(TextService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update text when language is loaded / changed', () => {
    // expect(component).toBeTruthy();
    component.key = 'test';
    textService.isReady = true;
    textService.textContent['GEN']['test'] = 'Test String!';
    fixture.detectChanges();
    const spy = spyOn(component, 'updateText').and.callThrough();
    commService.getEmitter(Constants.TEXT_ENGINE.LANGUAGE_LOADED).next();
    expect(spy.calls.count()).toBe(1);
    expect(component.value).toBe('Test String!');
  });

  it('should update text when key is changed', fakeAsync(() => {
    // expect(component).toBeTruthy();
    component.key = 'test';
    textService.isReady = true;
    textService.textContent['GEN']['test'] = 'Test String!';
    textService.textContent['GEN']['test2'] = 'New Test String!';
    let change = new SimpleChange('', 'test', true);
    let changes: SimpleChanges = { 'key': change };
    component.ngOnChanges(changes);
    fixture.detectChanges();
    tick();
    const spy = spyOn(component, 'updateText').and.callThrough();
    commService.getEmitter(Constants.TEXT_ENGINE.LANGUAGE_LOADED).next();
    tick();
    expect(spy.calls.count()).toBe(1);
    expect(component.value).toBe('Test String!');
    component.key = 'test2';
    fixture.detectChanges();
    change = new SimpleChange('test', 'test2', false);
    changes = { 'key': change };
    component.ngOnChanges(changes);
    tick();
    expect(spy.calls.count()).toBe(2);
    expect(component.value).toBe('New Test String!');
    // If key is not exist in text engine then it should be print key as it is
    component.key = 'test29';
    fixture.detectChanges();
    change = new SimpleChange('test', 'test2', false);
    changes = { 'key': change };
    component.ngOnChanges(changes);
    tick();
    expect(spy.calls.count()).toBe(3);
    expect(component.value).toBe('test29');
  }));

});
