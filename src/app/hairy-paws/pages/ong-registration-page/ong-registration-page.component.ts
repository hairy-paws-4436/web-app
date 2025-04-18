import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {OngService} from '../../services/ong.service';
import {MessageService} from 'primeng/api';
import {OngInterface} from '../../interfaces/ong-interface';
import {Router} from '@angular/router';
import {InputText} from 'primeng/inputtext';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {Toast} from 'primeng/toast';
import {Card} from 'primeng/card';
import {NgClass, NgIf} from '@angular/common';
import {InputTextarea} from 'primeng/inputtextarea';
import {Divider} from 'primeng/divider';

@Component({
  selector: 'app-ong-registration-page',
  imports: [
    InputText,
    ButtonDirective,
    ReactiveFormsModule,
    Ripple,
    Toast,
    Card,
    NgClass,
    NgIf,
    InputTextarea,
    Divider
  ],
  templateUrl: './ong-registration-page.component.html',
  styleUrl: './ong-registration-page.component.css'
})
export class OngRegistrationPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ongService = inject(OngService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  ongForm!: FormGroup;
  isSubmitting: boolean = false;

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Initialize the ONG registration form
   */
  private initForm(): void {
    this.ongForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      ruc: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      website: [''],
      mission: [''],
      vision: [''],
      bankAccount: [''],
      bankName: [''],
      interbankAccount: ['']
    });
  }

  /**
   * Submit the ONG registration form
   */
  onSubmit(): void {
    if (this.ongForm.invalid) {
      this.ongForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Form Error',
        detail: 'Please check the form for errors'
      });
      return;
    }

    this.isSubmitting = true;

    const ongData: OngInterface = this.ongForm.value;

    this.ongService.registerOng(ongData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Registration Successful',
          detail: 'Your NGO has been registered successfully'
        });

        // Navigate to the ONG page after a delay
        setTimeout(() => {
          this.router.navigate(['/hairy-paws/ongs', response.id]);
        }, 1500);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Registration Failed',
          detail: error.message || 'Failed to register NGO. Please try again later.'
        });
      }
    });
  }

  /**
   * Check if a form field is invalid
   */
  isInvalid(fieldName: string): boolean {
    const field = this.ongForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  /**
   * Get validation error message for a field
   */
  getErrorMessage(fieldName: string): string {
    const field = this.ongForm.get(fieldName);

    if (!field || !field.errors) return '';

    if (field.errors['required']) {
      return 'This field is required';
    }

    if (field.errors['email']) {
      return 'Please enter a valid email address';
    }

    if (field.errors['minlength']) {
      return `Minimum length is ${field.errors['minlength'].requiredLength} characters`;
    }

    if (field.errors['pattern']) {
      switch (fieldName) {
        case 'ruc':
          return 'RUC must be 11 digits';
        case 'phone':
          return 'Phone number must be 9 digits';
        default:
          return 'Invalid format';
      }
    }

    return 'Invalid value';
  }
}
