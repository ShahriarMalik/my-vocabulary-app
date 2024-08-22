import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { ExercisesManagementService } from '../../core/services/exercises-management.service';
import { LessonService } from '../../core/services/lesson.service';
import { Lesson } from '../../core/models/lesson.model';
import { NoticeComponent } from '../../shared/components/notice/notice.component';
import { CefrLessonSelectorComponent } from '../../shared/components/cefr-lesson-selector/cefr-lesson-selector.component';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';

@Component({
  selector: 'app-exercises',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    NoticeComponent,
    CefrLessonSelectorComponent,
    PaginatorComponent,
  ],
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.css'],
})
export class ExercisesComponent {
  errorMessage: string = '';
  successMessage: string = '';

  cefrLevels = ['', 'A1', 'A2', 'B1', 'B2'];
  selectedCefrLevel: string = '';
  lessons: Lesson[] = [];
  selectedLesson: Lesson | null = null;
  limit = 40;
  offset = 0;

  exercises: {
    id: number;
    question: string;
    options: string[];
    correctOption: string;
    selectedOption?: string; // To store the selected option
  }[] = [];

  // This is the array that will store the exercises to show on the current page
  exercisesToShow: {
    id: number;
    question: string;
    options: string[];
    correctOption: string;
    selectedOption?: string;
    isCorrect?: boolean;
    feedbackMessage?: string;
    answerSubmitted?: boolean;
  }[] = [];

  currentPage = 0;
  pageSize = 4;

  constructor(
    private lessonService: LessonService,
    private exerciseService: ExercisesManagementService
  ) {}

  ngOnInit() {}

  loadLessons(): void {
    this.lessonService
      .fetchLessonsByLevel(this.selectedCefrLevel, this.limit, this.offset)
      .subscribe({
        next: (response) => {
          console.log('Received lessons:', response.lessons);
          this.lessons = response.lessons;

          // If lessons are available, select the first lesson by default
          if (this.lessons.length > 0) {
            this.selectedLesson = this.lessons[0];
            this.loadExercises();
          } else {
            this.errorMessage = $localize`:@@noDataAvailableMessage:No data available for the selected CEFR level`;
            setTimeout(() => {
              this.errorMessage = '';
            }, 4000);
          }
        },
        error: (err) => {
          console.warn('Error fetching lessons:', err);
          this.errorMessage = $localize`:@@errorSomethingWentWrong:Something went wrong. Please try again later.`;
          this.lessons = [];
          setTimeout(() => {
            this.errorMessage = '';
          }, 4000);
        },
      });
  }

  onCefrLevelSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCefrLevel = target.value;

    if (!this.selectedCefrLevel) return;

    this.loadLessons();
  }

  onLessonSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedLessonId = parseInt(target.value);
    this.selectedLesson =
      this.lessons.find((lesson) => lesson.id === selectedLessonId) || null;
    console.log(this.selectedLesson);
    this.loadExercises();
  }

  loadExercises() {
    if (this.selectedLesson) {
      this.exerciseService
        .fetchByCefrLevel(
          this.selectedCefrLevel,
          this.selectedLesson.lesson_number,
          this.limit,
          this.offset
        )
        .subscribe({
          next: (response) => {
            if (!response) {
              this.errorMessage =
                'No exercise available for the selection at this moment';
              setTimeout(() => {
                this.errorMessage = '';
              }, 3000);
              this.exercises = [];
              return;
            }
            this.exercises = response.exercises.map((exercise) => ({
              id: Number(exercise.id),
              question: exercise.question.split(' ').pop() || '',
              options: exercise.options,
              correctOption: exercise.correct_option,
            }));

            // Paginate the exercises
            this.paginateExercises();

            console.log(this.exercises);
          },
          error: () => {},
        });
    }
  }

  // Method to handle the option selection
  onOptionSelect(event: Event, exercise: any): void {
    const target = event.target as HTMLInputElement;
    exercise.selectedOption = target.value;
  }
  submitAnswer(exercise: any): void {
    if (exercise.selectedOption === exercise.correctOption) {
      exercise.isCorrect = true;
      exercise.feedbackMessage = $localize`:@@correctAnswer:Correct!`;
    } else {
      exercise.isCorrect = false;
      exercise.feedbackMessage = $localize`:@@incorrectAnswer:Incorrect!`;
    }

    exercise.answerSubmitted = true;

    // Log the status of all exercises
    this.logExerciseStatus();

    setTimeout(() => {
      exercise.feedbackMessage = '';
    }, 3000);
  }

  logExerciseStatus(): void {
    this.exercisesToShow.forEach((exercise) => {
      if (exercise.answerSubmitted) {
        console.log(`Question: ${exercise.question}`);
        console.log(exercise);

        if (exercise.isCorrect) {
          console.log(`Status: Correct`);
        } else {
          console.log(`Status: Incorrect`);
        }
      }
    });
  }

  // Method to paginate the exercises
  paginateExercises(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.exercisesToShow = this.exercises.slice(start, end);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadExercises();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.loadExercises();
  }
}
