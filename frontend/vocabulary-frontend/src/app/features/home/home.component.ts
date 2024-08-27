import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { NoticeComponent } from '../../shared/components/notice/notice.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatExpansionModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    RouterLink,
    ReactiveFormsModule,
    NoticeComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  // Sample exercises data
  exercises = [
    {
      question: $localize`:@@klimaQuestion:What is the meaning of Klima?`,
      options: ['Climate', 'Weather', 'Temperature', 'Atmosphere'],
      correctOption: 'Climate',
      german_word: 'Klima',
    },
  ];

  currentExerciseIndex: number = 0; // Track the current exercise
  exerciseForm: FormGroup; // Reactive form group
  feedbackMessage: string = '';
  feedbackColor: string = '';

  constructor(private fb: FormBuilder) {
    // Initialize the form with the options
    this.exerciseForm = this.fb.group({
      exerciseOption: ['', Validators.required], // Radio button form control
    });
  }

  // Method to submit the answer
  submitAnswer() {
    const selectedOption = this.exerciseForm.get('exerciseOption')?.value;

    if (
      selectedOption === this.exercises[this.currentExerciseIndex].correctOption
    ) {
      this.feedbackMessage = $localize`:@@correctFeedback:Correct! ${
        this.exercises[this.currentExerciseIndex].german_word
      } means ${this.exercises[this.currentExerciseIndex].correctOption}.`;
      this.feedbackColor = 'green';
    } else {
      this.feedbackMessage = $localize`:@@incorrectFeedback:Incorrect! The correct answer is ${
        this.exercises[this.currentExerciseIndex].correctOption
      }.`;
      this.feedbackColor = 'red';
    }

    setTimeout(() => {
      this.exerciseForm.reset();
      this.feedbackMessage = '';
      this.feedbackColor = '';
    }, 3000);
  }
}
