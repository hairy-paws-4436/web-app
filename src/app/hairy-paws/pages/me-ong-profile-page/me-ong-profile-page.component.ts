import {Component, inject, OnInit} from '@angular/core';
import {OngService} from '../../services/ong.service';

import {MessageService, PrimeTemplate} from 'primeng/api';
import {Router} from '@angular/router';
import {OngInterface} from '../../interfaces/ong-interface';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {ReactiveFormsModule} from '@angular/forms';
import {Divider} from 'primeng/divider';
import {Textarea} from 'primeng/textarea';
import {NgClass, NgIf} from '@angular/common';
import {FileUpload} from 'primeng/fileupload';
import {Card} from 'primeng/card';
import {ProgressSpinner} from 'primeng/progressspinner';
import {Toast} from 'primeng/toast';
import {Dialog} from 'primeng/dialog';
import {Tag} from 'primeng/tag';
import {AuthService} from '../../../auth/services/auth.service';

@Component({
  selector: 'app-me-ong-profile-page',
  imports: [
    Button,

    ReactiveFormsModule,
    Divider,

    NgIf,
    FileUpload,
    Card,
    ProgressSpinner,
    Toast,
    PrimeTemplate,
    Dialog,
  ],
  templateUrl: './me-ong-profile-page.component.html',
  styleUrl: './me-ong-profile-page.component.css'
})
export class MeOngProfilePageComponent implements OnInit {
  private ongService = inject(OngService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  ong: OngInterface | null = null;
  isLoading = true;
  showLogoDialog = false;
  uploadedFile: File | null = null;
  logoPreview: string | null = null;
  isOwner = true; // Changed to default true for the current user's ONG profile

  ngOnInit(): void {
    this.loadMyOng();
  }

  loadMyOng(): void {
    this.isLoading = true;
    this.ongService.getMyOng().subscribe({
      next: (data) => {
        this.ong = data;
        this.isLoading = false;
        // For the current user's ONG profile, they are always the owner
        this.isOwner = true;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading ONG:', error);

        if (error.status === 404) {
          this.messageService.add({
            severity: 'info',
            summary: 'No ONG registered',
            detail: 'You have not registered an ONG yet. Would you like to register one?'
          });
          setTimeout(() => {
            this.router.navigate(['/hairy-paws/register-ong']);
          }, 2000);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load ONG profile'
          });
        }
      }
    });
  }

  showLogoUploadDialog(): void {
    if (!this.isOwner) {
      this.messageService.add({
        severity: 'error',
        summary: 'Unauthorized',
        detail: 'You are not authorized to change the logo'
      });
      return;
    }
    this.showLogoDialog = true;
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

  updateLogo(): void {
    if (!this.uploadedFile || !this.ong || !this.isOwner) return;

    // Create FormData with only the logo
    const formData = this.ongService.createOngFormData({}, this.uploadedFile);

    this.ongService.updateOng(this.ong.id, formData).subscribe({
      next: (updatedOng) => {
        this.ong = updatedOng;
        this.showLogoDialog = false;
        this.uploadedFile = null;
        this.logoPreview = null;

        this.messageService.add({
          severity: 'success',
          summary: 'Logo Updated',
          detail: 'Your ONG logo has been updated successfully'
        });
      },
      error: (error) => {
        console.error('Error updating logo:', error);

        if (error.status === 403) {
          this.messageService.add({
            severity: 'error',
            summary: 'Unauthorized',
            detail: 'You are not authorized to update this logo'
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update logo'
          });
        }
      }
    });
  }

  navigateToEdit(): void {
    if (!this.ong) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No ONG data available'
      });
      return;
    }

    // Navigate using 'me' as the ID instead of the actual ONG ID
    // This way, the route will work with the ONG owner's token
    this.router.navigate(['/hairy-paws/ong-edit/me']);
  }

  navigateToPets(): void {
    this.router.navigate(['/hairy-paws/ong-pets']);
  }

  navigateToApplications(): void {
    this.router.navigate(['/hairy-paws/ong-applications']);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' {
    switch (status) {
      case 'available':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'suspended':
        return 'danger';
      default:
        return 'info';
    }
  }
}
