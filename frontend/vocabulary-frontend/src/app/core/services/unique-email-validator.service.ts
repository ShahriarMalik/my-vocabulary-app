/**
 * UniqueEmailValidatorService is an asynchronous validator that checks if an email is already taken.
 * It uses AuthService to verify the email and returns a validation error if the email is not unique.
 */
import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UniqueEmailValidatorService implements AsyncValidator {
  constructor(private authService: AuthService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.authService.checkEmailExists(control.value).pipe(
      map((isTaken) => (isTaken ? { uniqueEmail: true } : null)),
      catchError(() => of(null)) // Return null if there's an error, meaning no validation error
    );
  }
}
