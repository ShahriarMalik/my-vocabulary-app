import { Inject, inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const dialog = inject(MatDialog);
  const platformId = inject(PLATFORM_ID);

  if (authService.isLoggedIn() === true) {
    return true;
  } else if (isPlatformBrowser(platformId)) {
    // Only open the dialog if running on the browser
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
  } else {
    // On the server side, just return false or navigate to a safe page
    return router.createUrlTree(['/auth/login']);
  }
};
