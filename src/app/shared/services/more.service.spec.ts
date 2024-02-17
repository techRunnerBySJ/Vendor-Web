import { TestBed } from '@angular/core/testing';

import { MoreService } from './more.service';

describe('MoreService', () => {
  let service: MoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
