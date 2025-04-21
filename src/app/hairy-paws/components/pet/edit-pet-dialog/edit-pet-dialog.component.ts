import {Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {PetInterface} from '../../../interfaces/pet/pet-interface';
import {PetService} from '../../../services/pet/pet.service';
import {MessageService, PrimeTemplate} from 'primeng/api';
import {Button} from 'primeng/button';
import {Divider} from 'primeng/divider';
import {Dialog} from 'primeng/dialog';
import {NgIf} from '@angular/common';
import {InputText} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {InputNumber} from 'primeng/inputnumber';
import {DropdownModule} from 'primeng/dropdown';
import {Checkbox} from 'primeng/checkbox';

@Component({
  selector: 'app-edit-pet-dialog',
  imports: [
    Button,
    PrimeTemplate,
    Divider,
    Dialog,
    NgIf,
    InputText,
    FormsModule,
    InputNumber,
    DropdownModule,
    Checkbox
  ],
  templateUrl: './edit-pet-dialog.component.html',
  styleUrl: './edit-pet-dialog.component.css'
})
export class EditPetDialogComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Input() pet: PetInterface | null = null;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() petUpdated = new EventEmitter<PetInterface>();

  private myPetsService = inject(PetService);
  private messageService = inject(MessageService);

  editedPet: Partial<PetInterface> = {};
  isSaving: boolean = false;

  genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' }
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pet'] && this.pet) {
      this.editedPet = { ...this.pet };
    }
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  savePet(): void {
    if (!this.pet || !this.editedPet) {
      return;
    }

    this.isSaving = true;

    const petDataToUpdate = {
      name: this.editedPet.name,
      type: this.editedPet.type,
      breed: this.editedPet.breed,
      age: this.editedPet.age,
      gender: this.editedPet.gender,
      description: this.editedPet.description,
      weight: this.editedPet.weight,
      healthDetails: this.editedPet.healthDetails,
      vaccinated: this.editedPet.vaccinated,
      sterilized: this.editedPet.sterilized,
      availableForAdoption: this.editedPet.availableForAdoption
    };

    this.myPetsService.updateMyPet(this.pet.id, petDataToUpdate).subscribe({
      next: (updatedPet) => {
        this.isSaving = false;
        this.petUpdated.emit(updatedPet);
      },
      error: (error) => {
        this.isSaving = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to update pet'
        });
      }
    });
  }
}

