import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  
  if (inject(AuthService).isAuthenticated()) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};