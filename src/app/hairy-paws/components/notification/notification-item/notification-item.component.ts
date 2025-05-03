import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {NotificationInterface, NotificationStatus, NotificationType} from '../../../interfaces/notification/notification-interface';
import {NgClass, NgIf, NgSwitch, NgSwitchCase} from '@angular/common';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {Tooltip} from 'primeng/tooltip';
import {NotificationActionComponent} from '../notification-action/notification-action.component';
import {NotificationDetailDialogComponent} from '../notification-detail-dialog/notification-detail-dialog.component';

@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    ButtonDirective,
    Ripple,
    Tooltip,
    NotificationActionComponent,
    NotificationDetailDialogComponent,
    NgSwitch,
    NgSwitchCase,
  ],
  templateUrl: './notification-item.component.html',
  styleUrl: './notification-item.component.css'
})
export class NotificationItemComponent {
  @Input() notification!: NotificationInterface;
  @Output() onClick = new EventEmitter<NotificationInterface>();
  @Output() onDelete = new EventEmitter<NotificationInterface>();
  @Output() onActionCompleted = new EventEmitter<{notification: NotificationInterface, success: boolean, message: string}>();

  @ViewChild(NotificationActionComponent) actionComponent!: NotificationActionComponent;

  showDetailDialog: boolean = false;

  getIconClass(): string {
    switch (this.notification.type) {
      case NotificationType.INFO:
      case NotificationType.GENERAL:
        return 'pi-info-circle';
      case NotificationType.SUCCESS:
      case NotificationType.ADOPTION_APPROVED:
      case NotificationType.VISIT_APPROVED:
      case NotificationType.DONATION_CONFIRMED:
      case NotificationType.ACCOUNT_VERIFIED:
        return 'pi-check-circle';
      case NotificationType.WARNING:
        return 'pi-exclamation-triangle';
      case NotificationType.ERROR:
      case NotificationType.ADOPTION_REJECTED:
      case NotificationType.VISIT_REJECTED:
        return 'pi-times-circle';
      case NotificationType.ADOPTION_REQUEST:
        return 'pi-heart';
      case NotificationType.VISIT_REQUEST:
        return 'pi-calendar';
      case NotificationType.DONATION_RECEIVED:
        return 'pi-gift';
      case NotificationType.EVENT_REMINDER:
      case NotificationType.NEW_EVENT:
        return 'pi-calendar-plus';
      default:
        return 'pi-bell';
    }
  }

