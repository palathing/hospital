import { TestBed } from '@angular/core/testing';

import { HostaskService } from './hostask.service';

describe('HostaskService', () => {
  let service: HostaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HostaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
