import { TestBed } from '@angular/core/testing';

import { ExercisesManagementService } from './exercises-management.service';

describe('ExercisesManagementService', () => {
  let service: ExercisesManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExercisesManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