  getIconColorClass(): string {
    switch (this.notification.type) {
      case NotificationType.INFO:
      case NotificationType.GENERAL:
        return 'icon-info';
      case NotificationType.SUCCESS:
      case NotificationType.ADOPTION_APPROVED:
      case NotificationType.VISIT_APPROVED:
      case NotificationType.DONATION_CONFIRMED:
      case NotificationType.ACCOUNT_VERIFIED:
        return 'icon-success';
      case NotificationType.WARNING:
      case NotificationType.EVENT_REMINDER:
        return 'icon-warning';
      case NotificationType.ERROR:
      case NotificationType.ADOPTION_REJECTED:
      case NotificationType.VISIT_REJECTED:
        return 'icon-error';
      case NotificationType.ADOPTION_REQUEST:
        return 'icon-adoption';
      case NotificationType.VISIT_REQUEST:
        return 'icon-visit';
      case NotificationType.DONATION_RECEIVED:
        return 'icon-donation';
      case NotificationType.NEW_EVENT:
        return 'icon-event';
      default:
        return 'icon-info';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();

    if (now.getTime() - date.getTime() < 24 * 60 * 60 * 1000) {
      return this.getRelativeTime(date);
    }

    if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString(undefined, { weekday: 'long' });
    }

    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  private getRelativeTime(date: Date): string {
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) {
      return `${diffSeconds} seconds ago`;
    }

    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    }

    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  }

  handleClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (this.isPartOfActionComponent(target)) {
      event.stopPropagation();
      return;
    }

    this.onClick.emit(this.notification);
  }

  private isPartOfActionComponent(element: HTMLElement): boolean {
    let current = element;
    while (current && current.tagName !== 'APP-NOTIFICATION-ITEM') {
      if (current.tagName === 'APP-NOTIFICATION-ACTION' ||
        current.tagName === 'BUTTON' ||
        current.classList.contains('action-buttons') ||
        current.classList.contains('p-button')) {
        return true;
      }
      if (!current.parentElement) break;
      current = current.parentElement;
    }
    return false;
  }

  handleDelete(event: Event): void {
    event.stopPropagation();
    this.onDelete.emit(this.notification);
  }

  handleActionCompleted(result: {success: boolean, message: string}): void {
    if (result.success) {

      if (this.notification.type === NotificationType.ADOPTION_REQUEST) {
        if (result.message.includes('approved')) {
          this.notification.status = NotificationStatus.APPROVED;
          this.notification.type = NotificationType.ADOPTION_APPROVED;
        } else if (result.message.includes('rejected')) {
          this.notification.status = NotificationStatus.REJECTED;
          this.notification.type = NotificationType.ADOPTION_REJECTED;
        }
      } else if (this.notification.type === NotificationType.VISIT_REQUEST) {
        if (result.message.includes('approved')) {
          this.notification.status = NotificationStatus.APPROVED;
          this.notification.type = NotificationType.VISIT_APPROVED;
        } else if (result.message.includes('rejected')) {
          this.notification.status = NotificationStatus.REJECTED;
          this.notification.type = NotificationType.VISIT_REJECTED;
        }
      } else if (this.notification.type === NotificationType.DONATION_RECEIVED) {
        if (result.message.includes('confirmed')) {
          this.notification.status = NotificationStatus.CONFIRMED;
          this.notification.type = NotificationType.DONATION_CONFIRMED;
        } else if (result.message.includes('cancelled')) {
          this.notification.status = NotificationStatus.CANCELLED;

        }
      }
    }

    this.onActionCompleted.emit({
      notification: this.notification,
      success: result.success,
      message: result.message
    });
  }

  requiresAction(): boolean {
    return (
      this.notification.type === NotificationType.ADOPTION_REQUEST ||
      this.notification.type === NotificationType.VISIT_REQUEST ||
      this.notification.type === NotificationType.DONATION_RECEIVED
    );
  }

  hasStatus(): boolean {
    return !!this.notification.status ||
      this.notification.type === NotificationType.ADOPTION_APPROVED ||
      this.notification.type === NotificationType.ADOPTION_REJECTED ||
      this.notification.type === NotificationType.VISIT_APPROVED ||
      this.notification.type === NotificationType.VISIT_REJECTED ||
      this.notification.type === NotificationType.DONATION_CONFIRMED;
  }

  isApproved(): boolean {
    return this.notification.status === NotificationStatus.APPROVED ||
      this.notification.status === NotificationStatus.CONFIRMED ||
      this.notification.type === NotificationType.ADOPTION_APPROVED ||
      this.notification.type === NotificationType.VISIT_APPROVED ||
      this.notification.type === NotificationType.DONATION_CONFIRMED;
  }

  isRejected(): boolean {
    return this.notification.status === NotificationStatus.REJECTED ||
      this.notification.status === NotificationStatus.CANCELLED ||
      this.notification.type === NotificationType.ADOPTION_REJECTED ||
      this.notification.type === NotificationType.VISIT_REJECTED;
  }

  getStatusClass(): string {
    if (this.isApproved()) {
      return 'status-approved';
    } else if (this.isRejected()) {
      return 'status-rejected';
    }
    return '';
  }

  getStatusIconClass(): string {
    if (this.isApproved()) {
      return 'pi-check-circle';
    } else if (this.isRejected()) {
      return 'pi-times-circle';
    }
    return 'pi-info-circle';
  }

  getStatusMessage(): string {
    if (this.notification.type === NotificationType.ADOPTION_APPROVED) {
      return 'Adoption request has been approved';
    } else if (this.notification.type === NotificationType.ADOPTION_REJECTED) {
      return 'Adoption request has been rejected';
    } else if (this.notification.type === NotificationType.VISIT_APPROVED) {
      return 'Visit request has been approved';
    } else if (this.notification.type === NotificationType.VISIT_REJECTED) {
      return 'Visit request has been rejected';
    } else if (this.notification.type === NotificationType.DONATION_CONFIRMED) {
      return 'Donation has been confirmed';
    } else if (this.notification.status === NotificationStatus.APPROVED) {
      return 'Request has been approved';
    } else if (this.notification.status === NotificationStatus.REJECTED) {
      return 'Request has been rejected';
    } else if (this.notification.status === NotificationStatus.CONFIRMED) {
      return 'Donation has been confirmed';
    } else if (this.notification.status === NotificationStatus.CANCELLED) {
      return 'Donation has been cancelled';
    }
    return '';
  }

  openDetailDialog(event: Event): void {
    event.stopPropagation();
    this.showDetailDialog = true;
  }

  closeDetailDialog(): void {
    this.showDetailDialog = false;
  }

  handleApproveClick(event: Event): void {
    event.stopPropagation();
    if (this.actionComponent) {
      this.actionComponent.openApproveDialog();
    }
  }

  handleRejectClick(event: Event): void {
    event.stopPropagation();
    if (this.actionComponent) {
      this.actionComponent.openRejectDialog();
    }
  }
}
