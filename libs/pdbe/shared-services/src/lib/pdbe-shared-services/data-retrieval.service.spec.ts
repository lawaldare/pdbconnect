import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DataRetrievalService } from './data-retrieval.service';

describe('DataRetrievalService', () => {
  let service: DataRetrievalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(DataRetrievalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
