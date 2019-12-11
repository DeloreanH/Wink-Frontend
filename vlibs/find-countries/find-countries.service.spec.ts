import { TestBed } from '@angular/core/testing';

import { FindCountriesService } from './find-countries.service';

describe('FindCountriesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FindCountriesService = TestBed.get(FindCountriesService);
    expect(service).toBeTruthy();
  });
});
