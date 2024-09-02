import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { LearnComponent } from './learn.component';
import { LessonService } from '../../core/services/lesson.service';
import { WordManagementService } from '../../core/services/word-management.service';
import { Lesson } from '../../core/models/lesson.model';
import { Word } from '../../core/models/word.model';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

// Automatically mock the services
jest.mock('../../core/services/lesson.service');
jest.mock('../../core/services/word-management.service');

describe('LearnComponent', () => {
  let component: LearnComponent;
  let fixture: ComponentFixture<LearnComponent>;
  let mockLessonService: jest.Mocked<LessonService>;
  let mockWordService: jest.Mocked<WordManagementService>;

  // Static data mimicking what would be returned by the API
  const mockLessons: Lesson[] = [
    {
      id: 11,
      cefr_level: 'A1',
      lesson_number: 11,
      created_at: new Date('2024-08-03 04:08:07.852741'),
    },
    {
      id: 12,
      cefr_level: 'A1',
      lesson_number: 12,
      created_at: new Date('2024-08-03 04:08:07.852741'),
    },
  ];

  const mockWords: Word[] = [
    {
      id: 40,
      word: 'Arbeitsplatz',
      translations: ['Workplace'],
      emoji: '',
      pronunciation_url:
        'https://vocabulary-audio-files.s3.eu-central-1.amazonaws.com/audio/Arbeitsplatz.mp3',
      translated_language: 'en',
    },
    {
      id: 41,
      word: 'Urlaub',
      translations: ['Vacation'],
      emoji: '',
      pronunciation_url:
        'https://vocabulary-audio-files.s3.eu-central-1.amazonaws.com/audio/Urlaub.mp3',
      translated_language: 'en',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearnComponent],
      providers: [
        LessonService,
        WordManagementService,
        provideHttpClient(withInterceptorsFromDi()),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LearnComponent);
    component = fixture.componentInstance;
    mockLessonService = TestBed.inject(
      LessonService
    ) as jest.Mocked<LessonService>;
    mockWordService = TestBed.inject(
      WordManagementService
    ) as jest.Mocked<WordManagementService>;

    // Mock the methods on the services
    mockLessonService.fetchLessonsByLevel.mockReturnValue(
      of({ total: mockLessons.length, lessons: mockLessons })
    );
    mockWordService.fetchWordsByCefrLevel.mockReturnValue(
      of({ words: mockWords })
    );

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial values set correctly', () => {
    expect(component.errorMessage).toBe('');
    expect(component.successMessage).toBe('');
    expect(component.lessons).toEqual([]);
    expect(component.selectedLesson).toBeNull();
    expect(component.cefrLevels).toEqual(['', 'A1', 'A2', 'B1', 'B2']);
    expect(component.selectedCefrLevel).toBe('');
    expect(component.limit).toBe(40);
    expect(component.offset).toBe(0);
    expect(component.allWords).toEqual([]);
    expect(component.paginatedWords).toEqual([]);
    expect(component.currentPage).toBe(0);
    expect(component.pageSize).toBe(4);
  });

  it('should call loadLessons when a CEFR level is selected', () => {
    const spyLoadLessons = jest.spyOn(component, 'loadLessons');
    const mockEvent = { target: { value: 'A2' } } as unknown as Event;

    component.onCefrLevelSelect(mockEvent);

    expect(component.selectedCefrLevel).toBe('A2');
    expect(spyLoadLessons).toHaveBeenCalled();
  });

  it('should call loadWords when a lesson is selected', () => {
    component.lessons = [mockLessons[0]];
    const spyLoadWords = jest.spyOn(component, 'loadWords');
    const mockEvent = { target: { value: '11' } } as unknown as Event;

    component.onLessonSelect(mockEvent);

    expect(component.selectedLesson).toEqual(mockLessons[0]);
    expect(component.currentPage).toBe(0);
    expect(spyLoadWords).toHaveBeenCalled();
  });

  it('should load lessons and select the first one', () => {
    component.loadLessons();

    expect(component.lessons).toEqual(mockLessons);
    expect(component.selectedLesson).toEqual(mockLessons[0]);
    expect(component.currentPage).toBe(0);
  });

  it('should set errorMessage if loadLessons fails', () => {
    mockLessonService.fetchLessonsByLevel.mockReturnValue(
      throwError(() => new Error('Error'))
    );

    component.loadLessons();

    expect(component.errorMessage).toBe(
      'Something went wrong. Please try again later.'
    );
  });

  it('should load words and paginate them', () => {
    component.selectedLesson = mockLessons[0];
    component.loadWords();

    expect(component.allWords.length).toBe(mockWords.length);
    expect(component.paginatedWords.length).toBe(2);
  });

  it('should set errorMessage if loadWords fails', () => {
    mockWordService.fetchWordsByCefrLevel.mockReturnValue(
      throwError(() => new Error('Error'))
    );

    component.selectedLesson = mockLessons[0];
    component.loadWords();

    expect(component.errorMessage).toBe(
      'Error fetching words for the selected lesson'
    );
  });

  it('should paginate words correctly', () => {
    component.allWords = [...mockWords, ...mockWords];
    component.pageSize = 2;
    component.currentPage = 1;

    // Run pagination
    component.paginateWords();

    // Verifying that the correct slice of words is paginated
    expect(component.paginatedWords.length).toBe(2);
  });
});
