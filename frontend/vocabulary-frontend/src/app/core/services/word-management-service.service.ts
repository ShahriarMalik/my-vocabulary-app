import { Injectable } from '@angular/core';
import { environment } from '../../../base-url.dev';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Word } from '../models/word.model';

@Injectable({
  providedIn: 'root',
})
export class WordManagementService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Method to fetch word data
  fetchWord(word: string): Observable<Word> {
    return this.http.get<Word>(`${this.apiUrl}/word/fetch`, {
      params: { word },
    });
  }

  // Method to save word data
  saveWord(wordData: Word): Observable<any> {
    return this.http.post(`${this.apiUrl}/word/save`, wordData);
  }
}
