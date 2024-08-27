import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { LessonService } from '../../../core/services/lesson.service';
import { WordManagementService } from '../../../core/services/word-management.service';
import { ExercisesManagementService } from '../../../core/services/exercises-management.service';
import { Lesson } from '../../../core/models/lesson.model';
import { Word } from '../../../core/models/word.model';
import { Exercise } from '../../../core/models/exercise.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-exercise-management',
  standalone: true,
  imports: [
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
  ],
  templateUrl: './exercises-management.component.html',
  styleUrls: ['./exercises-management.component.css'],
})
export class ExerciseManagementComponent implements OnInit {
  cefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  selectedCefrLevel: string = 'A1';
  lessons: Lesson[] = [];
  words: Word[] = [];
  selectedLesson: Lesson | null = null;
  errorMessage = '';
  successMessage = '';

  limit = 40;
  offset = 0;
  totalWords: number = 0;

  displayedColumns: string[] = [
    'wordId',
    'word',
    'exerciseType',
    'question',
    'options',
    'answer',
    'actions',
  ];

  dataSource = new MatTableDataSource<any>([]);

  constructor(
    private lessonService: LessonService,
    private wordService: WordManagementService,
    private exerciseService: ExercisesManagementService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLessons();
  }

  loadLessons(): void {
    this.lessonService
      .fetchLessonsByLevel(this.selectedCefrLevel, this.limit, this.offset)
      .subscribe({
        next: (response) => {
          this.lessons = response.lessons;
          console.log('Lessons', this.lessons);
        },
        error: (err) => {
          this.errorMessage = $localize`:noData:No data available`;
          this.selectedLesson = null;
          console.warn('Error fetching lessons:', err);
        },
      });

    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 3000);
  }

  onLessonSelect(lesson: Lesson): void {
    this.selectedLesson = lesson;
    this.loadWords();
  }

  loadWords(): void {
    if (!this.selectedLesson) return;

    // Fetch words and exercises concurrently
    const wordRequest = this.wordService.fetchWordsByCefrLevel(
      this.selectedCefrLevel,
      this.selectedLesson.lesson_number,
      this.limit,
      this.offset
    );

    const exerciseRequest = this.exerciseService.fetchByCefrLevel(
      this.selectedCefrLevel,
      this.selectedLesson.lesson_number,
      this.limit,
      this.offset
    );

    // Combine both requests using forkJoin (RxJS)
    forkJoin([wordRequest, exerciseRequest]).subscribe({
      next: ([wordResponse, exerciseResponse]) => {
        console.log(wordResponse, exerciseResponse);

        // Map exercises by word ID for easy lookup
        const exerciseMap = new Map<number, any>();
        if (exerciseResponse !== null) {
          exerciseResponse.exercises.forEach((exercise: any) => {
            if (exercise.word_id) exerciseMap.set(exercise.word_id, exercise);
          });
        }

        // Update words data
        this.dataSource.data = wordResponse.words.map((word: any) => {
          const exercise = exerciseMap.get(word.id);
          return {
            wordId: word.id,
            word: word.german_word,
            exerciseType: exercise
              ? exercise.exercise_type
              : 'Multiple Choice Questions',
            question: exercise
              ? exercise.question
              : `What is the meaning of ${word.german_word}`,
            options: exercise ? exercise.options.join(', ') : '',
            answer: exercise ? exercise.correct_option : word.translation,
            isUpdate: !!exercise,
            exercise_id: exercise ? exercise.id : null,
          };
        });
      },

      error: (err) => {
        this.errorMessage = $localize`:noData:No data available`;
        this.selectedLesson = null;
        console.warn('Error fetching data:', err);
      },
    });
    this.cdr.detectChanges(); // Ensure the view is updated

    // Clear success and error messages after a delay
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 4000);
  }

  saveOrUpdateExercise(row: any): void {
    if (!row.exerciseType || !row.question || !row.options || !row.answer) {
      this.errorMessage = $localize`:allFieldRequired:All fields are required`;
      return;
    }

    const exerciseData: Exercise = {
      id: row.exercise_id,
      exercise_type: row.exerciseType,
      word_id: row.wordId,
      lesson_id: this.selectedLesson!.id,
      cefr_level: this.selectedCefrLevel,
      question: row.question,
      options: row.options.trim().split(', '), // options are comma-separated
      correct_option: row.answer,
    };

    console.log(exerciseData);

    if (row.isUpdate) {
      // Update logic
      this.exerciseService.update(exerciseData).subscribe({
        next: (response) => {
          this.successMessage = $localize`:exerciseUpdatedSuccessfully:Exercise updated successfully`;
          console.log('Exercise updated:', response);
        },
        error: (err) => {
          this.errorMessage = $localize`:errorUpdateExercise:Error updating exercise`;
          console.warn('Error updating exercise:', err);
        },
      });
    } else {
      this.exerciseService.create(exerciseData).subscribe({
        next: (response) => {
          row.isUpdate = !!response.exercise.id;
          row.exercise_id = response.exercise.id;
          // this.successMessage = 'Exercise created successfully';
          console.log('Exercise created:', response);
        },
        error: (err) => {
          this.errorMessage = $localize`:errorCreateExercise:Error creating exercise`;
          console.warn('Error creating exercise:', err);
        },
      });
    }

    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 2000);
  }
}
