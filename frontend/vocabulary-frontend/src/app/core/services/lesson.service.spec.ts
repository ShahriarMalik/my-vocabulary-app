import { TestBed } from '@angular/core/testing';

import { LessonService } from './lesson.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '../../../base-url.dev';
import { response } from 'express';

describe('LessonService', () => {
  let service: LessonService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LessonService],
    });
    service = TestBed.inject(LessonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('', () => {
    it('should fetch lessons by CEFR level with pagination', () => {
      const cefrLevel = 'A1';
      const limit = 10;
      const offset = 0;
      const mockResponse = {
        message: 'Lessons List',
        total: 1,
        lessons: [
          {
            id: 11,
            cefr_level: 'A1',
            lesson_number: 11,
            created_at: new Date('2024-08-03 04:08:07.852741'),
          },
        ],
      };

      service
        .fetchLessonsByLevel(cefrLevel, limit, offset)
        .subscribe((response) => {
          expect(response).toEqual({
            total: mockResponse.total,
            lessons: mockResponse.lessons,
          });
        });

      const req = httpMock.expectOne(
        `${apiUrl}/lessons?cefr_level=${cefrLevel}&limit=${limit}&offset=${offset}`
      );
      expect(req.request.method).toBe('GET');
      req.flush({
        total: mockResponse.total,
        lessons: mockResponse.lessons,
      });
    });
  });
});
