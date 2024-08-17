import { Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { unsavedChangesGuard } from '../../core/guards/unsaved-changes.guard';

export const authRoutes: Routes = [
  {
    path: 'signup',
    component: SignupComponent,
    title: $localize`:1466012768716286509:Sign Up`,
    canDeactivate: [unsavedChangesGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    title: $localize`:2454050363478003966:Login`,
  },
  {
    path: 'password-reset',
    component: PasswordResetComponent,
    title: $localize`:1527095269431550693:Password Reset`,
  },
];
