import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../base-url.dev';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Base URL for API endpoints
  private apiUrl = environment.apiUrl;

  // Indicates whether a token refresh is in progress
  private refreshInProgress = false;

  // Subject to manage refresh token state
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  // Subject to track logged-in state
  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());

  // Observable to expose the logged-in state
  get isLoggedIn$() {
    return this.loggedIn.asObservable();
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private http: HttpClient
  ) {}

  /**
   * Checks if an email already exists in the system.
   * @param email - The email address to check.
   * @returns An Observable that emits a boolean indicating whether the email exists.
   */
  checkEmailExists(email: string): Observable<boolean> {
    return this.http
      .post<{ exists: boolean }>(`${this.apiUrl}/check-email`, { email })
      .pipe(map((response) => response.exists));
  }

  /**
   * Logs in a user with the provided credentials.
   * @param credentials - The user's email and password.
   * @returns An Observable that emits the login response.
   */
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        this.handleAuthResponse(response);
        this.loggedIn.next(true);
      })
    );
  }

  /**
   * Handles the authentication response by storing the JWT, refresh token, and role in local storage.
   * @param response - The authentication response containing JWT, refresh token, and role.
   */
  private handleAuthResponse(response: any) {
    const { jwt, refresh_token, role = 'user' } = response;

    // Store the response in local storage
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('jwt', jwt);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('role', role);
    }
  }

  /**
   * Logs out the user by clearing the tokens and sending a logout request to the server.
   * @returns An Observable for the logout request or undefined if no refresh token is found.
   */
  logout(): Observable<object> | undefined {
    let refresh_token;
    // Remove tokens from local storage
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

  /**
   * Checks if the user is currently logged in by verifying the presence of a JWT in local storage.
   * @returns A boolean indicating whether the user is logged in.
   */
  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('jwt');
    }
    return false;
  }

  /**
   * Requests a password reset for the specified email.
   * @param email - The email address for password reset.
   * @returns An Observable that emits the password reset request response.
   */
  requestPasswordReset(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/request-password-reset`,
      { email }
    );
  }

  /**
   * Registers a new user with the provided credentials.
   * @param credentials - The user's username, email, and password.
   * @returns An Observable that emits the registration response.
   */
  signUp(credentials: { username: string; email: string; password: string }) {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/register`,
      credentials
    );
  }

  /**
   * Retrieves a valid JWT token from local storage, refreshing it if necessary.
   * @returns The valid JWT token or an empty string if the token is expired or not found.
   */
  getValidToken(): string {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('jwt');

      if (!token) {
        return '';
      }

      const decodedToken: any = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000;
      const currentTime = Date.now();
      const timeLeft = expirationTime - currentTime;

      if (timeLeft > 0) {
        return token;
      } else {
        this.logout();
        return '';
      }
    } else {
      return '';
    }
  }

  /**
   * Retrieves the user's role from local storage.
   * @returns The user's role ('user' or 'admin').
   */
  getUserRole(): 'user' | 'admin' {
    if (isPlatformBrowser(this.platformId)) {
      const role = localStorage.getItem('role');
      if (role) {
        return role === 'admin' ? 'admin' : 'user';
      }
    }
    return 'user';
  }
}
