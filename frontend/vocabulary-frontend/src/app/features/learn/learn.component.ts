import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Lesson } from '../../core/models/lesson.model';
import { Exercise } from '../../core/models/exercise.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LessonService } from '../../core/services/lesson.service';
import { ExercisesManagementService } from '../../core/services/exercises-management.service';

@Component({
  selector: 'app-learn',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './learn.component.html',
  styleUrl: './learn.component.css',
})
export class LearnComponent {
  // isChildRouteActive: boolean = false;

  // constructor(private router: Router, private route: ActivatedRoute) {
  //   this.router.events.subscribe(() => {
  //     this.isChildRouteActive = this.route.firstChild !== null;
  //   });
  // }

  cefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  selectedLevel: string | null = null;
  lessons: Lesson[] = [];
  selectedLesson: Lesson | null = null;
  exercises: Exercise[] = [];
  currentExerciseIndex: number = 0;

  exerciseForm: FormGroup;
  feedbackMessage: string = '';
  feedbackColor: string = '';

  constructor(
    private fb: FormBuilder,
    private lessonService: LessonService,
    private exerciseService: ExercisesManagementService
  ) {
    // Initialize the form
    this.exerciseForm = this.fb.group({
      exerciseOption: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Initial actions can be handled here if needed
  }

  // Method to select a level and load lessons
  selectLevel(level: string): void {
    this.selectedLevel = level;
    this.loadLessons();
  }

  // Method to load lessons based on the selected level
  loadLessons(): void {
    this.lessonService
      .fetchLessonsByLevel(this.selectedLevel!, 40, 0)
      .subscribe({
        next: (response) => {
          this.lessons = response.lessons;
        },
        error: (error) => {
          console.error('Error loading lessons:', error);
        },
      });
  }

  // Method to select a lesson and load exercises
  selectLesson(lesson: Lesson): void {
    this.selectedLesson = lesson;
    this.loadExercises();
  }

  // Method to load exercises for the selected lesson
  loadExercises(): void {
    this.exerciseService
      .fetchByCefrLevel(
        this.selectedLevel!,
        this.selectedLesson!.lesson_number,
        40,
        0
      )
      .subscribe({
        next: (response) => {
          this.exercises = response.exercises;
          this.currentExerciseIndex = 0;
          this.initializeForm();
        },
        error: (error) => {
          console.error('Error loading exercises:', error);
        },
      });
  }

  // Method to initialize the form for the current exercise
  initializeForm(): void {
    this.exerciseForm.reset();
    this.exerciseForm.patchValue({
      exerciseOption: '',
    });
  }

  // Method to submit the answer for the current exercise
  submitAnswer(): void {
    // const selectedOption = this.exerciseForm.get('exerciseOption')?.value;
    // if (selectedOption === this.exercises[this.currentExerciseIndex].correctOption) {
    //   this.feedbackMessage = `Correct! ${this.exercises[this.currentExerciseIndex].question.split(' ')[4]} means ${this.exercises[this.currentExerciseIndex].correctOption}.`;
    //   this.feedbackColor = 'green';
    // } else {
    //   this.feedbackMessage = `Incorrect! The correct answer is ${this.exercises[this.currentExerciseIndex].correctOption}.`;
    //   this.feedbackColor = 'red';
    // }
    // setTimeout(() => {
    //   this.feedbackMessage = '';
    //   this.feedbackColor = '';
    //   this.moveToNextExercise();
    // }, 3000);
  }

  // Method to move to the next exercise
  moveToNextExercise(): void {
    if (this.currentExerciseIndex < this.exercises.length - 1) {
      this.currentExerciseIndex++;
      this.initializeForm();
    }
  }
}
