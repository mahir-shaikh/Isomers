import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionsummaryComponent } from './decisionsummary.component';

describe('DecisionsummaryComponent', () => {
  let component: DecisionsummaryComponent;
  let fixture: ComponentFixture<DecisionsummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecisionsummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
