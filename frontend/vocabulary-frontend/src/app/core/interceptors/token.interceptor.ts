import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Intercepts outgoing HTTP requests to add an authorization token if the user is logged in.
 *
 * - If the user is logged in and a valid token is found, the request is cloned and the token is added to the Authorization header.
 * - If no valid token is found, the user is redirected to the login page and the request is stopped.
 * - If the user is not logged in, the request proceeds without modification.
 *
 * @param req - The outgoing HTTP request.
 * @param next - The next handler in the chain.
 * @returns An Observable of the HTTP event, either with the token added or the original request.
 */
export function tokenInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if the user is logged in
  if (authService.isLoggedIn()) {
    const token = authService.getValidToken();

    // If a valid token exists, clone the request and add the Authorization header
    if (token) {
      const clonedRequest = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });
      return next(clonedRequest); // Pass the cloned request to the next handler
    } else {
      // If no valid token, navigate to the login page
      router.navigate(['/auth/login']);
      // Return an empty observable to complete the request
      return new Observable<HttpEvent<unknown>>((observer) => {
        observer.complete();
      });
    }
  } else {
    // If the user is not logged in, pass the original request to the next handler
    return next(req);
  }
}
