import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionPaymentComponent } from './subscription-payment.component';

describe('SubscriptionPaymentComponent', () => {
  let component: SubscriptionPaymentComponent;
  let fixture: ComponentFixture<SubscriptionPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
