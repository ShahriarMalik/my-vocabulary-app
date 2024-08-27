import { TestBed } from '@angular/core/testing';

import { WordManagementService } from './word-management.service';

describe('WordManagementServiceService', () => {
  let service: WordManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
