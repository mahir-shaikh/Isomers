/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MarketdataComponent } from './marketdata.component';

describe('MarketdataComponent', () => {
  let component: MarketdataComponent;
  let fixture: ComponentFixture<MarketdataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketdataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});