import { TestBed } from '@angular/core/testing';

import { VirtwooAuthGoogleService } from './virtwoo-auth-google.service';

describe('VirtwooAuthGoogleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VirtwooAuthGoogleService = TestBed.get(VirtwooAuthGoogleService);
    expect(service).toBeTruthy();
  });
});
