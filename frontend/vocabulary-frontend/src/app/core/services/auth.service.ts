import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../base-url.dev';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());

  get isLoggedIn$() {
    return this.loggedIn.asObservable();
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private http: HttpClient
  ) {}

  checkEmailExists(email: string): Observable<boolean> {
    return this.http
      .post<{ exists: boolean }>(`${this.apiUrl}/check-email`, { email })
      .pipe(map((response) => response.exists));
  }

  // Method for logging in a user
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        this.handleAuthResponse(response);
        this.loggedIn.next(true);
      })
    );
  }

  private handleAuthResponse(response: any) {
    const { jwt, refresh_token, role = 'user' } = response;

    // Store resoponse in local storage
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('jwt', jwt);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('role', role);
    }
  }

  logout(): Observable<object> | undefined {
    let refresh_token;
    // Remove resoponse in local storage
    if (isPlatformBrowser(this.platformId)) {
      refresh_token = localStorage.getItem('refresh_token');
      localStorage.removeItem('jwt');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('role');
    }

    if (refresh_token) {
      this.loggedIn.next(false);
      return this.http.post(`${this.apiUrl}/logout`, { refresh_token });
    }

    this.loggedIn.next(false);
    return undefined;
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('jwt');
    }
    return false;
  }

  requestPasswordReset(email: string) {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/request-password-reset`,
      { email }
    );
  }

  signUp(credentials: { username: string; email: string; password: string }) {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/register`,
      credentials
    );
  }
}
