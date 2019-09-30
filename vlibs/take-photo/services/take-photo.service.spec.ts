import { TestBed } from '@angular/core/testing';

import { TakePhotoService } from './take-photo.service';

describe('TakePhotoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TakePhotoService = TestBed.get(TakePhotoService);
    expect(service).toBeTruthy();
  });
});
