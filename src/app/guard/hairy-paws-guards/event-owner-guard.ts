import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, catchError, map, of, switchMap } from 'rxjs';

import { MessageService } from 'primeng/api';
import {OngService} from '../../hairy-paws/services/ong/ong.service';
import {AuthService} from '../../auth/services/auth.service';
import {EventService} from '../../hairy-paws/services/event/event.service';


@Injectable({
  providedIn: 'root'
})
export class EventOwnerGuard implements CanActivate {
  private eventService = inject(EventService);
  private ongService = inject(OngService);
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    if (!this.authService.isONG()) {
      this.router.navigate(['/hairy-paws/unauthorized']);
      return of(false);
    }

    const eventId = route.params['id'];

    if (route.routeConfig?.path === 'event-register') {
      return of(true);
    }

    return this.eventService.getEventById(eventId).pipe(
      switchMap(event => {
        return this.ongService.getMyOng().pipe(
          map(myOng => {
            if (event.ongId === myOng.id) {
              return true;
            } else {
              this.router.navigate(['/hairy-paws/unauthorized']);
              return false;
            }
          })
        );
      }),
      catchError(error => {
        console.error('Error verifying event ownership:', error);
        this.router.navigate(['/hairy-paws/unauthorized']);
        return of(false);
      })
    );
  }
}
