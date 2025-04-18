import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {DonationItem} from '../../interfaces/donation-interface';
import {ConfirmationService, MessageService} from 'primeng/api';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Toast} from 'primeng/toast';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {NgClass, NgIf} from '@angular/common';
import {InputText} from 'primeng/inputtext';
import {InputNumber} from 'primeng/inputnumber';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {TableModule} from 'primeng/table';
import {Tooltip} from 'primeng/tooltip';

@Component({
  selector: 'app-donation-items',
  imports: [
    Toast,
    ConfirmDialog,
    ReactiveFormsModule,
    NgClass,
    InputText,
    NgIf,
    InputNumber,
    ButtonDirective,
    Ripple,
    TableModule,
    Tooltip
  ],
  templateUrl: './donation-items.component.html',
  styleUrl: './donation-items.component.css'
})
export class DonationItemsComponent implements OnInit {
  @Output() itemsChange = new EventEmitter<DonationItem[]>();

  private fb = inject(FormBuilder);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  itemForm!: FormGroup;
  items: DonationItem[] = [];
  isEditing: boolean = false;
  editingIndex: number = -1;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.itemForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      description: ['']
    });
  }

  addOrUpdateItem(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const newItem: DonationItem = this.itemForm.value;

    if (this.isEditing && this.editingIndex !== -1) {
      // Update existing item
      this.items[this.editingIndex] = newItem;
      this.isEditing = false;
      this.editingIndex = -1;
      this.messageService.add({
        severity: 'success',
        summary: 'Item Updated',
        detail: `${newItem.name} has been updated`
      });
    } else {
      this.items.push(newItem);
      this.messageService.add({
        severity: 'success',
        summary: 'Item Added',
        detail: `${newItem.name} has been added to your donation`
      });
    }

    this.itemForm.reset({
      name: '',
      quantity: 1,
      description: ''
    });

    this.emitChanges();
  }

  editItem(index: number): void {
    const item = this.items[index];

    this.itemForm.patchValue({
      name: item.name,
      quantity: item.quantity,
      description: item.description || ''
    });

    this.isEditing = true;
    this.editingIndex = index;
  }

  removeItem(index: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this item?',
      header: 'Confirm Removal',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const removedItem = this.items.splice(index, 1)[0];

        this.messageService.add({
          severity: 'info',
          summary: 'Item Removed',
          detail: `${removedItem.name} has been removed from your donation`
        });

        this.emitChanges();

        if (this.isEditing && this.editingIndex === index) {
          this.cancelEdit();
        } else if (this.isEditing && this.editingIndex > index) {
          this.editingIndex--;
        }
      }
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editingIndex = -1;
    this.itemForm.reset({
      name: '',
      quantity: 1,
      description: ''
    });
  }

  isInvalid(fieldName: string): boolean {
    const field = this.itemForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.itemForm.get(fieldName);

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

  private emitChanges(): void {
    this.itemsChange.emit([...this.items]);
  }
}

