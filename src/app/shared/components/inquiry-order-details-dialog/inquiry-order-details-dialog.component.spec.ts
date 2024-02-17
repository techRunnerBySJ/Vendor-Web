import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiryOrderDetailsDialogComponent } from './inquiry-order-details-dialog.component';

describe('InquiryOrderDetailsDialogComponent', () => {
  let component: InquiryOrderDetailsDialogComponent;
  let fixture: ComponentFixture<InquiryOrderDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InquiryOrderDetailsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InquiryOrderDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
