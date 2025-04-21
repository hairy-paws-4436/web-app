import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import {OngService} from '../../hairy-paws/services/ong.service';
import {AuthService} from '../../auth/services/auth.service';
import {MessageService} from 'primeng/api';
import {jwtDecode} from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class OngOwnerGuard implements CanActivate {
  private ongService = inject(OngService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // First check if user has ONG role
    if (!this.authService.isONG()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Unauthorized',
        detail: 'Only ONG administrators can perform this action'
      });
      this.router.navigate(['/hairy-paws']);
      return of(false);
    }

    const ongId = route.params['id'];

    // If accessing my-ong, no need to check ownership
    if (route.routeConfig?.path === 'my-ong') {
      return of(true);
    }

    // For other ONG operations, check ownership
    return this.ongService.getOngById(ongId).pipe(
      map(ong => {
        const currentUserOngId = this.getCurrentUserOngId();
        if (ong.id === currentUserOngId) {
          return true;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Unauthorized',
            detail: 'You can only modify your own ONG'
          });
          this.router.navigate(['/hairy-paws/my-ong']);
          return false;
        }
      }),
      catchError(error => {
        console.error('Error verifying ONG ownership:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to verify ownership'
        });
        this.router.navigate(['/hairy-paws/my-ong']);
        return of(false);
      })
    );
  }

  private getCurrentUserOngId(): string | null {
    // This method would need to be implemented based on how you store ONG ID
    // It could come from the JWT token, user profile, or another source
    const access_token = localStorage.getItem('access_token');
    if (!access_token) return null;

    try {
      const decodedToken: any = jwtDecode(access_token);
      return decodedToken.ongId || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
