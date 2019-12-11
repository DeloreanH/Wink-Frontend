import { TestBed } from '@angular/core/testing';

import { VirtwooAuthServerService } from './virtwoo-auth-server.service';

describe('VirtwooAuthServerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VirtwooAuthServerService = TestBed.get(VirtwooAuthServerService);
    expect(service).toBeTruthy();
  });
});
