import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {AuthStatusEnum} from '../enums/status-enum';

export const isAuthenticatedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.authStatus() === AuthStatusEnum.authenticated) {
    return true;
  }
  router.navigateByUrl('/auth/login').then(r => {});
  return false;
};
