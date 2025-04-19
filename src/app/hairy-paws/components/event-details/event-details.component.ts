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

import { EventService } from '../../services/event.service';
import { EventInterface } from '../../interfaces/event-interface';
import {EventDeleteComponent} from '../event-delete/event-delete.component';

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
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  event: EventInterface | null = null;
  isLoading: boolean = true;
  isAdmin: boolean = false; // Could be dynamically determined based on user role

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.loadEventDetails(id);
      } else {
        this.router.navigate(['/hairy-paws/events']);
      }
    });

    // Check if user is admin (this would be based on your auth service)
    // For demo purposes, we'll set it to true
    this.isAdmin = true;
  }

  /**
   * Load event details
   */
  private loadEventDetails(id: string): void {
    this.isLoading = true;

    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        this.event = event;
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
    if (this.event && this.event.id) {
      this.router.navigate(['/hairy-paws/event-edit', this.event.id]);
    }
  }

  /**
   * Handle successful event deletion
   */
  onEventDeleted(): void {
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
