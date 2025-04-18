import {Component, EventEmitter, Input, Output} from '@angular/core';
import { PetInterface } from '../../interfaces/pet-interface';
import {AdoptionInterface} from '../../interfaces/adoption-interface';
import {MenuItem, PrimeTemplate} from 'primeng/api';
import {FormsModule} from '@angular/forms';
import {Calendar} from 'primeng/calendar';
import {Dialog} from 'primeng/dialog';
import {Steps} from 'primeng/steps';
import {DatePipe, NgIf} from '@angular/common';
import {Button} from 'primeng/button';
import {DatePicker} from 'primeng/datepicker';

@Component({
  selector: 'app-pet-adoption-dialog',
  imports: [
    FormsModule,
    Dialog,
    Steps,
    NgIf,
    PrimeTemplate,
    Button,
  ],
  templateUrl: './pet-adoption-dialog.component.html',
  styleUrl: './pet-adoption-dialog.component.css'
})
export class PetAdoptionDialogComponent {
  @Input() visible: boolean = false;
  @Input() pet: PetInterface | null = null;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() adoptionRequested = new EventEmitter<AdoptionInterface>();

  visitDate: Date = new Date();
  notes: string = '';
  activeIndex: number = 0;

  minDate: Date = new Date();
  steps: MenuItem[] = [
    {
      label: 'Confirm Interest',
      command: () => this.activeIndex = 0
    },
    {
      label: 'Submit Request',
      command: () => this.activeIndex = 1
    }
  ];

  closeDialog(): void {
    this.resetForm();
    this.visible = false;
    this.visibleChange.emit(false);
  }

  submitAdoptionRequest(): void {
    if (!this.pet || !this.visitDate) {
      return;
    }

    const adoptionRequest: AdoptionInterface = {
      animalId: this.pet.id,
      type: 'adoption',
      visitDate: this.visitDate,
      notes: this.notes
    };

    this.adoptionRequested.emit(adoptionRequest);
    this.resetForm();
  }

  nextStep(): void {
    this.activeIndex = Math.min(this.activeIndex + 1, this.steps.length - 1);
  }

  prevStep(): void {
    this.activeIndex = Math.max(this.activeIndex - 1, 0);
  }

  private resetForm(): void {
    this.visitDate = new Date();
    this.notes = '';
    this.activeIndex = 0;
  }
}
