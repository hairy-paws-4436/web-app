import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { MessageService } from 'primeng/api';
import {AuthService} from '../../auth/services/auth.service';
import {RoleEnum} from '../../auth/enums/role-enum';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    const requiredRoles = route.data['roles'] as RoleEnum[];

    if (!requiredRoles) {
      return true;
    }

    const userRole = this.authService.getUserRole();

    if (!userRole) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    if (requiredRoles.includes(userRole)) {
      return true;
    } else {
      // Redirect to unauthorized page instead of just showing a message
      this.router.navigate(['/hairy-paws/unauthorized']);
      return false;
    }
  }
}
