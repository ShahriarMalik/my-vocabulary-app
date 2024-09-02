import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ExercisesComponent } from './exercises.component';
import { ExercisesManagementService } from '../../core/services/exercises-management.service';
import { LessonService } from '../../core/services/lesson.service';
import { AuthService } from '../../core/services/auth.service';
import { ProgressService } from '../../core/services/progress.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';

jest.mock('../../core/services/lesson.service');
jest.mock('../../core/services/exercises-management.service');
jest.mock('../../core/services/auth.service');
jest.mock('../../core/services/progress.service');

describe('ExercisesComponent', () => {
  let component: ExercisesComponent;
  let fixture: ComponentFixture<ExercisesComponent>;
  let mockLessonService: jest.Mocked<Partial<LessonService>>;
  let mockExerciseService: jest.Mocked<Partial<ExercisesManagementService>>;
  let mockAuthService: jest.Mocked<Partial<AuthService>>;
  let mockProgressService: jest.Mocked<Partial<ProgressService>>;

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

    mockExerciseService = {
      fetchByCefrLevel: jest.fn().mockReturnValue(
        of({
          exercises: [
            {
              id: 23,
              exercise_type: 'Multiple Choice Questions',
              word_id: 21,
              lesson_id: 2,
              cefr_level: 'A1',
              question: 'What is the meaning of Klima',
              options: ['Climate', 'Weather', 'Temperature', 'Atmosphere'],
              correct_option: 'Climate',
              german_word: 'Klima',
              translation: 'Climate',
            },
          ],
        })
      ),
    };

    mockAuthService = {
      getUserIdFromToken: jest.fn().mockReturnValue('1'),
    };

    mockProgressService = {
      saveProgress: jest.fn().mockReturnValue(of({ success: true })),
    };

    await TestBed.configureTestingModule({
      imports: [
        ExercisesComponent,
        ReactiveFormsModule,
        FormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatCardModule,
      ],
      providers: [
        { provide: LessonService, useValue: mockLessonService },
        { provide: ExercisesManagementService, useValue: mockExerciseService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ProgressService, useValue: mockProgressService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExercisesComponent);
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

  it('should load exercises correctly', () => {
    component.selectedCefrLevel = 'A1';
    component.selectedLesson = { id: 2, cefr_level: 'A1', lesson_number: 2 };
    component.loadExercises();

    expect(mockExerciseService.fetchByCefrLevel).toHaveBeenCalledWith(
      'A1',
      2,
      40,
      0
    );
    expect(component.exercises.length).toBe(1);
    // "What is the meaning of" translated for DE and EN
    expect(component.exercises[0].question).toBe('Klima');
  });

  it('should save progress correctly after submitting the correct answer', () => {
    component.selectedCefrLevel = 'A1';
    component.selectedLesson = { id: 2, cefr_level: 'A1', lesson_number: 2 };
    component.loadExercises();
    fixture.detectChanges();

    const mockExercise = component.exercises[0];
    mockExercise.selectedOption = 'Climate';

    component.submitAnswer(mockExercise);

    expect(mockExercise.correctOption).toBe('Climate');
    expect(mockProgressService.saveProgress).toHaveBeenCalled();
  });
});
