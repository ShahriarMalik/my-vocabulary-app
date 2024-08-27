import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Guard to check if the user has admin privileges
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Inject AuthService
  const router = inject(Router); // Inject Router

  // Allow access if the user is an admin, otherwise redirect to home
  if (authService.getUserRole() === 'admin') {
    return true;
  } else {
    router.navigate(['/']); // Redirect to home page if not admin
    return false;
  }
};
