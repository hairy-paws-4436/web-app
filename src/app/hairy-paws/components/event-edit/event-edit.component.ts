// event-edit.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';

import { EventService } from '../../services/event.service';
import {EventInterface} from '../../interfaces/event-interface';
import {InputTextarea} from 'primeng/inputtextarea';


@Component({
  selector: 'app-event-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    CalendarModule,
    InputNumberModule,
    CheckboxModule,
    DividerModule,
    ToastModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    RippleModule,
    InputTextarea
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './event-edit.component.html',
  styleUrl: './event-edit.component.css'
})
export class EventEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  eventForm!: FormGroup;
  isLoading: boolean = true;
  isSubmitting: boolean = false;
  eventId: string | null = null;
  originalEvent: EventInterface | null = null;

  // Minimum date for calendar (today)
  minDate: Date = new Date();

  ngOnInit(): void {
    this.initForm();
    this.loadEventDetails();

    // Listen for volunteer event changes
    this.eventForm.get('isVolunteerEvent')?.valueChanges.subscribe(isVolunteer => {
      this.handleVolunteerChange(isVolunteer);
    });
  }

  /**
   * Initialize the event form
   */
  private initForm(): void {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      eventDate: [null, Validators.required],
      endDate: [null],
      location: ['', Validators.required],
      isVolunteerEvent: [false],
      maxParticipants: [null],
      requirements: [''],
      active: [true]
    });
  }

  /**
   * Load event details for editing
   */
  private loadEventDetails(): void {
    this.isLoading = true;

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.eventId = id;
        this.fetchEventData(id);
      } else {
        this.handleError('Event ID not found');
        this.navigateBack();
      }
    });
  }

  /**
   * Fetch event data from the service
   */
  private fetchEventData(id: string): void {
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        this.originalEvent = event;
        this.patchFormValues(event);
        this.isLoading = false;
      },
      error: (error) => {
        this.handleError(error.message || 'Failed to load event details');
        this.navigateBack();
      }
    });
  }

  /**
   * Patch form values with event data
   */
  private patchFormValues(event: EventInterface): void {
    this.eventForm.patchValue({
      title: event.title,
      description: event.description,
      eventDate: new Date(event.eventDate),
      endDate: event.endDate ? new Date(event.endDate) : null,
      location: event.location,
      isVolunteerEvent: event.isVolunteerEvent,
      maxParticipants: event.maxParticipants,
      requirements: event.requirements,
      active: event.active !== undefined ? event.active : true
    });

    // Make sure validators are updated
    this.handleVolunteerChange(event.isVolunteerEvent);
  }

  /**
   * Handle volunteer event change to update validators
   */
  handleVolunteerChange(isVolunteer: boolean): void {
    const maxParticipantsControl = this.eventForm.get('maxParticipants');

    if (isVolunteer) {
      maxParticipantsControl?.setValidators([Validators.required, Validators.min(1)]);
    } else {
      maxParticipantsControl?.clearValidators();
    }

    maxParticipantsControl?.updateValueAndValidity();
  }

  /**
   * Submit updated event
   */
  onSubmit(): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Form Error',
        detail: 'Please check the form for errors'
      });
      return;
    }

    if (!this.eventId) {
      this.handleError('Event ID not found');
      return;
    }

    this.confirmUpdate();
  }

  /**
   * Confirm update with a dialog
   */
  private confirmUpdate(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to update this event?',
      header: 'Update Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.updateEvent();
      }
    });
  }

  /**
   * Update event with API
   */
  private updateEvent(): void {
    if (!this.eventId) return;

    this.isSubmitting = true;

    // Format dates for API
    const formData = this.prepareFormData();

    this.eventService.updateEvent(this.eventId, formData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Event Updated',
          detail: 'The event has been updated successfully'
        });

        // Navigate to event details page
        setTimeout(() => {
          this.router.navigate(['/hairy-paws/event-details', this.eventId]);
        }, 1500);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.handleError(error.message || 'Failed to update event. Please try again later.');
      }
    });
  }

  /**
   * Navigate back to event details
   */
  navigateBack(): void {
    if (this.eventId) {
      this.router.navigate(['/hairy-paws/events', this.eventId]);
    } else {
      this.router.navigate(['/hairy-paws/events']);
    }
  }

  /**
   * Handle error messages
   */
  private handleError(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message
    });
  }

  /**
   * Prepare form data for API submission
   */
  private prepareFormData(): EventInterface {
    const formValue = this.eventForm.value;

    return {
      ...formValue,
      eventDate: formValue.eventDate.toISOString(),
      endDate: formValue.endDate ? formValue.endDate.toISOString() : undefined
    };
  }

  /**
   * Cancel the edit operation
   */
  cancelEdit(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to cancel? Any unsaved changes will be lost.',
      header: 'Cancel Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.navigateBack();
      }
    });
  }

  /**
   * Check if a form field is invalid
   */
  isInvalid(fieldName: string): boolean {
    const field = this.eventForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  /**
   * Get validation error message for a field
   */
  getErrorMessage(fieldName: string): string {
    const field = this.eventForm.get(fieldName);

    if (!field || !field.errors) return '';

    if (field.errors['required']) {
      return 'This field is required';
    }

    if (field.errors['minlength']) {
      return `Minimum length is ${field.errors['minlength'].requiredLength} characters`;
    }

    if (field.errors['min']) {
      return `Minimum value is ${field.errors['min'].min}`;
    }

    return 'Invalid value';
  }
}
