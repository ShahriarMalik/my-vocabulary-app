import { TestBed } from '@angular/core/testing';

import { ProgressService } from './progress.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '../../../base-url.dev';
import { UserProgress } from '../models/user-progress.model';
import { CefrProgressResponse } from '../models/cefr-progress.model';
import { LessonProgressResponse } from '../models/lesson-progress.model';

describe('ProgressService', () => {
  let service: ProgressService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProgressService],
    });
    service = TestBed.inject(ProgressService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveProgress', () => {
    it('should send a POST request to save user progress', () => {
      const progressData: UserProgress = {
        user_id: 1,
        cefr_level: 'A1',
        lesson_id: 10,
        word_id: 10,
        word_score: 1,
        word_completed: true,
        exercise_id: 10,
        exercise_score: 1,
        exercise_completed: true,
      };
      const mockReponse = {
        message: 'User progress saved successfully',
      };

      service.saveProgress(progressData).subscribe((response) => {
        expect(response).toEqual(mockReponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/user-progress/save`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(progressData);
      req.flush(mockReponse);
    });
  });

  describe('updateProgress', () => {
    it('should update user progress on the server', () => {
      const mockProgressData: UserProgress = {
        user_id: 1,
        cefr_level: 'A1',
        lesson_id: 101,
        word_id: 1001,
        word_score: 1,
        word_completed: true,
        exercise_id: 2001,
        exercise_score: 1,
        exercise_completed: true,
      };

      const mockResponse = { message: 'User progress updated successfully' };

      service.updateProgress(mockProgressData).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/user-progress/update`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockProgressData);
      req.flush(mockResponse);
    });
  });

  describe('getCefrProgress', () => {
    it('should return the progress based on CEFR level', () => {
      const userId = 1;
      const mockResponse: CefrProgressResponse = {
        cefr_levels: [
          {
            cefr_level: 'A1',
            total_lessons: 10,
            completed_lessons: 5,
            progress_percentage: 50,
          },
        ],
      };

      service.getCefrProgress(userId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${apiUrl}/user-progress/cefr-levels?user_id=${userId}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getLessonProgress', () => {
    it('should return the lesson progress based on the selected CEFR', () => {
      const user_id = 1;
      const cefr_level = 'A1';
      const mockReponse: LessonProgressResponse = {
        lessons: [
          {
            cefr_level: 'A1',
            lesson_id: 1,
            total_exercises: 20,
            completed_exercises: 10,
            progress_percentage: 50,
            exercises: [
              {
                exercise_id: 1,
                word_id: 1,
                question: 'What is meaning of ab?',
                completed: true,
              },
            ],
          },
        ],
      };

      service.getLessonProgress(user_id, cefr_level).subscribe((response) => {
        expect(response).toEqual(mockReponse);
      });

      const req = httpMock.expectOne(
        `${apiUrl}/user-progress/lessons?user_id=${user_id}&cefr_level=${cefr_level}`
      );

      expect(req.request.method).toBe('GET');
      req.flush(mockReponse);
    });
  });
});
