import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatError,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCard, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    MatButton,
    MatIconModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatError,
    MatProgressSpinner,
    MatLabel,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  loginForm!: FormGroup;
  errorMessage = '';
  hide = signal(true);

  @ViewChild('emailInput') emailInput!: ElementRef;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.emailInput.nativeElement.focus();
    });
  }

  togglePasswordVisibility(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.errorMessage = '';
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/features/auth/home']);
        },
        error: (error) => {
          if (error.status === 400) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = $localize`:7158033106518253277:An unexpected error occurred. Please try again later`;
          }
        },
        complete: () => console.log('Login request complete'),
      });
    } else {
      console.log('Form is invalid');
    }

    // Reset form and clear validation states
    this.loginForm.reset();

    // Clear any validation errors from all form controls, including asynchronous validators
    Object.keys(this.loginForm.controls).forEach((key) => {
      this.loginForm.get(key)?.setErrors(null);
    });

    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  // Utility getter methods for the template
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
