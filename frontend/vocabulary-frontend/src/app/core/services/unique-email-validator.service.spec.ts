import { TestBed } from '@angular/core/testing';

import { UniqueEmailValidatorService } from './unique-email-validator.service';
import { AuthService } from './auth.service';
import { AbstractControl } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('UniqueEmailValidatorService', () => {
  let service: UniqueEmailValidatorService;
  let authService: AuthService;

  beforeEach(() => {
    const authServiceMock = {
      checkEmailExists: jest.fn(),
    };
    TestBed.configureTestingModule({
      providers: [
        UniqueEmailValidatorService,
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    });
    service = TestBed.inject(UniqueEmailValidatorService);
    authService = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return {uniqueEmail: true} if the email is taken', (done) => {
    const mockControl = { value: 'test@example,com' } as AbstractControl;
    jest.spyOn(authService, 'checkEmailExists').mockReturnValue(of(true));

    service.validate(mockControl).subscribe((result) => {
      expect(result).toEqual({ uniqueEmail: true });
      done();
    });
  });

  it('should return null if the email is not taken', (done) => {
    const mockControl = { value: 'test@example,com' } as AbstractControl;
    jest.spyOn(authService, 'checkEmailExists').mockReturnValue(of(false));

    service.validate(mockControl).subscribe((result) => {
      expect(result).toBeNull();
      done();
    });
  });

  it('should return null if there is an error', (done) => {
    const mockControl = { value: 'error@email.com' } as AbstractControl;

    jest
      .spyOn(authService, 'checkEmailExists')
      .mockReturnValue(throwError(() => new Error('error')));

    service.validate(mockControl).subscribe((result) => {
      expect(result).toBeNull();
      done();
    });
  });
});
