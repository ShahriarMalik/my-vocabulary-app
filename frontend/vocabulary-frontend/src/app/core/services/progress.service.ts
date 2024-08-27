/**
 * ProgressService handles the saving, updating, and fetching of user progress data
 * related to CEFR levels and lessons from the server.
 */
import { Injectable } from '@angular/core';
import { environment } from '../../../base-url.dev';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { UserProgress } from '../models/user-progress.model';
import {
  CefrProgress,
  CefrProgressResponse,
} from '../models/cefr-progress.model';
import {
  LessonProgress,
  LessonProgressResponse,
} from '../models/lesson-progress.model';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  // Base URL for API endpoints
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Saves user progress to the server.
   * @param progressData - The UserProgress object containing data to save.
   * @returns An Observable containing the server response.
   */
  saveProgress(progressData: UserProgress): Observable<any> {
    return this.http.post(`${this.apiUrl}/user-progress/save`, progressData);
  }

  /**
   * Updates user progress on the server.
   * @param progressData - The UserProgress object containing updated data.
   * @returns An Observable containing the server response.
   */
  updateProgress(progressData: UserProgress): Observable<any> {
    return this.http.put(`${this.apiUrl}/user-progress/update`, progressData);
  }

  /**
   * Fetches CEFR level progress for a user.
   * @param userId - The ID of the user whose progress is being fetched.
   * @returns An Observable containing an array of CefrProgress objects.
   */

  getCefrProgress(userId: number): Observable<CefrProgressResponse> {
    return this.http.get<CefrProgressResponse>(
      `${this.apiUrl}/user-progress/cefr-levels`,
      {
        params: { user_id: userId.toString() },
      }
    );
  }

  /**
   * Fetches detailed lesson progress for a user within a specific CEFR level.
   * @param userId - The ID of the user whose progress is being fetched.
   * @param cefrLevel - The CEFR level for which progress is being fetched.
   * @returns An Observable containing an array of LessonProgress objects.
   */
  getLessonProgress(
    userId: number,
    cefrLevel: string
  ): Observable<LessonProgressResponse> {
    return this.http.get<LessonProgressResponse>(
      `${this.apiUrl}/user-progress/lessons`,
      {
        params: { user_id: userId.toString(), cefr_level: cefrLevel },
      }
    );
  }
}
