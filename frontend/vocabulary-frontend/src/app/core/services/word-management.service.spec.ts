import { TestBed } from '@angular/core/testing';

import { WordManagementService } from './word-management.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Word } from '../models/word.model';
import { environment } from '../../../base-url.dev';

describe('WordManagementServiceService', () => {
  let service: WordManagementService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WordManagementService],
    });
    service = TestBed.inject(WordManagementService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchWord', () => {
    it('should fetch a word by its value', () => {
      const mockWord: Word = {
        id: 1,
        word: 'Apfel',
        translations: ['Apple'],
        emoji: '🍎',
        pronunciation_url:
          'https://vocabulary-audio-files.s3.eu-central-1.amazonaws.com/audio/apfel.mp3',
        translated_language: 'en',
      };

      service.fetchWord('Apfel').subscribe((word) => {
        expect(word).toEqual(mockWord);
      });

      const req = httpMock.expectOne(`${apiUrl}/word/fetch?word=Apfel`);
      expect(req.request.method).toBe('GET');
      req.flush(mockWord);
    });
  });

  describe('saveWord', () => {
    it('should save a word and return the server response', () => {
      const newWord: Word = {
        id: 1,
        word: 'Apfel',
        translations: ['Apple'],
        emoji: '🍎',
        pronunciation_url:
          'https://vocabulary-audio-files.s3.eu-central-1.amazonaws.com/audio/apfel.mp3',
        translated_language: 'en',
      };

      const mockResponse = { message: 'Word saved successfully' };

      service.saveWord(newWord).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/word`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newWord);
      req.flush(mockResponse);
    });
  });

  describe('fetchWordsByCefrLevel', () => {
    it('should fetch words by CEFR level and lesson number', () => {
      const cefrLevel = 'A1';
      const lessonNumber = 1;
      const limit = 10;
      const offset = 0;
      const mockWordsResponse = {
        words: [
          {
            id: 3,
            word: 'Tisch',
            translations: ['Table'],
            emoji: '🪑',
            pronunciation_url:
              'https://vocabulary-audio-files.s3.eu-central-1.amazonaws.com/audio/tisch.mp3',
            translated_language: 'en',
          },
        ] as Word[],
      };

      service
        .fetchWordsByCefrLevel(cefrLevel, lessonNumber, limit, offset)
        .subscribe((response) => {
          expect(response).toEqual(mockWordsResponse);
        });

      const req = httpMock.expectOne(
        `${apiUrl}/words/level/${cefrLevel}?cefr_level=${cefrLevel}&lesson_number=${lessonNumber}&limit=${limit}&offset=${offset}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockWordsResponse);
    });
  });
});
