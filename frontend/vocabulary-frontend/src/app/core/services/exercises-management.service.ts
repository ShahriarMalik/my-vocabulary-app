import { Injectable } from '@angular/core';
import { environment } from '../../../base-url.dev';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Exercise } from '../models/exercise.model';

@Injectable({
  providedIn: 'root',
})
export class ExercisesManagementService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Fetch exercises by CEFR level and lesson number with pagination support.
   * @param cefrLevel - The CEFR level (e.g., A1, B2).
   * @param lessonNumber - The lesson number for the specified CEFR level.
   * @param limit - The number of exercises to fetch per page.
   * @param offset - The starting point for fetching exercises.
   * @returns An Observable of an array of Exercise objects.
   */
  fetchByCefrLevel(
    cefrLevel: string,
    lessonNumber: number,
    limit: number,
    offset: number
  ): Observable<{
    exercises: Exercise[];
  }> {
    const params = {
      cefr_level: cefrLevel,
      lesson_number: lessonNumber.toString(),
      limit: limit.toString(),
      offset: offset.toString(),
    };
    return this.http.get<{
      exercises: Exercise[];
    }>(`${this.apiUrl}/exercises/${cefrLevel}`, {
      params,
    });
  }

  /**
   * Create a new exercise.
   * @param exercise - The exercise object containing exercise data.
   * @returns An Observable of the created Exercise object.
   */
  create(exercise: Exercise): Observable<{ exercise: Exercise }> {
    return this.http.post<{ exercise: Exercise }>(
      `${this.apiUrl}/exercises`,
      exercise
    );
  }

  /**
   * Update an existing exercise.
   * @param exercise - The exercise object containing updated data.
   * @returns An Observable of the updated Exercise object.
   */
  update(exercise: Exercise): Observable<Exercise> {
    return this.http.put<Exercise>(`${this.apiUrl}/exercises`, exercise);
  }

  /**
   * Delete an exercise by its ID.
   * @param id - The ID of the exercise to delete.
   * @returns An Observable of the delete operation result.
   */
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/exercises/${id}`);
  }

  /**
   * Fetch a specific exercise by its ID.
   * @param id - The ID of the exercise to fetch.
   * @returns An Observable of the Exercise object.
   */
  fetchById(id: number): Observable<Exercise> {
    return this.http.get<Exercise>(`${this.apiUrl}/exercises/${id}`);
  }

  /**
   * Fetch all exercises.
   * @returns An Observable of an array of all Exercise objects.
   */
  fetchAll(): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.apiUrl}/exercises`);
  }

  /**
   * Fetch exercises by lesson ID.
   * @param lessonId - The lesson ID to fetch exercises for.
   * @returns An Observable of an array of Exercise objects.
   */
  fetchByLesson(lessonId: number): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(
      `${this.apiUrl}/exercises/lesson/${lessonId}`
    );
  }
}
