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
  petImagePreviews: string[] = []; // Solo para mostrar previews
  uploadedFiles: File[] = []; // Archivos reales para enviar

  // Dropdown options
  petTypes = [
    {label: 'Dog', value: 'dog'},
    {label: 'Cat', value: 'cat'},
  ];

  genderOptions = [
    {label: 'Male', value: 'male'},
    {label: 'Female', value: 'female'}
  ];

  ngOnInit(): void {
    this.initForm();
  }

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

    // Crear FormData para enviar como multipart/form-data
    const formData = new FormData();

    // Añadir todos los campos del formulario
    Object.keys(this.petForm.value).forEach(key => {
      const value = this.petForm.value[key];
      formData.append(key, value !== null && value !== undefined ? value.toString() : '');
    });

    // Añadir las imágenes
    this.uploadedFiles.forEach(file => {
      formData.append('images', file, file.name);
    });

    this.petService.registerPet(formData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Pet Registered',
          detail: 'The pet has been registered successfully'
        });

        setTimeout(() => {
          this.router.navigate(['/hairy-paws/my-pets']);
        }, 1500);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Registration error:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Registration Failed',
          detail: error.message || 'Failed to register pet. Please try again later.'
        });
      }
    });
  }

  onImageUpload(event: any): void {
    const files = event.files;
    if (!files || files.length === 0) return;

    // Check if maximum number of images is reached
    if (this.uploadedFiles.length + files.length > 5) {
      this.messageService.add({
        severity: 'error',
        summary: 'Upload Limit',
        detail: 'Maximum 5 images can be uploaded'
      });
      return;
    }

    for (let file of files) {
      // Guardar el archivo real
      this.uploadedFiles.push(file);

      // Crear preview para mostrar en la UI
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.petImagePreviews.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Images selected',
      detail: `${files.length} image(s) ready to be uploaded`
    });

    // NO hacer clear aquí, mantener los archivos seleccionados
    // event.clear(); // Comentar esta línea
  }

  removeImage(index: number): void {
    this.petImagePreviews.splice(index, 1);
    this.uploadedFiles.splice(index, 1);
  }

  isInvalid(fieldName: string): boolean {
    const field = this.petForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

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
