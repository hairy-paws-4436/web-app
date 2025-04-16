import {Component, EventEmitter, Input, Output} from '@angular/core';
import { PetInterface } from '../../interfaces/pet-interface';
import {AdoptionInterface} from '../../interfaces/adoption-interface';
import {Dialog} from 'primeng/dialog';
import {NgIf} from '@angular/common';
import {Calendar} from 'primeng/calendar';
import {FormsModule} from '@angular/forms';
import {PrimeTemplate} from 'primeng/api';
import {Button} from 'primeng/button';

// @ts-ignore
@Component({
  selector: 'app-pet-visit-dialog',
  imports: [
    Dialog,
    NgIf,
    Calendar,
    FormsModule,
    PrimeTemplate,
    Button
  ],
  templateUrl: './pet-visit-dialog.component.html',
  styleUrl: './pet-visit-dialog.component.css'
})
export class PetVisitDialogComponent {
  @Input() visible: boolean = false;
  @Input() pet: PetInterface | null = null;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() visitRequested = new EventEmitter<AdoptionInterface>();

  visitDate: Date = new Date();
  notes: string = '';

  minDate: Date = new Date();

  closeDialog(): void {
    this.resetForm();
    this.visible = false;
    this.visibleChange.emit(false);
  }

  submitVisitRequest(): void {
    if (!this.pet || !this.visitDate) {
      return;
    }

    const visitRequest: AdoptionInterface = {
      animalId: this.pet.id,
      type: 'visit',
      visitDate: this.visitDate,
      notes: this.notes
    };

    this.visitRequested.emit(visitRequest);
    this.resetForm();
  }

  private resetForm(): void {
    this.visitDate = new Date();
    this.notes = '';
  }
}
