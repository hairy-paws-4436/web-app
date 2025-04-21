import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { MessageService } from 'primeng/api';
import {NotificationService} from '../../hairy-paws/services/notification.service';
import {AuthService} from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationOwnerGuard implements CanActivate {
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const notificationId = route.params['id'];

    if (!notificationId) {
      return of(true); // If no specific notification ID, allow access to general notifications page
    }

    return this.notificationService.getNotifications().pipe(
      map(notifications => {
        const notification = notifications.find(n => n.id === notificationId);

        if (!notification) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Notification not found'
          });
          this.router.navigate(['/hairy-paws/notifications']);
          return false;
        }

        // Check if user owns the notification
        const userId = this.authService.getCurrentUserId();
        if (notification.userId !== userId) {
          this.messageService.add({
            severity: 'error',
            summary: 'Unauthorized',
            detail: 'You can only manage your own notifications'
          });
          this.router.navigate(['/hairy-paws/notifications']);
          return false;
        }

        return true;
      }),
      catchError(error => {
        console.error('Error verifying notification ownership:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to verify notification access'
        });
        this.router.navigate(['/hairy-paws/notifications']);
        return of(false);
      })
    );
  }
}
