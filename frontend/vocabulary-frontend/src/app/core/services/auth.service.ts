import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  checkEmailExists(email: string): Observable<boolean> {
    return this.http
      .get<{ exists: boolean }>(`${this.apiUrl}/check-email?email=${email}`)
      .pipe(map((response) => response.exists));
  }

  // Method for logging in a user
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Additional authentication methods (e.g., signUp, logout) can be added here
}

// import { Injectable } from '@angular/core';
// import { Observable, of } from 'rxjs';
// import { map } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   // Static list of existing email addresses for testing purposes
//   private existingEmails: string[] = [
//     'test@example.com',
//     'user1@example.com',
//     'user2@example.com',
//   ];

//   constructor() {}

//   // Simulate checking if an email exists
//   checkEmailExists(email: string): Observable<boolean> {
//     return of(this.existingEmails).pipe(
//       map((emails) => emails.includes(email))
//     );
//   }

//   // Additional authentication methods (e.g., signUp, login) can be added here
// }
