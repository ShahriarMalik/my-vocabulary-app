import { TestBed } from '@angular/core/testing';

import { UniqueEmailValidatorService } from './unique-email-validator.service';

describe('UniqueEmailValidatorService', () => {
  let service: UniqueEmailValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UniqueEmailValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
