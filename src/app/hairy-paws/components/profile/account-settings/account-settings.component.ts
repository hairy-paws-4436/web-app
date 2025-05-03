import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {UserInterface} from '../../../../auth/interfaces/user-interface';
import {ConfirmationService, MessageService} from 'primeng/api';
import {UserProfileService} from '../../../services/profile/user-profile.service';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {Divider} from 'primeng/divider';
import {NgClass, NgIf} from '@angular/common';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {Tag} from 'primeng/tag';
import {Card} from 'primeng/card';
import {AuthService} from '../../../../auth/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-account-settings',
  imports: [
    ButtonDirective,
    Ripple,
    Divider,
    NgClass,
    ConfirmDialog,
    Tag,
    Card,
    NgIf
  ],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.css'
})
export class AccountSettingsComponent implements OnInit {
  @Input() userProfile!: UserInterface;
  @Output() accountDeactivated = new EventEmitter<void>();

  private authService = inject(AuthService);
  private userService = inject(UserProfileService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  is2FAEnabled = false;
  isChecking2FA = false;
  isDeactivating: boolean = false;


  ngOnInit() {
    this.check2FAStatus();
  }

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

  check2FAStatus() {
    this.isChecking2FA = true;
    this.authService.get2FAStatus().subscribe({
      next: (enabled) => {
        this.is2FAEnabled = enabled;
        this.isChecking2FA = false;
      },
      error: (error) => {
        console.error('Error checking 2FA status:', error);
        this.isChecking2FA = false;
      }
    });
  }

  navigate2FASetup() {
    this.router.navigate(['/hairy-paws/profile/2fa-setup']);
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
