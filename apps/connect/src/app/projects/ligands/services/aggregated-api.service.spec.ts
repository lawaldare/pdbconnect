import { TestBed } from '@angular/core/testing';

import { AggregatedApiService } from './aggregated-api.service';
import { HttpClientModule } from '@angular/common/http';
describe('AggregatedApiService', () => {
  let service: AggregatedApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [AggregatedApiService],
    }).compileComponents;

    service = TestBed.inject(AggregatedApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
