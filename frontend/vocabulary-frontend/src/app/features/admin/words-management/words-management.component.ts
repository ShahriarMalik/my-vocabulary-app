import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { WordManagementService } from '../../../core/services/word-management.service';
import { Word } from '../../../core/models/word.model';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-word-management',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './words-management.component.html',
  styleUrls: ['./words-management.component.css'],
})
export class WordsManagementComponent {
  wordForm!: FormGroup;
  cefrLevels: string[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  pronunciationUrl: string | null = null;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private wordService: WordManagementService
  ) {
    this.wordForm = this.fb.group({
      searchWord: ['', Validators.required],
      german_word: [''],
      cefr_level: ['A1'],
      pronunciation_url: [''],
      emoji: [''],
      example: [''],
      translation: [''],
      translated_language: [''], // <-- Ensure this is added
    });
  }

  onFetchWord() {
    const word = this.wordForm.get('searchWord')?.value;
    this.wordService.fetchWord(word).subscribe({
      next: (response: Word) => {
        console.log('Fetched Word Data:', response);

        this.wordForm.patchValue({
          german_word: response.word,
          cefr_level: 'A1', // Change this line for other level
          pronunciation_url: response.pronunciation_url,
          emoji: response.emoji,
          translation: response.translations.join(', '),
          translated_language: response.translated_language,
        });

        // Update the audio URL separately to force the reload
        this.pronunciationUrl = null; // Reset the audio source
        setTimeout(() => {
          this.pronunciationUrl = response.pronunciation_url; // Assign the new URL
        }, 0);
      },
      error: (err) => {
        console.error('Error fetching word', err);
      },
    });
  }

  onSaveWord() {
    if (this.wordForm.valid) {
      const wordData: Word = this.wordForm.value;
      this.wordService.saveWord(wordData).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          console.log('Word saved successfully!', response);
        },
        error: (error) => {
          if (error.status === 400) {
            this.errorMessage = error.error?.message;
          } else {
            this.errorMessage = $localize`:7158033106518253277:An unexpected error occurred. Please try again later`;
          }
          console.error('Failed to save word', error);
        },
      });

      this.wordForm.reset();
      Object.keys(this.wordForm.controls).forEach((key) => {
        this.wordForm.get(key)?.setErrors(null);
      });
      setTimeout(() => {
        this.successMessage = '';
        this.errorMessage = '';
      }, 2000);
    }
  }

  get searchWord() {
    return this.wordForm.get('searchWord')?.valid;
  }
}
