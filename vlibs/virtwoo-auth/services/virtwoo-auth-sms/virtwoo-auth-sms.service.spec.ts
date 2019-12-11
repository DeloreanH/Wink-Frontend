import { TestBed } from '@angular/core/testing';

import { VirtwooAuthSmsService } from './virtwoo-auth-sms.service';

describe('VirtwooAuthSmsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VirtwooAuthSmsService = TestBed.get(VirtwooAuthSmsService);
    expect(service).toBeTruthy();
  });
});
