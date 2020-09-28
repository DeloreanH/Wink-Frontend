import { TestBed } from '@angular/core/testing';

import { VirtwooAuthFacebookService } from './virtwoo-auth-facebook.service';

describe('VirtwooAuthFacebookService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VirtwooAuthFacebookService = TestBed.get(VirtwooAuthFacebookService);
    expect(service).toBeTruthy();
  });
});
