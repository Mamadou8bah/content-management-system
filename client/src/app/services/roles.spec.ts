import { TestBed } from '@angular/core/testing';

import { Roles } from './roles';

describe('Roles', () => {
  let service: Roles;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Roles);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
