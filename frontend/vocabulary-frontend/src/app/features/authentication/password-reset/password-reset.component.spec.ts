import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { PasswordResetComponent } from './password-reset.component';
import { AuthService } from '../../../core/services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PasswordResetComponent', () => {
  let component: PasswordResetComponent;
  let fixture: ComponentFixture<PasswordResetComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    // Create a mock AuthService using Jest
    const authServiceMock = {
      requestPasswordReset: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        PasswordResetComponent,
        NoopAnimationsModule,
      ],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordResetComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should call authService.requestPasswordReset when form is valid and submitted', fakeAsync(() => {
    // Set up the mock to return an observable
    (authService.requestPasswordReset as jest.Mock).mockReturnValue(
      of({ message: 'Password reset email sent' })
    );

    component.resetForm.controls['email'].setValue('test@example.com');
    fixture.detectChanges();

    component.onSubmit();
    tick(1000);
    expect(authService.requestPasswordReset).toHaveBeenCalledWith(
      'test@example.com'
    );
  }));

  it('should show a success message after successful submission', fakeAsync(() => {
    // Mock the method and its return value
    (authService.requestPasswordReset as jest.Mock).mockReturnValue(
      of({ message: 'Password reset email sent' })
    );

    component.resetForm.controls['email'].setValue('test@example.com');
    fixture.detectChanges();

    component.onSubmit();
    fixture.detectChanges();

    expect(component.message).toBe('Password reset email sent');
    tick(1000); // Simulate async completion
    expect(component.message).toBe('');
  }));

  it('should show an error message if the request fails', fakeAsync(() => {
    (authService.requestPasswordReset as jest.Mock).mockReturnValue(
      throwError(() => new Error('Error'))
    );

    component.resetForm.controls['email'].setValue('test@example.com');
    fixture.detectChanges();

    component.onSubmit();
    fixture.detectChanges();

    expect(component.message).toBe(
      'An unexpected error occurred. Please try again later.'
    );
    tick(1000); // Simulate async completion
    expect(component.message).toBe('');
  }));
});
