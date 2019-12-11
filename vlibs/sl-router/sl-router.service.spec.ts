import { TestBed } from '@angular/core/testing';

import { SlRouterService } from './sl-router.service';

describe('SlRouterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SlRouterService = TestBed.get(SlRouterService);
    expect(service).toBeTruthy();
  });
});
