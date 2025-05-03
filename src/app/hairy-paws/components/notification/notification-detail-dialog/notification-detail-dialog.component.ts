import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { NotificationInterface } from '../../../interfaces/notification/notification-interface';
import { NotificationService } from '../../../services/notification/notification.service';
import {MessageService, PrimeTemplate} from 'primeng/api';
import { NgClass, NgIf, DatePipe } from '@angular/common';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { Dialog } from 'primeng/dialog';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-notification-detail-dialog',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    ButtonDirective,
    Ripple,
    Dialog,
    ProgressSpinner,
    DatePipe,
    PrimeTemplate
  ],
  templateUrl: './notification-detail-dialog.component.html',
  styleUrl: './notification-detail-dialog.component.css'
})
export class NotificationDetailDialogComponent implements OnInit {
  @Input() notificationId!: string;
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onClose = new EventEmitter<void>();

  private notificationService = inject(NotificationService);
  private messageService = inject(MessageService);

  notification: NotificationInterface | null = null;
  isLoading: boolean = false;

  ngOnInit(): void {
    if (this.visible && this.notificationId) {
      this.loadNotificationDetails();
    }
  }

  ngOnChanges(): void {
    if (this.visible && this.notificationId) {
      this.loadNotificationDetails();
    }
  }

  loadNotificationDetails(): void {
    if (!this.notificationId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No notification ID provided'
      });
      this.hideDialog();
      return;
    }

    this.isLoading = true;

    this.notificationService.getNotificationById(this.notificationId).subscribe({
      next: (notification) => {
        this.notification = notification;
        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load notification details'
        });
        this.isLoading = false;
        this.hideDialog();
      }
    });
  }

  hideDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.onClose.emit();
  }

  getIconClass(): string {
    if (!this.notification) return 'pi-bell';

    switch (this.notification.type) {
      case 'info':
      case 'general':
        return 'pi-info-circle';
      case 'success':
      case 'adoption_approved':
      case 'visit_approved':
      case 'donation_confirmed':
      case 'account_verified':
        return 'pi-check-circle';
      case 'warning':
        return 'pi-exclamation-triangle';
      case 'error':
      case 'adoption_rejected':
      case 'visit_rejected':
        return 'pi-times-circle';
      case 'adoption_request':
        return 'pi-heart';
      case 'visit_request':
        return 'pi-calendar';
      case 'donation_received':
        return 'pi-gift';
      case 'event_reminder':
      case 'new_event':
        return 'pi-calendar-plus';
      default:
        return 'pi-bell';
    }
  }

  getIconColorClass(): string {
    if (!this.notification) return 'icon-info';

    switch (this.notification.type) {
      case 'info':
      case 'general':
        return 'icon-info';
      case 'success':
      case 'adoption_approved':
      case 'visit_approved':
      case 'donation_confirmed':
      case 'account_verified':
        return 'icon-success';
      case 'warning':
      case 'event_reminder':
        return 'icon-warning';
      case 'error':
      case 'adoption_rejected':
      case 'visit_rejected':
        return 'icon-error';
      case 'adoption_request':
        return 'icon-adoption';
      case 'visit_request':
        return 'icon-visit';
      case 'donation_received':
        return 'icon-donation';
      case 'new_event':
        return 'icon-event';
      default:
        return 'icon-info';
    }
  }

  getNotificationType(): string {
    if (!this.notification) return '';

    switch (this.notification.type) {
      case 'info': return 'Information';
      case 'general': return 'General Notification';
      case 'success': return 'Success';
      case 'adoption_approved': return 'Adoption Approved';
      case 'visit_approved': return 'Visit Approved';
      case 'donation_confirmed': return 'Donation Confirmed';
      case 'account_verified': return 'Account Verified';
      case 'warning': return 'Warning';
      case 'error': return 'Error';
      case 'adoption_rejected': return 'Adoption Rejected';
      case 'visit_rejected': return 'Visit Rejected';
      case 'adoption_request': return 'Adoption Request';
      case 'visit_request': return 'Visit Request';
      case 'donation_received': return 'Donation Received';
      case 'event_reminder': return 'Event Reminder';
      case 'new_event': return 'New Event';
      default: return this.notification.type;
    }
  }

  getReferenceType(): string {
    if (!this.notification || !this.notification.referenceType) return 'N/A';

    switch (this.notification.referenceType) {
      case 'adoption': return 'Adoption';
      case 'donation': return 'Donation';
      case 'visit': return 'Visit';
      default: return this.notification.referenceType;
    }
  }
}
