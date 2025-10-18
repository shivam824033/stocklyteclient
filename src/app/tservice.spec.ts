import { TestBed } from '@angular/core/testing';

import { Tservice } from './tservice';

describe('Tservice', () => {
  let service: Tservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
