/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RoictreeComponent } from './roictree.component';

describe('RoictreeComponent', () => {
  let component: RoictreeComponent;
  let fixture: ComponentFixture<RoictreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoictreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoictreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});