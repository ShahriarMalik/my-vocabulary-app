import { Inject, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const dialog = inject(MatDialog);

  if (authService.isLoggedIn() === true) {
    return true;
  } else {
    const dialogRef = dialog.open(ConfirmDialogComponent, {
      data: {
        title: $localize`:@@loginRequired:Login Required`,
        message: $localize`:@@loggedinMessage:You must be logged in to access this page.`,
      },
    });

    // If user confirms, then navigate them to the login page
    return dialogRef.afterClosed().pipe(
      map((result) => {
        return result ? router.createUrlTree(['/auth/login']) : false;
      })
    );
  }
};
