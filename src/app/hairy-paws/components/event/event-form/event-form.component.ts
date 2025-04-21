import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {EventService} from '../../../services/event/event.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {EventInterface} from '../../../interfaces/event/event-interface';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {InputNumber} from 'primeng/inputnumber';
import {NgClass, NgIf} from '@angular/common';
import {Checkbox} from 'primeng/checkbox';
import {Divider} from 'primeng/divider';
import {InputText} from 'primeng/inputtext';
import {Card} from 'primeng/card';
import {Toast} from 'primeng/toast';
import {Textarea} from 'primeng/textarea';
import {DatePicker} from 'primeng/datepicker';

@Component({
  selector: 'app-event-form',
  imports: [
    ButtonDirective,
    Ripple,
    ReactiveFormsModule,
    InputNumber,
    NgClass,
    NgIf,
    Checkbox,
    Divider,
    InputText,
    Card,
    Toast,
    Textarea,
    DatePicker
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})
export class EventFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);

  eventForm!: FormGroup;
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  isEditMode: boolean = false;
  eventId: string | null = null;

  minDate: Date = new Date();

  ngOnInit(): void {
    this.initForm();
    this.checkRouteParams();

    this.eventForm.get('isVolunteerEvent')?.valueChanges.subscribe(isVolunteer => {
      this.handleVolunteerChange(isVolunteer);
    });
  }


  private initForm(): void {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      eventDate: [null, Validators.required],
      endDate: [null],
      location: ['', Validators.required],
      isVolunteerEvent: [false],
      maxParticipants: [null],
      requirements: ['']
    });
  }

  private checkRouteParams(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.isEditMode = true;
        this.eventId = id;
        this.loadEventDetails(id);
      }
    });
  }

  private loadEventDetails(id: string): void {
    this.isLoading = true;

    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        this.patchFormValues(event);
        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load event details'
        });
        this.isLoading = false;
      }
    });
  }

  private patchFormValues(event: EventInterface): void {
    this.eventForm.patchValue({
      title: event.title,
      description: event.description,
      eventDate: new Date(event.eventDate),
      endDate: event.endDate ? new Date(event.endDate) : null,
      location: event.location,
      isVolunteerEvent: event.isVolunteerEvent,
      maxParticipants: event.maxParticipants,
      requirements: event.requirements
    });

    this.handleVolunteerChange(event.isVolunteerEvent);
  }

  handleVolunteerChange(isVolunteer: boolean): void {
    const maxParticipantsControl = this.eventForm.get('maxParticipants');

    if (isVolunteer) {
      maxParticipantsControl?.setValidators([Validators.required, Validators.min(1)]);
    } else {
      maxParticipantsControl?.clearValidators();
    }

    maxParticipantsControl?.updateValueAndValidity();
  }

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

    this.isSubmitting = true;

    const formData = this.prepareFormData();

    if (this.isEditMode && this.eventId) {
      this.updateEvent(this.eventId, formData);
    } else {
      this.createEvent(formData);
    }
  }

  private createEvent(eventData: EventInterface): void {
    this.eventService.createEvent(eventData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Event Created',
          detail: 'The event has been created successfully'
        });
        setTimeout(() => {
          this.router.navigate(['/hairy-paws/event-details', response.id]);
        }, 1500);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Creation Failed',
          detail: error.message || 'Failed to create event. Please try again later.'
        });
      }
    });
  }

  private updateEvent(id: string, eventData: EventInterface): void {
    this.eventService.updateEvent(id, eventData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Event Updated',
          detail: 'The event has been updated successfully'
        });

        setTimeout(() => {
          this.router.navigate(['/hairy-paws/events', response.id]);
        }, 1500);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Update Failed',
          detail: error.message || 'Failed to update event. Please try again later.'
        });
      }
    });
  }

  private prepareFormData(): EventInterface {
    const formValue = this.eventForm.value;

    return {
      ...formValue,
      eventDate: formValue.eventDate.toISOString(),
      endDate: formValue.endDate ? formValue.endDate.toISOString() : undefined
    };
  }

  isInvalid(fieldName: string): boolean {
    const field = this.eventForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

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

