import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../base-url.dev';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  private apiUrl = environment.apiUrl; // Base URL for API
  private lessonsSubject = new BehaviorSubject<any[]>([]); // Store lessons data
  private wordsSubject = new BehaviorSubject<any[]>([]); // Store words data

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private http: HttpClient
  ) {}

  // Method to fetch lessons by CEFR level
  fetchLessonsByLevel(cefrLevel: string): void {
    // Your implementation here
  }

  // Method to fetch words by CEFR level
  fetchWordsByCefrLevel(cefrLevel: string): void {
    // Your implementation here
  }

  // Method to fetch words by specific lesson ID
  fetchWordsByLessonId(lessonId: number): void {
    // Your implementation here
  }

  // Method to fetch a specific lesson by ID
  getLessonById(lessonId: number): Observable<any> {
    // Your implementation here
    return of('');
  }

  // Generic error handling method
  private handleError(error: any): Observable<never> {
    throw Error('Do do');
    // Your implementation here
  }
}
