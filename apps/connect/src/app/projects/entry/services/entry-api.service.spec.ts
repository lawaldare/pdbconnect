import { TestBed } from '@angular/core/testing';

import { EntryApiService } from './entry-api.service';
import { HttpClientModule } from '@angular/common/http';

describe('EntryApiService', () => {
  let service: EntryApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [EntryApiService],
    }).compileComponents();

    service = TestBed.inject(EntryApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
