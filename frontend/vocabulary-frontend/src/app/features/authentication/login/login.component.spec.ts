import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockAuthService = {
      login: jest.fn(),
    };

    mockRouter = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: {} } },
        },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values and required validators', () => {
    const loginForm = component.loginForm;
    const emailControl = loginForm.get('email');
    const passwordControl = loginForm.get('password');

    expect(loginForm).toBeTruthy();
    expect(emailControl?.value).toBe('');
    expect(passwordControl?.value).toBe('');

    expect(emailControl?.valid).toBeFalsy();
    expect(passwordControl?.valid).toBeFalsy();

    expect(emailControl?.hasError('required')).toBeTruthy();
    expect(passwordControl?.hasError('required')).toBeTruthy();
  });

  it('should call login method and navigate on success', fakeAsync(() => {
    mockAuthService.login.mockReturnValue(of({}));

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123',
    });

    component.onSubmit();

    fixture.detectChanges();

    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    tick(3000); // Simulate delay for navigation
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/features/auth/home']);
  }));

  it('should handle login error and display error message', () => {
    const errorMock = {
      status: 400,
      error: { message: 'Invalid credentials' },
    };
    mockAuthService.login.mockReturnValue(throwError(() => errorMock));

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123',
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Invalid credentials');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should reset the form and clear messages after submission', fakeAsync(() => {
    mockAuthService.login.mockReturnValue(of({}));

    // Fill the form with valid data
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123',
    });

    component.onSubmit();

    expect(component.loginForm.value).toEqual({
      email: null,
      password: null,
    });

    // Simulate 3 seconds of time passing
    tick(3000);

    // After 3 seconds, the messages should be cleared
    expect(component.errorMessage).toBe('');
  }));
});
