import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {NotificationService} from '../../../services/notification/notification.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MessageService, PrimeTemplate} from 'primeng/api';
import {NotificationInterface, NotificationStatus, NotificationType} from '../../../interfaces/notification/notification-interface';
import {NgClass, NgIf, NgSwitch, NgSwitchCase} from '@angular/common';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {Dialog} from 'primeng/dialog';
import {Textarea} from 'primeng/textarea';
import {Toast} from 'primeng/toast';
import {AuthService} from '../../../../auth/services/auth.service';


@Component({
  selector: 'app-notification-action',
  standalone: true,
  imports: [

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
  private authService = inject(AuthService);

  actionForm!: FormGroup;
  showDialog: boolean = false;
  isSubmitting: boolean = false;
  dialogTitle: string = '';
  actionType: string = '';
  canPerformAction: boolean = true;

  ngOnInit(): void {
    this.initForm();
    //this.checkPermissions();
  }

  private initForm(): void {
    this.actionForm = this.fb.group({
      text: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  private checkPermissions(): void {
    const currentUserId = this.authService.getCurrentUserId();
    this.canPerformAction = this.notification.userId === currentUserId;

    if (this.notification.referenceType === 'adoption') {
      this.canPerformAction = this.canPerformAction && (this.authService.isOwner() || this.authService.isONG());
    } else if (this.notification.referenceType === 'donation') {
      this.canPerformAction = this.canPerformAction && this.authService.isONG();
    } else if (this.notification.referenceType === 'visit') {
      this.canPerformAction = this.canPerformAction && (this.authService.isOwner() || this.authService.isONG());
    }
  }

  openApproveDialog(): void {
    if (!this.canPerformAction) {
      this.messageService.add({
        severity: 'error',
        summary: 'Unauthorized',
        detail: 'You do not have permission to perform this action'
      });
      return;
    }

    this.dialogTitle = this.getApproveDialogTitle();
    this.actionType = 'approve';
    this.actionForm.reset({ text: '' });
    this.actionForm.get('text')?.setValidators([Validators.required, Validators.minLength(5)]);
    this.actionForm.get('text')?.updateValueAndValidity();
    this.showDialog = true;
  }

  openRejectDialog(): void {
    if (!this.canPerformAction) {
      this.messageService.add({
        severity: 'error',
        summary: 'Unauthorized',
        detail: 'You do not have permission to perform this action'
      });
      return;
    }

    this.dialogTitle = this.getRejectDialogTitle();
    this.actionType = 'reject';
    this.actionForm.reset({ text: '' });
    this.actionForm.get('text')?.setValidators([Validators.required, Validators.minLength(5)]);
    this.actionForm.get('text')?.updateValueAndValidity();
    this.showDialog = true;
  }

  closeDialog(): void {
    this.showDialog = false;
    this.actionForm.reset();
  }

  submitAction(): void {
    if (this.actionForm.invalid) {
      this.actionForm.markAllAsTouched();
      return;
    }

    if (!this.canPerformAction) {
      this.handleError('You do not have permission to perform this action');
      return;
    }

    if (!this.notification.referenceId) {
      this.handleError('No reference ID found for this notification');
      return;
    }

    this.isSubmitting = true;

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

  private approveRequest(): void {
    const referenceId = this.notification.referenceId;
    const text = this.actionForm.get('text')?.value;

    switch (this.notification.referenceType) {
      case 'adoption':
        this.notificationService.approveAdoption(referenceId, { notes: text }).subscribe({
          next: () => {
            this.notification.status = NotificationStatus.APPROVED;
            this.notification.type = NotificationType.ADOPTION_APPROVED;
            this.handleSuccess('Adoption request approved successfully');
          },
          error: (error) => this.handleError(error.message || 'Failed to approve adoption request')
        });
        break;

      case 'donation':
        this.notificationService.confirmDonation(referenceId, { notes: text }).subscribe({
          next: () => {
            this.notification.status = NotificationStatus.CONFIRMED;
            this.notification.type = NotificationType.DONATION_CONFIRMED;
            this.handleSuccess('Donation confirmed successfully');
          },
          error: (error) => this.handleError(error.message || 'Failed to confirm donation')
        });
        break;

      case 'visit':
        this.notificationService.approveAdoption(referenceId, { notes: text }).subscribe({
          next: () => {
            this.notification.status = NotificationStatus.APPROVED;
            this.notification.type = NotificationType.VISIT_APPROVED;
            this.handleSuccess('Visit request approved successfully');
          },
          error: (error) => this.handleError(error.message || 'Failed to approve visit request')
        });
        break;

      default:
        this.handleError('Unsupported reference type for approval');
    }
  }

  private rejectRequest(): void {
    const referenceId = this.notification.referenceId;
    const text = this.actionForm.get('text')?.value;

    switch (this.notification.referenceType) {
      case 'adoption':
        this.notificationService.rejectAdoption(referenceId, { reason: text }).subscribe({
          next: () => {
            this.notification.status = NotificationStatus.REJECTED;
            this.notification.type = NotificationType.ADOPTION_REJECTED;
            this.handleSuccess('Adoption request rejected');
          },
          error: (error) => this.handleError(error.message || 'Failed to reject adoption request')
        });
        break;

      case 'donation':
        this.notificationService.cancelDonation(referenceId).subscribe({
          next: () => {
            this.notification.status = NotificationStatus.CANCELLED;
            this.handleSuccess('Donation cancelled');
          },
          error: (error) => this.handleError(error.message || 'Failed to cancel donation')
        });
        break;

      case 'visit':
        this.notificationService.rejectAdoption(referenceId, { reason: text }).subscribe({
          next: () => {
            this.notification.status = NotificationStatus.REJECTED;
            this.notification.type = NotificationType.VISIT_REJECTED;
            this.handleSuccess('Visit request rejected');
          },
          error: (error) => this.handleError(error.message || 'Failed to reject visit request')
        });
        break;

      default:
        this.handleError('Unsupported reference type for rejection');
    }
  }

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

  private handleError(message: string): void {
    this.isSubmitting = false;

    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message
    });

    this.actionCompleted.emit({success: false, message});
  }

  isInvalid(fieldName: string): boolean {
    const field = this.actionForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

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

  requiresAction(): boolean {
    return this.canPerformAction && (
      this.notification.type === NotificationType.ADOPTION_REQUEST ||
      this.notification.type === NotificationType.DONATION_RECEIVED ||
      this.notification.type === NotificationType.VISIT_REQUEST
    );
  }

  getApproveDialogTitle(): string {
    switch (this.notification.referenceType) {
      case 'adoption':
        return 'Approve Adoption Request';
      case 'donation':
        return 'Confirm Donation';
      case 'visit':
        return 'Approve Visit Request';
      default:
        return 'Approve Request';
    }
  }

  getRejectDialogTitle(): string {
    switch (this.notification.referenceType) {
      case 'adoption':
        return 'Reject Adoption Request';
      case 'donation':
        return 'Cancel Donation';
      case 'visit':
        return 'Reject Visit Request';
      default:
        return 'Reject Request';
    }
  }

  getFieldLabel(): string {
    if (this.actionType === 'approve') {
      switch (this.notification.referenceType) {
        case 'adoption':
          return 'Approval Notes';
        case 'donation':
          return 'Confirmation Notes';
        case 'visit':
          return 'Approval Notes';
        default:
          return 'Notes';
      }
    } else {
      switch (this.notification.referenceType) {
        case 'adoption':
          return 'Rejection Reason';
        case 'donation':
          return 'Cancellation Reason';
        case 'visit':
          return 'Rejection Reason';
        default:
          return 'Reason';
      }
    }
  }

  getFieldPlaceholder(): string {
    if (this.actionType === 'approve') {
      switch (this.notification.referenceType) {
        case 'adoption':
          return 'Enter notes for the adopter (e.g., pickup details, next steps)';
        case 'donation':
          return 'Enter confirmation notes (e.g., items received, condition)';
        case 'visit':
          return 'Enter notes for the visitor (e.g., visit details, timing)';
        default:
          return 'Enter notes';
      }
    } else {
      switch (this.notification.referenceType) {
        case 'adoption':
          return 'Enter reason for rejecting the adoption request';
        case 'donation':
          return 'Enter reason for cancelling the donation';
        case 'visit':
          return 'Enter reason for rejecting the visit request';
        default:
          return 'Enter reason';
      }
    }
  }

  getButtonLabel(): string {
    if (this.actionType === 'approve') {
      switch (this.notification.referenceType) {
        case 'adoption':
          return 'Approve Adoption';
        case 'donation':
          return 'Confirm Donation';
        case 'visit':
          return 'Approve Visit';
        default:
          return 'Approve';
      }
    } else {
      switch (this.notification.referenceType) {
        case 'adoption':
          return 'Reject Adoption';
        case 'donation':
          return 'Cancel Donation';
        case 'visit':
          return 'Reject Visit';
        default:
          return 'Reject';
      }
    }
  }
}
