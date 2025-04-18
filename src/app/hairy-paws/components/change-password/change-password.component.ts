import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {UserProfileService} from '../../services/user-profile.service';
import {MessageService} from 'primeng/api';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Password} from 'primeng/password';
import {NgClass, NgIf} from '@angular/common';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {Divider} from 'primeng/divider';

@Component({
  selector: 'app-change-password',
  imports: [
    Password,
    NgClass,
    ButtonDirective,
    Ripple,
    ReactiveFormsModule,
    Divider,
    NgIf
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit {
  @Output() passwordChanged = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private userService = inject(UserProfileService);
  private messageService = inject(MessageService);

  passwordForm!: FormGroup;
  isSubmitting: boolean = false;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {validator: this.passwordMatchValidator});
  }

  private passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({mismatch: true});
      return {mismatch: true};
    }

    return null;
  }

  onSubmit(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const {oldPassword, newPassword} = this.passwordForm.value;

    this.isSubmitting = true;

    this.userService.changePassword({oldPassword, newPassword}).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.resetForm();
        this.passwordChanged.emit();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Password Change Failed',
          detail: error.message || 'Failed to change password. Please check your current password and try again.'
        });
      }
    });
  }

  private resetForm(): void {
    this.passwordForm.reset();
    this.passwordForm.markAsPristine();
    this.passwordForm.markAsUntouched();
  }

  isInvalid(fieldName: string): boolean {
    const field = this.passwordForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.passwordForm.get(fieldName);

    if (!field || !field.errors) return '';

    if (field.errors['required']) {
      return 'This field is required';
    }

    if (field.errors['minlength']) {
      return `Password must be at least ${field.errors['minlength'].requiredLength} characters`;
    }

    if (field.errors['mismatch']) {
      return 'Passwords do not match';
    }

    return 'Invalid value';
  }
}

