import { CanDeactivateFn } from '@angular/router';
import { SignupComponent } from '../../features/authentication/signup/signup.component';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { map } from 'rxjs';

// Guard to prevent navigation if there are unsaved changes in the form
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
        title: $localize`:@@unsavedChanges:Unsaved Changes`,
        message: $localize`:@@unsavedMessage:You have unsaved changes. Do you really want to leave this page?`,
      },
    });
    // Only allow navigation if the user confirms in the dialog
    return dialogRef.afterClosed().pipe(map((result) => result === true));
  }
  return true;
};
