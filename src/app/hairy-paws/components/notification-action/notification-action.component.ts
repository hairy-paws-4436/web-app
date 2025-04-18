import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {NotificationService} from '../../services/notification.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MessageService, PrimeTemplate} from 'primeng/api';
import {

  NotificationInterface, NotificationType
} from '../../interfaces/notification-interface';
import {NgClass, NgIf, NgSwitch, NgSwitchCase} from '@angular/common';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {Dialog} from 'primeng/dialog';
import {Textarea} from 'primeng/textarea';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-notification-action',
  imports: [
    NgSwitch,
    NgSwitchCase,
    ButtonDirective,
    Ripple,
    Dialog,
    ReactiveFormsModule,
    Textarea,
    NgClass,
    NgIf,
    PrimeTemplate,
    Toast
  ],
  templateUrl: './notification-action.component.html',
  styleUrl: './notification-action.component.css'
})
export class NotificationActionComponent implements OnInit {
  @Input() notification!: NotificationInterface;
  @Output() actionCompleted = new EventEmitter<{ success: boolean, message: string }>();

  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);
  private messageService = inject(MessageService);

  actionForm!: FormGroup;
  showDialog: boolean = false;
  isSubmitting: boolean = false;
  dialogTitle: string = '';
  actionType: string = '';

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Initialize the action form
   */
  private initForm(): void {
    this.actionForm = this.fb.group({
      notes: ['', [Validators.required, Validators.minLength(5)]],
      reason: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  /**
   * Open approval dialog
   */
  openApproveDialog(): void {
    this.dialogTitle = 'Approve Request';
    this.actionType = 'approve';
    this.actionForm.get('reason')?.clearValidators();
    this.actionForm.get('notes')?.setValidators([Validators.required, Validators.minLength(5)]);
    this.actionForm.updateValueAndValidity();
    this.showDialog = true;
  }

  /**
   * Open rejection dialog
   */
  openRejectDialog(): void {
    this.dialogTitle = 'Reject Request';
    this.actionType = 'reject';
    this.actionForm.get('notes')?.clearValidators();
    this.actionForm.get('reason')?.setValidators([Validators.required, Validators.minLength(5)]);
    this.actionForm.updateValueAndValidity();
    this.showDialog = true;
  }

  /**
   * Close action dialog
   */
  closeDialog(): void {
    this.showDialog = false;
    this.actionForm.reset();
  }

  /**
   * Submit the action
   */
  submitAction(): void {
    if (this.actionForm.invalid) {
      this.actionForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    if (!this.notification.relatedEntityId) {
      this.handleError('No related entity found for this notification');
      return;
    }

    switch (this.actionType) {
      case 'approve':
        this.approveRequest();
        break;
      case 'reject':
        this.rejectRequest();
        break;
      default:
        this.handleError('Invalid action type');
    }
  }

  /**
   * Approve the request based on notification type
   */
  private approveRequest(): void {
    const entityId = this.notification.relatedEntityId as string;
    const notes = this.actionForm.get('notes')?.value;

    if (this.notification.type === NotificationType.ADOPTION_REQUEST) {
      this.notificationService.approveAdoption(entityId, {notes}).subscribe({
        next: () => this.handleSuccess('Adoption request approved successfully'),
        error: (error) => this.handleError(error.message || 'Failed to approve adoption request')
      });
    } else if (this.notification.type === NotificationType.DONATION_RECEIVED) {
      this.notificationService.confirmDonation(entityId, {notes}).subscribe({
        next: () => this.handleSuccess('Donation confirmed successfully'),
        error: (error) => this.handleError(error.message || 'Failed to confirm donation')
      });
    } else {
      this.handleError('Unsupported notification type for approval');
    }
  }

  /**
   * Reject the request based on notification type
   */
  private rejectRequest(): void {
    const entityId = this.notification.relatedEntityId as string;
    const reason = this.actionForm.get('reason')?.value;

    if (this.notification.type === NotificationType.ADOPTION_REQUEST) {
      this.notificationService.rejectAdoption(entityId, {reason}).subscribe({
        next: () => this.handleSuccess('Adoption request rejected'),
        error: (error) => this.handleError(error.message || 'Failed to reject adoption request')
      });
    } else if (this.notification.type === NotificationType.DONATION_RECEIVED) {
      this.notificationService.cancelDonation(entityId).subscribe({
        next: () => this.handleSuccess('Donation cancelled'),
        error: (error) => this.handleError(error.message || 'Failed to cancel donation')
      });
    } else {
      this.handleError('Unsupported notification type for rejection');
    }
  }

  /**
   * Handle successful action
   */
  private handleSuccess(message: string): void {
    this.isSubmitting = false;
    this.showDialog = false;
    this.actionForm.reset();

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message
    });

    this.actionCompleted.emit({success: true, message});
  }

  /**
   * Handle error
   */
  private handleError(message: string): void {
    this.isSubmitting = false;

    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message
    });

    this.actionCompleted.emit({success: false, message});
  }

  /**
   * Check if the form field is invalid
   */
  isInvalid(fieldName: string): boolean {
    const field = this.actionForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  /**
   * Get validation error message for a field
   */
  getErrorMessage(fieldName: string): string {
    const field = this.actionForm.get(fieldName);

    if (!field || !field.errors) return '';

    if (field.errors['required']) {
      return 'This field is required';
    }

    if (field.errors['minlength']) {
      return `Minimum length is ${field.errors['minlength'].requiredLength} characters`;
    }

    return 'Invalid value';
  }

  /**
   * Check if notification requires approval/rejection
   */
  requiresAction(): boolean {
    return this.notification.type === NotificationType.ADOPTION_REQUEST ||
      this.notification.type === NotificationType.DONATION_RECEIVED;
  }

  /**
   * Get field name based on action type
   */
  getFieldName(): string {
    return this.actionType === 'approve' ? 'notes' : 'reason';
  }

  /**
   * Get field label based on action type
   */
  getFieldLabel(): string {
    if (this.actionType === 'approve') {
      if (this.notification.type === NotificationType.ADOPTION_REQUEST) {
        return 'Approval Notes';
      } else {
        return 'Confirmation Notes';
      }
    } else {
      if (this.notification.type === NotificationType.ADOPTION_REQUEST) {
        return 'Rejection Reason';
      } else {
        return 'Cancellation Reason';
      }
    }
  }

  /**
   * Get field placeholder based on action type
   */
  getFieldPlaceholder(): string {
    if (this.actionType === 'approve') {
      if (this.notification.type === NotificationType.ADOPTION_REQUEST) {
        return 'Enter notes for the adopter (e.g., pickup details, next steps)';
      } else {
        return 'Enter confirmation notes (e.g., items received, condition)';
      }
    } else {
      if (this.notification.type === NotificationType.ADOPTION_REQUEST) {
        return 'Enter reason for rejecting the adoption request';
      } else {
        return 'Enter reason for cancelling the donation';
      }
    }
  }

  /**
   * Get button label based on action type and notification type
   */
  getButtonLabel(): string {
    if (this.actionType === 'approve') {
      return this.notification.type === NotificationType.ADOPTION_REQUEST ? 'Approve Adoption' : 'Confirm Donation';
    } else {
      return this.notification.type === NotificationType.ADOPTION_REQUEST ? 'Reject Adoption' : 'Cancel Donation';
    }
  }
}

