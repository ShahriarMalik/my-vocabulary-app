import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SignupComponent } from './signup.component';
import { UniqueEmailValidatorService } from '../../../core/services/unique-email-validator.service';
import { AuthService } from '../../../core/services/auth.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let mockAuthService: any;
  let mockUniqueEmailValidator: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockAuthService = {
      signUp: jest.fn(),
    };

    mockUniqueEmailValidator = {
      validate: jest.fn().mockReturnValue(of(null)), // Simulating no error
    };

    mockRouter = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SignupComponent, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
        {
          provide: UniqueEmailValidatorService,
          useValue: mockUniqueEmailValidator,
        },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values and required validators', () => {
    const signUpForm = component.signUpForm;
    const usernameControl = signUpForm.get('username');
    const emailControl = signUpForm.get('email');
    const passwordControl = signUpForm.get('password');

    expect(signUpForm).toBeTruthy();
    expect(usernameControl?.value).toBe('');
    expect(emailControl?.value).toBe('');
    expect(passwordControl?.value).toBe('');

    expect(usernameControl?.valid).toBeFalsy();
    expect(emailControl?.valid).toBeFalsy();
    expect(passwordControl?.valid).toBeFalsy();

    expect(usernameControl?.hasError('required')).toBeTruthy();
    expect(emailControl?.hasError('required')).toBeTruthy();
    expect(passwordControl?.hasError('required')).toBeTruthy();
  });

  it('should show an error if email is not unique', fakeAsync(() => {
    mockUniqueEmailValidator.validate.mockReturnValue(
      of({ uniqueEmail: true }) // Simulating email already exists
    );

    const emailControl = component.signUpForm.get('email');
    emailControl?.setValue('test@example.com');
    emailControl?.markAsTouched();
    fixture.detectChanges();

    tick(); // Simulate async validator

    expect(emailControl?.hasError('uniqueEmail')).toBeTruthy();
  }));

  it('should call signUp method and navigate on success', fakeAsync(() => {
    const responseMock = { message: 'Registration successful!' };
    mockAuthService.signUp.mockReturnValue(of(responseMock));

    component.signUpForm.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    component.onSubmit();

    fixture.detectChanges();

    expect(component.successMessage).toBe('Registration successful!');
    tick(3000); // Simulate delay for success message after which clear any message
    expect(component.successMessage).toBe('');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
  }));

  it('should handle sign-up error and display error message', () => {
    const errorMock = {
      status: 400,
      error: { message: 'Email already exists' },
    };
    mockAuthService.signUp.mockReturnValue(throwError(() => errorMock));

    component.signUpForm.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Email already exists');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should reset the form and clear messages after submission', fakeAsync(() => {
    mockAuthService.signUp.mockReturnValue(
      of({ message: 'Registration successful!' })
    );

    // Fill the form with valid data
    component.signUpForm.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    component.onSubmit();

    expect(component.signUpForm.value).toEqual({
      username: null,
      email: null,
      password: null,
    });

    // Simulate 3 seconds of time passing
    tick(3000);

    // After 3 seconds, the messages should be cleared
    expect(component.successMessage).toBe('');
    expect(component.errorMessage).toBe('');
  }));
});
