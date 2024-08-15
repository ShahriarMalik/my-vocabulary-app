import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatLabel,
    MatFormField,
    MatError,
    MatIcon,
    MatButton,
    MatInput,
  ],
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css'],
})
export class PasswordResetComponent implements OnInit {
  resetForm!: FormGroup;
  message = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.resetForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  onSubmit() {
    if (this.resetForm.valid) {
      this.message = '';

      this.authService
        .requestPasswordReset(this.resetForm.value.email)
        .subscribe({
          next: (response) => {
            this.message = response.message;
          },
          error: () => {
            this.message =
              'An unexpected error occurred. Please try again later.';
          },
        });

      // Reset form and clear validation states
      this.resetForm.reset();
      Object.keys(this.resetForm.controls).forEach((key) => {
        this.resetForm.get(key)?.setErrors(null);
      });

      setTimeout(() => {
        this.message = '';
      }, 1000);
    }
  }

  // Utility getter method for the template
  get email() {
    return this.resetForm.get('email');
  }
}
