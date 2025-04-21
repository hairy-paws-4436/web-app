import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {UserInterface} from '../../../../auth/interfaces/user-interface';
import {ConfirmationService, MessageService} from 'primeng/api';
import {UserProfileService} from '../../../services/profile/user-profile.service';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {Divider} from 'primeng/divider';
import {NgClass} from '@angular/common';
import {ConfirmDialog} from 'primeng/confirmdialog';

@Component({
  selector: 'app-account-settings',
  imports: [
    ButtonDirective,
    Ripple,
    Divider,
    NgClass,
    ConfirmDialog
  ],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.css'
})
export class AccountSettingsComponent {
  @Input() userProfile!: UserInterface;
  @Output() accountDeactivated = new EventEmitter<void>();

  private userService = inject(UserProfileService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  isDeactivating: boolean = false;

  confirmDeactivation(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to deactivate your account? This action cannot be undone.',
      header: 'Deactivate Account',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.deactivateAccount();
      }
    });
  }

  private deactivateAccount(): void {
    this.isDeactivating = true;

    this.userService.deactivateAccount().subscribe({
      next: () => {
        this.isDeactivating = false;
        this.accountDeactivated.emit();
      },
      error: (error) => {
        this.isDeactivating = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Deactivation Failed',
          detail: error.message || 'Failed to deactivate account'
        });
      }
    });
  }

  getFormattedDate(dateString?: string): string {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
