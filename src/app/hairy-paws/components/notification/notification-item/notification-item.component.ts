import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NotificationInterface, NotificationType} from '../../../interfaces/notification/notification-interface';
import {NgClass, NgIf} from '@angular/common';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {Tooltip} from 'primeng/tooltip';
import {NotificationActionComponent} from '../notification-action/notification-action.component';

@Component({
  selector: 'app-notification-item',
  imports: [
    NgClass,
    NgIf,
    ButtonDirective,
    Ripple,
    Tooltip,
    NotificationActionComponent,
  ],
  templateUrl: './notification-item.component.html',
  styleUrl: './notification-item.component.css'
})
export class NotificationItemComponent {
  @Input() notification!: NotificationInterface;

  @Output() onClick = new EventEmitter<NotificationInterface>();
  @Output() onDelete = new EventEmitter<NotificationInterface>();
  @Output() onActionCompleted = new EventEmitter<{notification: NotificationInterface, success: boolean, message: string}>();

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

  handleClick(): void {
    this.onClick.emit(this.notification);
  }

  handleDelete(event: Event): void {
    event.stopPropagation();
    this.onDelete.emit(this.notification);
  }

  handleActionCompleted(result: {success: boolean, message: string}): void {
    this.onActionCompleted.emit({
      notification: this.notification,
      success: result.success,
      message: result.message
    });
  }

  requiresAction(): boolean {
    return this.notification.type === NotificationType.ADOPTION_REQUEST ||
      this.notification.type === NotificationType.VISIT_REQUEST ||
      this.notification.type === NotificationType.DONATION_RECEIVED;
  }
}
