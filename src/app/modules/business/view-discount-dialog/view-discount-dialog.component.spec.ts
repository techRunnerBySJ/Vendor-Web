import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDiscountDialogComponent } from './view-discount-dialog.component';

describe('ViewDiscountDialogComponent', () => {
  let component: ViewDiscountDialogComponent;
  let fixture: ComponentFixture<ViewDiscountDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDiscountDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDiscountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
