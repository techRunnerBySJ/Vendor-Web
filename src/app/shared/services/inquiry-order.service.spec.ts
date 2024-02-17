import { TestBed } from '@angular/core/testing';

import { InquiryOrderService } from './inquiry-order.service';

describe('InquiryOrderService', () => {
  let service: InquiryOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InquiryOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
