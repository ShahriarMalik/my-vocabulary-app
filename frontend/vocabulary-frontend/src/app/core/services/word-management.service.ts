/**
 * WordManagementService handles fetching and saving word data,
 * as well as retrieving words and its related information by CEFR level and lesson number.
 */

import { Injectable } from '@angular/core';
import { environment } from '../../../base-url.dev';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Word } from '../models/word.model';

@Injectable({
  providedIn: 'root',
})
export class WordManagementService {
  // Base URL for API endpoints
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Fetches a word by its value from the server.
   * @param word - The German word to fetch.
   * @returns An Observable containing the word data as a Word object.
   */
  fetchWord(word: string): Observable<Word> {
    return this.http.get<Word>(`${this.apiUrl}/word/fetch`, {
      params: { word },
    });
  }

  /**
   * Saves word data to the server.
   * @param wordData - The Word object containing data to save.
   * @returns An Observable containing the server response.
   */
  saveWord(wordData: Word): Observable<any> {
    return this.http.post(`${this.apiUrl}/word`, wordData);
  }

  /**
   * Fetches a list of words by CEFR level and lesson number with pagination support.
   * @param cefrLevel - The CEFR level (e.g., A1, B2) to filter words.
   * @param lessonNumber - The lesson number to filter words.
   * @param limit - The maximum number of words to fetch per request.
   * @param offset - The offset for pagination to fetch the next set of words.
   * @returns An Observable containing an array of Word objects.
   */
  fetchWordsByCefrLevel(
    cefrLevel: string,
    lessonNumber: number,
    limit: number,
    offset: number
  ): Observable<{ words: Word[] }> {
    const params = {
      cefr_level: cefrLevel,
      lesson_number: lessonNumber.toString(),
      limit: limit.toString(),
      offset: offset.toString(),
    };

    return this.http.get<{ words: Word[] }>(
      `${this.apiUrl}/words/level/${cefrLevel}`,
      {
        params,
      }
    );
  }
}
