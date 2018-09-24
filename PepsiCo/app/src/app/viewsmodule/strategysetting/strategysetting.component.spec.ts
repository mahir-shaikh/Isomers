/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StrategysettingComponent } from './strategysetting.component';

describe('StrategysettingComponent', () => {
  let component: StrategysettingComponent;
  let fixture: ComponentFixture<StrategysettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategysettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategysettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});