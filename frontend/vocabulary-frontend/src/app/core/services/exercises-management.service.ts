import { Injectable } from '@angular/core';
import { environment } from '../../../base-url.dev';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ExercisesManagementService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Fetch lessons by CEFR level
  // getLessonsbyCefrLevel(cefrLevel: string){}
}
