import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-event-delete',
  standalone: true,
  imports: [
    CommonModule,
    ConfirmDialogModule,
    ButtonModule,
    RippleModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: 'event-delete.component.html',
  styleUrls: ['event-delete.component.css']
})
export class EventDeleteComponent {
  @Input() eventId!: string;
  @Input() buttonLabel: string = 'Delete Event';
  @Input() buttonIcon: string = 'pi pi-trash';
  @Input() buttonClass: string = 'p-button-outlined p-button-danger';

  @Output() deleted = new EventEmitter<void>();
  @Output() error = new EventEmitter<string>();

  private eventService = inject(EventService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  isDeleting: boolean = false;

  /**
   * Show confirmation dialog before deleting
   */
  confirmDelete(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this event? This action cannot be undone.',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteEvent();
      }
    });
  }

  /**
   * Delete the event
   */
  private deleteEvent(): void {
    this.isDeleting = true;

    this.eventService.deleteEvent(this.eventId).subscribe({
      next: () => {
        this.isDeleting = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Event has been deleted successfully'
        });

        // Emit deleted event for parent components
        this.deleted.emit();
      },
      error: (error) => {
        this.isDeleting = false;
        const errorMessage = error.message || 'Failed to delete event';

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage
        });

        // Emit error for parent components
        this.error.emit(errorMessage);
      }
    });
  }
}
