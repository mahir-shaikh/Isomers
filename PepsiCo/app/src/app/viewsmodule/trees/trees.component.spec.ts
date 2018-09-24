/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TreesComponent } from './trees.component';

describe('TreesComponent', () => {
  let component: TreesComponent;
  let fixture: ComponentFixture<TreesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});