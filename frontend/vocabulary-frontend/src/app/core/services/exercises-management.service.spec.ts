import { TestBed } from '@angular/core/testing';

import { ExercisesManagementService } from './exercises-management.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Exercise } from '../models/exercise.model';
import { environment } from '../../../base-url.dev';

describe('ExercisesManagementService', () => {
  let service: ExercisesManagementService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExercisesManagementService],
    });
    service = TestBed.inject(ExercisesManagementService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchByCefrLevel', () => {
    it('should fetch exercises by CEFR level and lesson number', () => {
      const cefrLevel = 'A1';
      const lessonNumber = 1;
      const limit = 10;
      const offset = 0;
      const mockResponse = {
        exercises: [
          {
            id: 1,
            exercise_type: 'multiple-choice',
            word_id: 123,
            lesson_id: 1,
            cefr_level: 'A1',
            question: 'What is the meaning of "ab"?',
            options: ['from', 'to', 'by', 'for'],
            correct_option: 'from',
          },
        ] as Exercise[],
      };

      service
        .fetchByCefrLevel(cefrLevel, lessonNumber, limit, offset)
        .subscribe((response) => {
          expect(response).toEqual(mockResponse);
        });

      const req = httpMock.expectOne(
        `${apiUrl}/exercises/${cefrLevel}?cefr_level=${cefrLevel}&lesson_number=${lessonNumber}&limit=${limit}&offset=${offset}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('create', () => {
    it('should create a new exercise', () => {
      const newExercise: Exercise = {
        exercise_type: 'multiple-choice',
        word_id: 1,
        lesson_id: 1,
        cefr_level: 'A1',
        question: 'What is the meaning of "ab"?',
        options: ['from', 'to', 'by', 'for'],
        correct_option: 'from',
      };

      const mockResponse = { exercise: { ...newExercise, id: 1 } };

      service.create(newExercise).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/exercises`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newExercise);
      req.flush(mockResponse);
    });
  });

  describe('update', () => {
    it('should update an existing exercise', () => {
      const updatedExercise: Exercise = {
        id: 1,
        exercise_type: 'multiple-choice',
        word_id: 12,
        lesson_id: 1,
        cefr_level: 'A1',
        question: 'What is the meaning of "ab"?',
        options: ['from', 'to', 'by', 'for'],
        correct_option: 'from',
      };

      service.update(updatedExercise).subscribe((response) => {
        expect(response).toEqual(updatedExercise);
      });

      const req = httpMock.expectOne(`${apiUrl}/exercises`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedExercise);
      req.flush(updatedExercise);
    });
  });

  describe('delete', () => {
    it('should delete an exercise by ID', () => {
      const exerciseId = 1;

      service.delete(exerciseId).subscribe((response) => {
        expect(response).toEqual({});
      });

      const req = httpMock.expectOne(`${apiUrl}/exercises/${exerciseId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('fetchId', () => {
    it('should fetch an exercise by ID', () => {
      const exerciseId = 1;
      const mockExercise: Exercise = {
        id: exerciseId,
        exercise_type: 'multiple-choice',
        word_id: 1,
        lesson_id: 1,
        cefr_level: 'A1',
        question: 'What is the meaning of "ab"?',
        options: ['from', 'to', 'by', 'for'],
        correct_option: 'from',
      };

      service.fetchById(exerciseId).subscribe((response) => {
        expect(response).toEqual(mockExercise);
      });

      const req = httpMock.expectOne(`${apiUrl}/exercises/${exerciseId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockExercise);
    });
  });

  describe('fetchAll', () => {
    it('should fetch all exercises', () => {
      const mockExercises: Exercise[] = [
        {
          id: 1,
          exercise_type: 'multiple-choice',
          word_id: 1,
          lesson_id: 1,
          cefr_level: 'A1',
          question: 'What is the meaning of "reisen"?',
          options: ['travel', 'stay', 'eat', 'write'],
          correct_option: 'travel',
        },
        {
          id: 5,
          exercise_type: 'multiple-choice',
          word_id: 5,
          lesson_id: 1,
          cefr_level: 'A1',
          question: 'What is the meaning of "Geschlecht" ?',
          options: ['Gender', 'Age', 'Name', 'Address'],
          correct_option: 'Gender',
        },
      ];

      service.fetchAll().subscribe((response) => {
        expect(response).toEqual(mockExercises);
      });

      const req = httpMock.expectOne(`${apiUrl}/exercises`);
      expect(req.request.method).toBe('GET');
      req.flush(mockExercises);
    });
  });

  describe('fetchByLesson', () => {
    it('should fetch exercises by lesson ID', () => {
      const lessonId = 1;
      const mockExercises: Exercise[] = [
        {
          id: 5,
          exercise_type: 'multiple-choice',
          word_id: 5,
          lesson_id: 1,
          cefr_level: 'A1',
          question: 'What is the meaning of "Geschlecht" ?',
          options: ['Gender', 'Age', 'Name', 'Address'],
          correct_option: 'Gender',
        },
      ];

      service.fetchByLesson(lessonId).subscribe((response) => {
        expect(response).toEqual(mockExercises);
      });

      const req = httpMock.expectOne(`${apiUrl}/exercises/lesson/${lessonId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockExercises);
    });
  });
});
