import { TestBed } from '@angular/core/testing';

import { Articles } from './articles';

describe('Articles', () => {
  let service: Articles;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Articles);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
