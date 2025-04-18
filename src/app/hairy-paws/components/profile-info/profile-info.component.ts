import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserInterface} from '../../../auth/interfaces/user-interface';
import {UserProfileService} from '../../services/user-profile.service';
import {MessageService} from 'primeng/api';
import {ButtonDirective} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {Ripple} from 'primeng/ripple';
import {NgClass, NgIf} from '@angular/common';
import {Divider} from 'primeng/divider';
import {FileUpload} from 'primeng/fileupload';

@Component({
  selector: 'app-profile-info',
  imports: [
    ButtonDirective,
    InputText,
    FormsModule,
    Ripple,
    NgClass,
    NgIf,
    ReactiveFormsModule,
    Divider,
    FileUpload
  ],
  templateUrl: './profile-info.component.html',
  styleUrl: './profile-info.component.css'
})
export class ProfileInfoComponent implements OnInit {
  @Input() userProfile!: UserInterface;
  @Output() profileUpdated = new EventEmitter<UserInterface>();

  private fb = inject(FormBuilder);
  private userService = inject(UserProfileService);
  private messageService = inject(MessageService);

  profileForm!: FormGroup;
  isSubmitting: boolean = false;
  isUploadingImage: boolean = false;

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Initialize the profile form with user data
   */
  private initForm(): void {
    this.profileForm = this.fb.group({
      firstName: [this.userProfile.firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [this.userProfile.lastName, [Validators.required, Validators.minLength(2)]],
      phoneNumber: [this.userProfile.phoneNumber, [Validators.required, Validators.pattern(/^\d{9}$/)]],
      address: [this.userProfile.address, Validators.required]
    });
  }

  /**
   * Update user profile
   */
  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Form Error',
        detail: 'Please check the form for errors'
      });
      return;
    }

    this.isSubmitting = true;

    this.userService.updateUserProfile(this.profileForm.value).subscribe({
      next: (updatedProfile) => {
        this.isSubmitting = false;
        this.profileUpdated.emit(updatedProfile);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Update Failed',
          detail: error.message || 'Failed to update profile'
        });
      }
    });
  }

  /**
   * Handle profile image upload
   */
  onProfileImageUpload(event: any): void {
    const file = event.files[0];
    if (!file) return;

    this.isUploadingImage = true;

    this.userService.uploadProfileImage(file).subscribe({
      next: (response) => {
        this.isUploadingImage = false;

        // Update profile with new image URL
        this.userProfile = {
          ...this.userProfile,
          profileImageUrl: response.profileImageUrl
        };

        // Emit the updated profile
        this.profileUpdated.emit(this.userProfile);

        this.messageService.add({
          severity: 'success',
          summary: 'Image Uploaded',
          detail: 'Profile image updated successfully'
        });

        // Reset the file uploader
        event.clear();
      },
      error: (error) => {
        this.isUploadingImage = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Upload Failed',
          detail: error.message || 'Failed to upload profile image'
        });

        // Reset the file uploader
        event.clear();
      }
    });
  }

  /**
   * Check if a form field is invalid
   */
  isInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  /**
   * Get validation error message for a field
   */
  getErrorMessage(fieldName: string): string {
    const field = this.profileForm.get(fieldName);

    if (!field || !field.errors) return '';

    if (field.errors['required']) {
      return 'This field is required';
    }

    if (field.errors['minlength']) {
      return `Minimum length is ${field.errors['minlength'].requiredLength} characters`;
    }

    if (field.errors['pattern']) {
      if (fieldName === 'phoneNumber') {
        return 'Phone number must be 9 digits';
      }
      return 'Invalid format';
    }

    return 'Invalid value';
  }
}

