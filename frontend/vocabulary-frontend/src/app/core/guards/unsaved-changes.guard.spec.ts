import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { unsavedChangesGuard } from './unsaved-changes.guard';
import { SignupComponent } from '../../features/authentication/signup/signup.component';
import { FormGroup } from '@angular/forms';

describe('unsavedChangesGuard', () => {
  let dialog: MatDialog;
  let component: SignupComponent;

  const executeGuard = () =>
    TestBed.runInInjectionContext(() =>
      unsavedChangesGuard(component, {} as any, {} as any, {} as any)
    );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: MatDialog, useValue: { open: jest.fn() } }],
    });

    dialog = TestBed.inject(MatDialog);

    const mockFormGroup = new FormGroup({});
    mockFormGroup.markAsDirty(); // Set the form as dirty initially for testing

    component = {
      signUpForm: mockFormGroup,
    } as SignupComponent;
  });

  it('should allow navigation if form is not dirty', () => {
    component.signUpForm.markAsPristine(); // Ensure form is pristine

    const result = executeGuard();

    expect(result).toBe(true); // Guard should return true
    expect(dialog.open).not.toHaveBeenCalled(); // Dialog should not open
  });

  it('should open confirmation dialog if form is dirty', () => {
    component.signUpForm.markAsDirty(); // Mark the form as dirty

    dialog.open = jest.fn().mockReturnValue({
      afterClosed: () => of(true),
    });

    const result = executeGuard();

    expect(dialog.open).toHaveBeenCalled(); // Dialog should be opened
    // Since the dialog's afterClosed observable is mocked to return true,
    // the guard should allow navigation.
  });

  it('should prevent navigation if form is dirty and user selects no', () => {
    component.signUpForm.markAsDirty();

    dialog.open = jest.fn().mockReturnValue({
      afterClosed: () => of(false), // Simulate user selecting 'No'
    });

    const result = executeGuard();

    expect(dialog.open).toHaveBeenCalled(); // Dialog should be opened
    expect(result).toBeInstanceOf(Object);

    if (typeof result === 'boolean') {
      expect(result).toBe(false);
    } else if ('subscribe' in result) {
      result.subscribe((value) => {
        expect(value).toBe(false);
      });
    }
  });
});
