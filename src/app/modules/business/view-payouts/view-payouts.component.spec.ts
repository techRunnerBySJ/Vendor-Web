import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPayoutsComponent } from './view-payouts.component';

describe('ViewPayoutsComponent', () => {
  let component: ViewPayoutsComponent;
  let fixture: ComponentFixture<ViewPayoutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPayoutsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPayoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
