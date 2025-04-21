import {Component, inject, OnInit} from '@angular/core';
import {DonationInterface, DonationItem, DonationType} from '../../../interfaces/donation/donation-interface';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {DonationService} from '../../../services/donation/donation.service';
import {ActivatedRoute, Router} from '@angular/router';
import {OngService} from '../../../services/ong/ong.service';
import {OngInterface} from '../../../interfaces/ong/ong-interface';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {Toast} from 'primeng/toast';
import {Card} from 'primeng/card';
import {DropdownModule} from 'primeng/dropdown';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Divider} from 'primeng/divider';
import {RadioButton} from 'primeng/radiobutton';
import {InputNumber} from 'primeng/inputnumber';
import {InputText} from 'primeng/inputtext';

import {FileUpload} from 'primeng/fileupload';
import {DonationItemsComponent} from '../donation-items/donation-items.component';
import {InputTextarea} from 'primeng/inputtextarea';
import {Textarea} from 'primeng/textarea';

@Component({
  selector: 'app-donation-form',
  imports: [
    ButtonDirective,
    Ripple,
    Toast,
    Card,
    ReactiveFormsModule,
    DropdownModule,
    NgClass,
    Divider,
    RadioButton,
    NgIf,
    InputNumber,
    InputText,
    FileUpload,
    DonationItemsComponent,
    NgForOf,
    Textarea
  ],
  templateUrl: './donation-form.component.html',
  styleUrl: './donation-form.component.css'
})
export class DonationFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ongService = inject(OngService);
  private donationService = inject(DonationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);

  donationForm!: FormGroup;
  selectedOng: OngInterface | null = null;
  ongs: OngInterface[] = [];
  isLoading: boolean = false;
  isSubmitting: boolean = false;

  donationItems: DonationItem[] = [];

  donationTypes = [
    { label: 'Money Donation', value: DonationType.MONEY },
    { label: 'Items Donation', value: DonationType.ITEMS }
  ];

  ngOnInit(): void {
    this.loadOngs();
    this.initForm();
    this.checkQueryParams();
    this.donationForm.get('type')?.valueChanges.subscribe(type => {
      this.handleDonationTypeChange(type);
    });
  }

  private initForm(): void {
    this.donationForm = this.fb.group({
      ongId: ['', Validators.required],
      type: [DonationType.MONEY, Validators.required],
      amount: [null],
      transactionId: [''],
      notes: [''],
      receipt: [null]
    });
  }

  private checkQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      if (params['ongId']) {
        this.loadOngDetails(params['ongId']);
        this.donationForm.patchValue({ ongId: params['ongId'] });
      }
    });
  }

  private loadOngs(): void {
    this.isLoading = true;

    this.ongService.getAllOngs().subscribe({
      next: (ongs) => {
        this.ongs = ongs;
        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load NGOs'
        });
        this.isLoading = false;
      }
    });
  }

  private loadOngDetails(ongId: string): void {
    this.isLoading = true;

    this.ongService.getOngById(ongId).subscribe({
      next: (ong) => {
        this.selectedOng = ong;
        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load NGO details'
        });
        this.isLoading = false;
      }
    });
  }

  handleDonationTypeChange(type: DonationType): void {
    const amountControl = this.donationForm.get('amount');

    if (type === DonationType.MONEY) {
      amountControl?.setValidators([Validators.required, Validators.min(1)]);
    } else {
      amountControl?.clearValidators();
    }

    amountControl?.updateValueAndValidity();
  }

  onOngChange(ongId: string): void {
    if (ongId) {
      this.loadOngDetails(ongId);
    } else {
      this.selectedOng = null;
    }
  }

  onItemsUpdate(items: DonationItem[]): void {
    this.donationItems = items;
  }

  onSubmit(): void {
    if (this.donationForm.invalid) {
      this.donationForm.markAllAsTouched();

      if (this.donationForm.value.type === DonationType.ITEMS && this.donationItems.length === 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Form Error',
          detail: 'Please add at least one item to donate'
        });
        return;
      }

      this.messageService.add({
        severity: 'error',
        summary: 'Form Error',
        detail: 'Please check the form for errors'
      });
      return;
    }

    this.isSubmitting = true;

    const donationData: DonationInterface = {
      ...this.donationForm.value,
      items: this.donationForm.value.type === DonationType.ITEMS ? this.donationItems : undefined
    };

    this.donationService.createDonation(donationData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Donation Successful',
          detail: 'Thank you for your donation!'
        });

        setTimeout(() => {
          this.router.navigate(['/donations']);
        }, 1500);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Donation Failed',
          detail: error.message || 'Failed to process donation. Please try again later.'
        });
      }
    });
  }

  isInvalid(fieldName: string): boolean {
    const field = this.donationForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.donationForm.get(fieldName);

    if (!field || !field.errors) return '';

    if (field.errors['required']) {
      return 'This field is required';
    }

    if (field.errors['min']) {
      return `Minimum value is ${field.errors['min'].min}`;
    }

    return 'Invalid value';
  }
}
