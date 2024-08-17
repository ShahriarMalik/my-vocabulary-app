import { CanDeactivateFn } from '@angular/router';
import { SignupComponent } from '../../features/authentication/signup/signup.component';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { title } from 'process';
import { map } from 'rxjs';

export const unsavedChangesGuard: CanDeactivateFn<SignupComponent> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  const dialog = inject(MatDialog);

  if (component.signUpForm && component.signUpForm.dirty) {
    const dialogRef = dialog.open(ConfirmDialogComponent, {
      data: {
        title: $localize`:unsavedChanges:Unsaved Changes`,
        message: $localize`:unsavedMessage:You have unsaved changes. Do you really want to leave this page?`,
      },
    });

    return dialogRef.afterClosed().pipe(map((result) => result === true));
  }
  return true;
};
