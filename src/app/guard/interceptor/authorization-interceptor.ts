import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import {AuthService} from '../../auth/services/auth.service';


@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  private router = inject(Router);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Unauthorized - token expired or invalid
          this.authService.logout();
          this.messageService.add({
            severity: 'error',
            summary: 'Session Expired',
            detail: 'Please log in again'
          });
          this.router.navigate(['/auth/login']);
        } else if (error.status === 403) {
          // Forbidden - user doesn't have permission
          this.messageService.add({
            severity: 'error',
            summary: 'Access Denied',
            detail: 'You do not have permission to perform this action'
          });

          // Redirect to a safe route based on user's role
          if (this.authService.isONG()) {
            this.router.navigate(['/hairy-paws/my-ong']);
          } else if (this.authService.isOwner() || this.authService.isAdopter()) {
            this.router.navigate(['/hairy-paws/pets']);
          } else {
            this.router.navigate(['/']);
          }
        }

        return throwError(() => error);
      })
    );
  }
}
