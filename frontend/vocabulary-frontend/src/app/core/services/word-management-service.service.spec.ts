import { TestBed } from '@angular/core/testing';

import { WordManagementServiceService } from './word-management-service.service';

describe('WordManagementServiceService', () => {
  let service: WordManagementServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordManagementServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
