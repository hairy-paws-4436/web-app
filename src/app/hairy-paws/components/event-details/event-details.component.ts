// event-details.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService, ConfirmationService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { switchMap, map, catchError, of } from 'rxjs';
import { EventService } from '../../services/event.service';

import { OngService } from '../../services/ong.service';
import { EventInterface } from '../../interfaces/event-interface';
import { EventDeleteComponent } from '../event-delete/event-delete.component';
import {AuthService} from '../../../auth/services/auth.service';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CardModule,
    TagModule,
    DividerModule,
    ToastModule,
    ProgressSpinnerModule,
    RippleModule,
    ConfirmDialogModule,
    EventDeleteComponent,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent implements OnInit {
  private eventService = inject(EventService);
  private authService = inject(AuthService);
  private ongService = inject(OngService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);

  event: EventInterface | null = null;
  isLoading: boolean = true;
  isOwner: boolean = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.loadEventDetailsWithOwnershipCheck(id);
      } else {
        this.router.navigate(['/hairy-paws/events']);
      }
    });
  }

  /**
   * Load event details and check if the user is the owner
   */
  private loadEventDetailsWithOwnershipCheck(id: string): void {
    this.isLoading = true;

    this.eventService.getEventById(id).pipe(
      switchMap(event => {
        this.event = event;

        // If user is not ONG, they can't be owner
        if (!this.authService.isONG()) {
          return of(false);
        }

        // Check if the event belongs to the user's ONG
        return this.ongService.getMyOng().pipe(
          map(myOng => event.ongId === myOng.id),
          catchError(() => of(false))
        );
      })
    ).subscribe({
      next: (isOwner) => {
        this.isOwner = isOwner;
        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load event details'
        });
        this.isLoading = false;
        this.router.navigate(['/hairy-paws/events']);
      }
    });
  }

  /**
   * Navigate to edit event page
   */
  editEvent(): void {
    if (this.event && this.event.id && this.isOwner) {
      this.router.navigate(['/hairy-paws/event-edit', this.event.id]);
    } else if (!this.isOwner) {
      this.messageService.add({
        severity: 'error',
        summary: 'Unauthorized',
        detail: 'You are not authorized to edit this event'
      });
    }
  }

  /**
   * Handle successful event deletion
   */
  onEventDeleted(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Event deleted successfully'
    });

    // Navigate back to events list after deletion
    setTimeout(() => {
      this.router.navigate(['/hairy-paws/events']);
    }, 1500);
  }

  /**
   * Handle event deletion error
   */
  onDeleteError(errorMessage: string): void {
    // Error is already shown by the delete component,
    // but we can add additional handling here if needed
    console.error('Event deletion failed:', errorMessage);
  }

  /**
   * Register for a volunteer event
   */
  registerForEvent(): void {
    // This would typically call your registration service
    this.messageService.add({
      severity: 'success',
      summary: 'Registration Submitted',
      detail: 'Your registration for this event has been submitted.'
    });
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };

    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  /**
   * Get date and time as separate values
   */
  getDateTimeComponents(dateString: string): { date: string; time: string } {
    const fullDate = new Date(dateString);

    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit'
    };

    return {
      date: fullDate.toLocaleDateString(undefined, dateOptions),
      time: fullDate.toLocaleTimeString(undefined, timeOptions)
    };
  }

  /**
   * Calculate event duration in hours and minutes
   */
  getEventDuration(): string {
    if (!this.event || !this.event.endDate) return 'Not specified';

    const start = new Date(this.event.eventDate);
    const end = new Date(this.event.endDate);

    const durationMs = end.getTime() - start.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours === 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else if (minutes === 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours !== 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
  }

  /**
   * Check if event has already passed
   */
  isPastEvent(): boolean {
    if (!this.event) return false;

    const eventDate = new Date(this.event.eventDate);
    return eventDate < new Date();
  }

  /**
   * Check if it's too late to register (less than 24 hours before event)
   */
  isTooLateToRegister(): boolean {
    if (!this.event) return true;
    if (this.isPastEvent()) return true;

    const eventDate = new Date(this.event.eventDate);
    const now = new Date();

    // Calculate difference in hours
    const diffHours = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    return diffHours < 24;
  }
}
