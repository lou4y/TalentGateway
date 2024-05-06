import { TestBed } from '@angular/core/testing';

import { TestuserService } from './testuser.service';

describe('TestuserService', () => {
  let service: TestuserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestuserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
