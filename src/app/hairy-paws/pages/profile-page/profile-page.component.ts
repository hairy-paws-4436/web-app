import {Component, inject, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import {UserInterface} from '../../../auth/interfaces/user-interface';
import {UserProfileService} from '../../services/user-profile.service';
import {TabPanel, TabView} from 'primeng/tabview';
import {Toast} from 'primeng/toast';
import {NgClass, NgIf} from '@angular/common';
import {ButtonDirective} from 'primeng/button';
import {ChangePasswordComponent} from '../../components/change-password/change-password.component';
import {AccountSettingsComponent} from '../../components/account-settings/account-settings.component';
import {ProfileInfoComponent} from '../../components/profile-info/profile-info.component';

@Component({
  selector: 'app-profile-page',
  imports: [
    TabPanel,
    Toast,
    NgIf,
    TabView,
    ButtonDirective,
    ChangePasswordComponent,
    AccountSettingsComponent,
    ProfileInfoComponent,
    NgClass
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent implements OnInit {
  private userService = inject(UserProfileService);
  private messageService = inject(MessageService);

  userProfile: UserInterface | null = null;
  isLoading: boolean = true;
  activeTabIndex: number = 0;

  ngOnInit(): void {
    this.loadUserProfile();
  }

  /**
   * Load user profile data
   */
  loadUserProfile(): void {
    this.isLoading = true;

    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load user profile'
        });
        this.isLoading = false;
      }
    });
  }

  /**
   * Handle profile update event from child component
   */
  onProfileUpdated(updatedProfile: UserInterface): void {
    this.userProfile = updatedProfile;
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Profile updated successfully'
    });
  }

  /**
   * Handle password change event from child component
   */
  onPasswordChanged(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Password changed successfully'
    });
  }

  /**
   * Handle account deactivation event from child component
   */
  onAccountDeactivated(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Account Deactivated',
      detail: 'Your account has been deactivated. You will be logged out soon.'
    });

    // Redirect to logout after a short delay
    setTimeout(() => {
      // Assuming you have a logout route
      window.location.href = '/auth/logout';
    }, 3000);
  }
}

