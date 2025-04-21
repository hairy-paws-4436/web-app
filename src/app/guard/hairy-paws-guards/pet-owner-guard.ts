import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';

import { MessageService } from 'primeng/api';
import {PetService} from '../../hairy-paws/services/pet.service';
import {AuthService} from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PetOwnerGuard implements CanActivate {
  private petService = inject(PetService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // First check if user has Owner role
    if (!this.authService.isOwner()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Unauthorized',
        detail: 'Only pet owners can perform this action'
      });
      this.router.navigate(['/hairy-paws/pets']);
      return of(false);
    }

    const petId = route.params['id'];

    // If registering a new pet, only Owner role is needed
    if (route.routeConfig?.path === 'pet-register') {
      return of(true);
    }

    // For editing or deleting, check if the pet belongs to the user
    return this.petService.getPetById(petId).pipe(
      map(pet => {
        const currentUserId = this.authService.getCurrentUserId();
        if (pet.ownerId === currentUserId) {
          return true;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Unauthorized',
            detail: 'You can only modify your own pets'
          });
          this.router.navigate(['/hairy-paws/my-pets']);
          return false;
        }
      }),
      catchError(error => {
        console.error('Error verifying pet ownership:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to verify pet ownership'
        });
        this.router.navigate(['/hairy-paws/my-pets']);
        return of(false);
      })
    );
  }
}
