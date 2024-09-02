import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ExerciseManagementComponent } from './exercises-management.component';
import { LessonService } from '../../../core/services/lesson.service';
import { WordManagementService } from '../../../core/services/word-management.service';
import { ExercisesManagementService } from '../../../core/services/exercises-management.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

jest.mock('../../../core/services/lesson.service');
jest.mock('../../../core/services/word-management.service');
jest.mock('../../../core/services/exercises-management.service');

describe('ExerciseManagementComponent', () => {
  let component: ExerciseManagementComponent;
  let fixture: ComponentFixture<ExerciseManagementComponent>;
  let mockLessonService: jest.Mocked<Partial<LessonService>>;
  let mockWordService: jest.Mocked<Partial<WordManagementService>>;
  let mockExerciseService: jest.Mocked<Partial<ExercisesManagementService>>;

  beforeEach(async () => {
    mockLessonService = {
      fetchLessonsByLevel: jest.fn().mockReturnValue(
        of({
          total: 2,
          lessons: [
            { id: 1, cefr_level: 'A1', lesson_number: 1 },
            { id: 2, cefr_level: 'A1', lesson_number: 2 },
          ],
        })
      ),
    };

    mockWordService = {
      fetchWordsByCefrLevel: jest.fn().mockReturnValue(
        of({
          words: [
            { id: 1, german_word: 'Hund', translation: 'Dog' },
            { id: 2, german_word: 'Katze', translation: 'Cat' },
          ],
        })
      ),
    };

    mockExerciseService = {
      fetchByCefrLevel: jest.fn().mockReturnValue(
        of({
          exercises: [
            {
              id: 23,
              exercise_type: 'Multiple Choice Questions',
              word_id: 1,
              lesson_id: 1,
              cefr_level: 'A1',
              question: 'What is the meaning of Hund?',
              options: ['Dog', 'Cat'],
              correct_option: 'Dog',
            },
          ],
        })
      ),
      create: jest.fn().mockReturnValue(of({ exercise: { id: 24 } })),
      update: jest.fn().mockReturnValue(of({ success: true })),
    };

    await TestBed.configureTestingModule({
      imports: [
        ExerciseManagementComponent,
        ReactiveFormsModule,
        FormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatCardModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: LessonService, useValue: mockLessonService },
        { provide: WordManagementService, useValue: mockWordService },
        { provide: ExercisesManagementService, useValue: mockExerciseService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load lessons correctly', () => {
    component.selectedCefrLevel = 'A1';
    component.loadLessons();

    expect(mockLessonService.fetchLessonsByLevel).toHaveBeenCalledWith(
      'A1',
      40,
      0
    );
    expect(component.lessons.length).toBe(2);
  });

  it('should load words and exercises correctly when a lesson is selected', fakeAsync(() => {
    const selectedLesson = { id: 1, cefr_level: 'A1', lesson_number: 1 };
    component.selectedLesson = selectedLesson;

    component.loadWords();
    tick(4000);

    expect(mockWordService.fetchWordsByCefrLevel).toHaveBeenCalledWith(
      'A1',
      1,
      40,
      0
    );
    expect(mockExerciseService.fetchByCefrLevel).toHaveBeenCalledWith(
      'A1',
      1,
      40,
      0
    );
    expect(component.dataSource.data.length).toBe(2);
    expect(component.dataSource.data[0].word).toBe('Hund');
    expect(component.dataSource.data[0].question).toBe(
      'What is the meaning of Hund?'
    );
  }));

  it('should save a new exercise and reset the form on success', fakeAsync(() => {
    component.selectedLesson = { id: 1, cefr_level: 'A1', lesson_number: 1 };

    const newRow = {
      wordId: 1,
      exerciseType: 'Multiple Choice Questions',
      question: 'What is the meaning of Hund?',
      options: 'Dog, Cat',
      answer: 'Dog',
      isUpdate: false,
      exercise_id: null,
    };

    component.saveOrUpdateExercise(newRow);
    tick(2000);

    expect(mockExerciseService.create).toHaveBeenCalled();
    expect(newRow.isUpdate).toBe(true);
    expect(newRow.exercise_id).toBe(24);
    expect(component.successMessage).toBe('');
  }));

  it('should update an existing exercise and show success message', fakeAsync(() => {
    component.selectedLesson = { id: 1, cefr_level: 'A1', lesson_number: 1 };

    const row = {
      wordId: 1,
      exerciseType: 'Multiple Choice Questions',
      question: 'What is the meaning of Hund?',
      options: 'Dog, Cat',
      answer: 'Dog',
      isUpdate: true,
      exercise_id: 24,
    };

    const mockResponse = { success: true };

    component.saveOrUpdateExercise(row);

    expect(mockExerciseService.update).toHaveBeenCalledWith({
      id: 24,
      exercise_type: 'Multiple Choice Questions',
      word_id: 1,
      lesson_id: 1,
      cefr_level: 'A1',
      question: 'What is the meaning of Hund?',
      options: ['Dog', 'Cat'],
      correct_option: 'Dog',
    });
    expect(component.successMessage).toBe('Exercise updated successfully');
    tick(2000);
    expect(component.successMessage).toBe('');
  }));

  it('should display error message when saving/updating exercise fails', fakeAsync(() => {
    const errorRow = {
      wordId: 1,
      exerciseType: 'Multiple Choice Questions',
      question: '',
      options: '',
      answer: '',
      isUpdate: false,
      exercise_id: null,
    };

    component.saveOrUpdateExercise(errorRow);

    expect(component.errorMessage).toBe('All fields are required');
    expect(mockExerciseService.create).not.toHaveBeenCalled();
    expect(mockExerciseService.update).not.toHaveBeenCalled();
  }));
});
