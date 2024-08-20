import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../base-url.dev';
import { Lesson } from '../models/lesson.model';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  // Base URL for API endpoints
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Fetches lessons by CEFR level with pagination support.
   * @param cefrLevel - The CEFR level (e.g., A1, B2) to filter lessons.
   * @param limit - The maximum number of lessons to fetch per request.
   * @param offset - The offset for pagination to fetch the next set of lessons.
   * @returns An Observable containing an object with total lessons count and an array of Lesson objects.
   */
  fetchLessonsByLevel(
    cefrLevel: string,
    limit: number,
    offset: number
  ): Observable<{ total: number; lessons: Lesson[] }> {
    const params = {
      cefr_level: cefrLevel,
      limit: limit.toString(),
      offset: offset.toString(),
    };
    return this.http.get<{ total: number; lessons: Lesson[] }>(
      `${this.apiUrl}/lessons`,
      { params }
    );
  }
}
