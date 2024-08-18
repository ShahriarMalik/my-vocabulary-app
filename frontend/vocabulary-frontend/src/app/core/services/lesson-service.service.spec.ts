import { TestBed } from '@angular/core/testing';

import { LessonServiceService } from './lesson-service.service';

describe('LessonServiceService', () => {
  let service: LessonServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LessonServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
