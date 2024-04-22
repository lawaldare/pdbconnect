import { TestBed } from '@angular/core/testing';

import { AggregatedApiService } from './aggregated-api.service';

describe('AggregatedApiService', () => {
  let service: AggregatedApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AggregatedApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
