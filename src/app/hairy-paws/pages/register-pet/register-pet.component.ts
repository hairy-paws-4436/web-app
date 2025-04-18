import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {PetService} from '../../services/pet.service';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {PetInterface} from '../../interfaces/pet-interface';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {Divider} from 'primeng/divider';
import {FileUpload} from 'primeng/fileupload';
import {Textarea} from 'primeng/textarea';
import {Checkbox} from 'primeng/checkbox';
import {InputNumber} from 'primeng/inputnumber';
import {DropdownModule} from 'primeng/dropdown';
import {InputText} from 'primeng/inputtext';
import {Card} from 'primeng/card';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-register-pet',
  imports: [
    NgIf,
    ButtonDirective,
    Ripple,
    Divider,
    FileUpload,
    Textarea,
    ReactiveFormsModule,
    NgClass,
    Checkbox,
    InputNumber,
    DropdownModule,
    InputText,
    Card,
    Toast,
  ],
  templateUrl: './register-pet.component.html',
  styleUrl: './register-pet.component.css'
})
export class RegisterPetComponent implements OnInit {
  private fb = inject(FormBuilder);
  private petService = inject(PetService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  petForm!: FormGroup;
  isSubmitting: boolean = false;
  petImages: string[] = [];
  uploadedFiles: File[] = [];

  // Dropdown options
  petTypes = [
    {label: 'Dog', value: 'dog'},
    {label: 'Cat', value: 'cat'},
    {label: 'Bird', value: 'bird'},
    {label: 'Rabbit', value: 'rabbit'},
    {label: 'Hamster', value: 'hamster'},
    {label: 'Other', value: 'other'}
  ];

  genderOptions = [
    {label: 'Male', value: 'male'},
    {label: 'Female', value: 'female'}
  ];

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Initialize the pet registration form
   */
  private initForm(): void {
    this.petForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      type: ['', Validators.required],
      breed: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(0)]],
      gender: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      weight: [null],
      healthDetails: [''],
      vaccinated: [false, Validators.required],
      sterilized: [false, Validators.required]
    });
  }

  /**
   * Submit form to register a new pet
   */
  onSubmit(): void {
    if (this.petForm.invalid) {
      this.petForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Form Error',
        detail: 'Please check the form for errors'
      });
      return;
    }

    this.isSubmitting = true;

    // Prepare pet data
    const petData: PetInterface = {
      ...this.petForm.value,
      images: this.petImages.length > 0 ? this.petImages : undefined
    };

    this.petService.registerPet(petData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Pet Registered',
          detail: 'The pet has been registered successfully'
        });

        // Navigate to pet details page
        setTimeout(() => {
          this.router.navigate(['/hairy-paws/my-pets']);
        }, 1500);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Registration Failed',
          detail: error.message || 'Failed to register pet. Please try again later.'
        });
      }
    });
  }

  /**
   * Handle pet image upload
   */
  onImageUpload(event: any): void {
    const files = event.files;
    if (!files || files.length === 0) return;

    // Check if maximum number of images is reached
    if (this.petImages.length + files.length > 5) {
      this.messageService.add({
        severity: 'error',
        summary: 'Upload Limit',
        detail: 'Maximum 5 images can be uploaded'
      });
      return;
    }

    for (let file of files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.petImages.push(e.target.result);
      };
      reader.readAsDataURL(file);
      this.uploadedFiles.push(file);
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Images ready',
      detail: 'Images will be sent upon registration of the pet.'
    });

    // Reset the file uploader
    event.clear();
  }

  /**
   * Remove an uploaded image
   */
  removeImage(index: number): void {
    this.petImages.splice(index, 1);
    this.uploadedFiles.splice(index, 1);
  }

  /**
   * Check if a form field is invalid
   */
  isInvalid(fieldName: string): boolean {
    const field = this.petForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  /**
   * Get validation error message for a field
   */
  getErrorMessage(fieldName: string): string {
    const field = this.petForm.get(fieldName);

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

