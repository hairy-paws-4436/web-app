import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {OngService} from '../../services/ong.service';
import {MessageService, PrimeTemplate} from 'primeng/api';
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
import {FileUpload} from "primeng/fileupload";
import {Textarea} from 'primeng/textarea';

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
    Divider,
    FileUpload,
    PrimeTemplate,
    Textarea
  ],
  templateUrl: './ong-registration-page.component.html',
  styleUrl: './ong-registration-page.component.css'
})
export class OngRegistrationPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ongService = inject(OngService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  uploadedFile: File | null = null; // Single file for logo
  logoPreview: string | null = null; // Preview of the logo

  ongForm!: FormGroup;
  isSubmitting: boolean = false;

  ngOnInit(): void {
    this.initForm();
  }

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

  onLogoUpload(event: any): void {
    const file = event.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid File',
        detail: 'Please upload an image file'
      });
      return;
    }

    // Store the actual file
    this.uploadedFile = file;

    // Create preview for display
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.logoPreview = e.target.result;
    };
    reader.readAsDataURL(file);

    this.messageService.add({
      severity: 'success',
      summary: 'Logo uploaded',
      detail: 'Logo will be saved with your ONG registration'
    });
  }

  removeLogo(): void {
    this.uploadedFile = null;
    this.logoPreview = null;
  }

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

    // Create FormData to send as multipart/form-data
    const formData = new FormData();

    // Add all form fields
    Object.keys(this.ongForm.value).forEach(key => {
      const value = this.ongForm.value[key];
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    // Add logo if uploaded
    if (this.uploadedFile) {
      formData.append('logo', this.uploadedFile, this.uploadedFile.name);
    }

    this.ongService.registerOng(formData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Registration Successful',
          detail: 'Your NGO has been registered successfully'
        });

        setTimeout(() => {
          this.router.navigate(['/hairy-paws/ong-details', response.id]);
        }, 1500);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Registration error:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Registration Failed',
          detail: error.message || 'Failed to register NGO. Please try again later.'
        });
      }
    });
  }

  isInvalid(fieldName: string): boolean {
    const field = this.ongForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

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
