import { TestBed } from '@angular/core/testing';

import { AutocompleteService } from './autocomplete.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AutocompleteService', () => {
  let service: AutocompleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AutocompleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
