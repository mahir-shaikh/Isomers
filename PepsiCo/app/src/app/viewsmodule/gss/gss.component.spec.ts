/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GssComponent } from './gss.component';

describe('GssComponent', () => {
  let component: GssComponent;
  let fixture: ComponentFixture<GssComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GssComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});