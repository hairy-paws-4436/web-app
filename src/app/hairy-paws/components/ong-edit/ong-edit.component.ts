import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OngService } from '../../services/ong.service';
import {MessageService, PrimeTemplate} from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import {Toast} from 'primeng/toast';
import {ProgressSpinner} from 'primeng/progressspinner';
import {Card} from 'primeng/card';
import {NgClass, NgIf} from '@angular/common';
import {FileUpload} from 'primeng/fileupload';
import {Button} from 'primeng/button';
import {Divider} from 'primeng/divider';
import {InputText} from 'primeng/inputtext';
import {Textarea} from 'primeng/textarea';

@Component({
  selector: 'app-edit-ong',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Toast,
    ProgressSpinner,
    Card,
    PrimeTemplate,
    NgIf,
    FileUpload,
    Button,
    Divider,
    InputText,
    NgClass,
    Textarea,
  ],
  templateUrl: './ong-edit.component.html',
  styleUrls: ['./ong-edit.component.css']
})
export class EditOngComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ongService = inject(OngService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  editForm!: FormGroup;
  ongId: string = '';
  isLoading = true;
  isSubmitting = false;
  uploadedFile: File | null = null;
  logoPreview: string | null = null;
  currentLogoUrl: string | null = null;

  ngOnInit(): void {
    this.ongId = this.route.snapshot.params['id'];
    this.initForm();
    this.loadOngData();
  }

  private initForm(): void {
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
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

  private loadOngData(): void {
    this.ongService.getOngById(this.ongId).subscribe({
      next: (ong) => {
        this.editForm.patchValue({
          name: ong.name,
          description: ong.description,
          address: ong.address,
          phone: ong.phone,
          email: ong.email,
          website: ong.website || '',
          mission: ong.mission || '',
          vision: ong.vision || '',
          bankAccount: ong.bankAccount || '',
          bankName: ong.bankName || '',
          interbankAccount: ong.interbankAccount || ''
        });
        this.currentLogoUrl = ong.logoUrl || null;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading ONG data:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load ONG data'
        });
        this.isLoading = false;
      }
    });
  }

  onLogoSelect(event: any): void {
    const file = event.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid File',
        detail: 'Please upload an image file'
      });
      return;
    }

    this.uploadedFile = file;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.logoPreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  removeLogo(): void {
    this.uploadedFile = null;
    this.logoPreview = null;
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Form Error',
        detail: 'Please check the form for errors'
      });
      return;
    }

    this.isSubmitting = true;

    const formData = this.ongService.createOngFormData(
      this.editForm.value,
      this.uploadedFile || undefined
    );

    this.ongService.updateOng(this.ongId, formData).subscribe({
      next: (updatedOng) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Update Successful',
          detail: 'ONG profile has been updated successfully'
        });

        setTimeout(() => {
          this.router.navigate(['/hairy-paws/my-ong']);
        }, 1500);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error updating ONG:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Update Failed',
          detail: 'Failed to update ONG profile'
        });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/hairy-paws/my-ong']);
  }

  isInvalid(fieldName: string): boolean {
    const field = this.editForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.editForm.get(fieldName);

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
      if (fieldName === 'phone') {
        return 'Phone number must be 9 digits';
      }
      return 'Invalid format';
    }

    return 'Invalid value';
  }
}
