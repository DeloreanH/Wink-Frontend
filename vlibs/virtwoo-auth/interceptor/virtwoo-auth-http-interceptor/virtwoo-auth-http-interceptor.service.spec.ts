import { TestBed } from '@angular/core/testing';

import { VirtwooAuthHttpInterceptorService } from './virtwoo-auth-http-interceptor.service';

describe('VirtwooAuthHttpInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VirtwooAuthHttpInterceptorService = TestBed.get(VirtwooAuthHttpInterceptorService);
    expect(service).toBeTruthy();
  });
});
