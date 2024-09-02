import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { WordsManagementComponent } from './words-management.component';
import { WordManagementService } from '../../../core/services/word-management.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('WordManagementComponent', () => {
  let component: WordsManagementComponent;
  let fixture: ComponentFixture<WordsManagementComponent>;
  let mockWordService: any;

  beforeEach(async () => {
    mockWordService = {
      fetchWord: jest.fn(),
      saveWord: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        WordsManagementComponent,
      ],
      providers: [
        { provide: WordManagementService, useValue: mockWordService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WordsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    const form = component.wordForm;
    expect(form).toBeTruthy();
    expect(form.get('searchWord')?.value).toBe('');
    expect(form.get('cefr_level')?.value).toBe('A1');
  });

  it('should fetch word data and populate the form', fakeAsync(() => {
    const mockWordResponse = {
      word: 'Hund',
      pronunciation_url: 'url_to_pronunciation.mp3',
      emoji: '🐕',
      translations: ['Dog'],
      translated_language: 'English',
    };

    mockWordService.fetchWord.mockReturnValue(of(mockWordResponse));

    component.wordForm.get('searchWord')?.setValue('Hund');
    component.onFetchWord();

    tick();

    expect(component.wordForm.get('german_word')?.value).toBe('Hund');
    expect(component.wordForm.get('pronunciation_url')?.value).toBe(
      'url_to_pronunciation.mp3'
    );
    expect(component.wordForm.get('emoji')?.value).toBe('🐕');
    expect(component.wordForm.get('translation')?.value).toBe('Dog');
    expect(component.wordForm.get('translated_language')?.value).toBe(
      'English'
    );
    expect(component.pronunciationUrl).toBe('url_to_pronunciation.mp3');
  }));

  it('should handle fetch word error', fakeAsync(() => {
    const mockError = { status: 404, error: { message: 'Word not found' } };
    mockWordService.fetchWord.mockReturnValue(throwError(() => mockError));

    component.wordForm.get('searchWord')?.setValue('Unknown');
    component.onFetchWord();

    expect(mockWordService.fetchWord).toHaveBeenCalled();
    expect(component.wordForm.get('german_word')?.value).toBe('');

    tick();
    expect(component.errorMessage).toBe('');
  }));

  it('should save the word and reset the form on success', fakeAsync(() => {
    const mockSaveResponse = { message: 'Word saved successfully!' };
    mockWordService.saveWord.mockReturnValue(of(mockSaveResponse));

    component.wordForm.setValue({
      searchWord: 'Hund',
      german_word: 'Hund',
      cefr_level: 'A1',
      pronunciation_url: 'url_to_pronunciation.mp3',
      emoji: '🐕',
      example: 'Ein Hund läuft.',
      translation: 'Dog',
      translated_language: 'English',
    });

    component.onSaveWord();

    expect(mockWordService.saveWord).toHaveBeenCalled();
    expect(component.successMessage).toBe('Word saved successfully!');
    tick(2000);
    expect(component.successMessage).toBe('');

    expect(component.wordForm.value).toEqual({
      searchWord: null,
      german_word: null,
      cefr_level: null,
      pronunciation_url: null,
      emoji: null,
      example: null,
      translation: null,
      translated_language: null,
    });
  }));

  it('should handle save word error', fakeAsync(() => {
    const mockError = { status: 400, error: { message: 'Invalid data' } };
    mockWordService.saveWord.mockReturnValue(throwError(() => mockError));

    component.wordForm.setValue({
      searchWord: 'Hund',
      german_word: 'Hund',
      cefr_level: 'A1',
      pronunciation_url: 'url_to_pronunciation.mp3',
      emoji: '🐕',
      example: 'Ein Hund läuft.',
      translation: 'Dog',
      translated_language: 'English',
    });

    component.onSaveWord();

    expect(mockWordService.saveWord).toHaveBeenCalled();
    expect(component.errorMessage).toBe('Invalid data');
    tick(2000);
    expect(component.errorMessage).toBe('');
  }));
});
