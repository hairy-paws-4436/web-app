import { Component, inject, OnInit } from '@angular/core';
import {NotificationService} from '../../services/notification/notification.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Router} from '@angular/router';
import {NotificationInterface, NotificationType} from '../../interfaces/notification/notification-interface';
import {Toast} from 'primeng/toast';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {ButtonDirective} from 'primeng/button';
import {NgForOf, NgIf} from '@angular/common';
import {ProgreessSpinnerComponent} from '../../../shared/components/progreess-spinner/progreess-spinner.component';
import {NotificationItemComponent} from '../../components/notification/notification-item/notification-item.component';
import {TabPanel, TabView} from 'primeng/tabview';

@Component({
  selector: 'app-notifications-page',
  imports: [
    Toast,
    ConfirmDialog,
    NgIf,
    ProgreessSpinnerComponent,
    NotificationItemComponent,
    NgForOf,
    TabView,
    TabPanel,
  ],
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.css'
})
export class NotificationsPageComponent implements OnInit {
  private notificationService = inject(NotificationService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);

  notifications: NotificationInterface[] = [];
  filteredNotifications: NotificationInterface[] = [];
  isLoading: boolean = true;
  activeTabIndex: number = 0;

  readonly ACTION_REQUIRED_TAB = 1;
  readonly GENERAL_TAB = 2;

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.isLoading = true;

    this.notificationService.getNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.filterNotificationsByTab(this.activeTabIndex);
        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load notifications'
        });
        this.isLoading = false;
      }
    });
  }

  filterNotificationsByTab(tabIndex: number): void {
    this.activeTabIndex = tabIndex;

    switch (tabIndex) {
      case this.ACTION_REQUIRED_TAB:
        this.filteredNotifications = this.notifications.filter(n =>
          n.type === NotificationType.ADOPTION_REQUEST ||
          n.type === NotificationType.VISIT_REQUEST ||
          n.type === NotificationType.DONATION_RECEIVED
        );
        break;
      case this.GENERAL_TAB:
        this.filteredNotifications = this.notifications.filter(n =>
          n.type !== NotificationType.ADOPTION_REQUEST &&
          n.type !== NotificationType.VISIT_REQUEST &&
          n.type !== NotificationType.DONATION_RECEIVED
        );
        break;
      default:
        this.filteredNotifications = [...this.notifications];
    }
  }

  handleNotificationClick(notification: NotificationInterface): void {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id).subscribe({
        next: () => {
          const index = this.notifications.findIndex(n => n.id === notification.id);
          if (index !== -1) {
            this.notifications[index] = { ...notification, read: true };
            this.filterNotificationsByTab(this.activeTabIndex);
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to mark notification as read'
          });
        }
      });
    }

    if (notification.link) {
      this.router.navigateByUrl(notification.link);
    }
  }

  deleteNotification(notification: NotificationInterface): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this notification?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.performDelete(notification);
      }
    });
  }

  handleActionCompleted(result: {notification: NotificationInterface, success: boolean, message: string}): void {
    if (result.success) {
      // Reload notifications after successful action
      this.loadNotifications();
    }
  }

  private performDelete(notification: NotificationInterface): void {
    this.notificationService.deleteNotification(notification.id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.id !== notification.id);
        this.filterNotificationsByTab(this.activeTabIndex);

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Notification deleted successfully'
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to delete notification'
        });
      }
    });
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  get actionRequiredCount(): number {
    return this.notifications.filter(n =>
      (n.type === NotificationType.ADOPTION_REQUEST ||
        n.type === NotificationType.VISIT_REQUEST ||
        n.type === NotificationType.DONATION_RECEIVED) &&
      !n.read
    ).length;
  }
}

