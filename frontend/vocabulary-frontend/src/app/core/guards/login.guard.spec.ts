import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { loginGuard } from './login.guard';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

describe('loginGuard', () => {
  let authService: AuthService;
  let router: Router;
  let dialog: MatDialog;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => loginGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: { isLoggedIn: jest.fn(), getUserRole: jest.fn() },
        },
        {
          provide: Router,
          useValue: { navigate: jest.fn(), createUrlTree: jest.fn() },
        },
        { provide: MatDialog, useValue: { open: jest.fn() } },
      ],
    });

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    dialog = TestBed.inject(MatDialog);
  });

  it('should allow access if user is logged in', () => {
    // Simulate the user being logged in
    authService.isLoggedIn = jest.fn().mockReturnValue(true);

    const result = executeGuard({} as any, {} as any);
    expect(result).toBe(true);
    expect(authService.isLoggedIn).toHaveBeenCalled();
    expect(dialog.open).not.toHaveBeenCalled();
  });

  it('should show dialog and redirect if user is not logged in', () => {
    // Simulate the user not being logged in
    authService.isLoggedIn = jest.fn().mockReturnValue(false);
    dialog.open = jest.fn().mockReturnValue({ afterClosed: () => of(true) });

    const result = executeGuard({} as any, {} as any);

    expect(result).toBeInstanceOf(Object); // The result should be an Observable or a UrlTree
    expect(authService.isLoggedIn).toHaveBeenCalled();
    expect(dialog.open).toHaveBeenCalled();
  });
});
