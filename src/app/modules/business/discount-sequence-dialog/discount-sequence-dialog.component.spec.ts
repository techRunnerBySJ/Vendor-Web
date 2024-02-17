import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountSequenceDialogComponent } from './discount-sequence-dialog.component';

describe('DiscountSequenceDialogComponent', () => {
  let component: DiscountSequenceDialogComponent;
  let fixture: ComponentFixture<DiscountSequenceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscountSequenceDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountSequenceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
