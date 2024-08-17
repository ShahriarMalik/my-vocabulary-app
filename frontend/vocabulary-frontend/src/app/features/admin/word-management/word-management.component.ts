import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { WordManagementService } from '../../../core/services/word-management-service.service';
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
  templateUrl: './word-management.component.html',
  styleUrls: ['./word-management.component.css'],
})
export class WordManagementComponent {
  wordForm!: FormGroup;
  cefrLevels: string[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  pronunciationUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private wordService: WordManagementService
  ) {
    this.wordForm = this.fb.group({
      searchWord: ['', Validators.required],
      german_word: [''],
      cefr_level: [''],
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
          console.log('Word saved successfully!', response);
        },
        error: (err) => {
          console.error('Failed to save word', err);
        },
      });
    }
  }

  get searchWord() {
    return this.wordForm.get('searchWord')?.valid;
  }
}
