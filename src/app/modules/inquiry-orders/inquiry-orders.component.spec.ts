import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiryOrdersComponent } from './inquiry-orders.component';

describe('InquiryOrdersComponent', () => {
  let component: InquiryOrdersComponent;
  let fixture: ComponentFixture<InquiryOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InquiryOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InquiryOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
