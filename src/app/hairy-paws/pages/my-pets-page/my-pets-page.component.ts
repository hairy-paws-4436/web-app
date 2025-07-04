import {Component, inject, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";

import {ProgreessSpinnerComponent} from "../../../shared/components/progreess-spinner/progreess-spinner.component";
import {Toast} from "primeng/toast";
import {PetService} from '../../services/pet/pet.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {PetInterface} from '../../interfaces/pet/pet-interface';
import {PetProfileInterface} from '../../interfaces/pet/pet-profile-interface';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {ButtonDirective} from 'primeng/button';
import {MyPetCardComponent} from '../../components/pet/my-pet-card/my-pet-card.component';
import {EditPetDialogComponent} from '../../components/pet/edit-pet-dialog/edit-pet-dialog.component';
import {PetProfileFormComponent} from '../../components/pet/pet-profile-form/pet-profile-form.component';
import {PetProfileDisplayComponent} from '../../components/pet/pet-profile-display/pet-profile-display.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-my-pets-page',
  imports: [
    NgForOf,
    NgIf,
    ProgreessSpinnerComponent,
    Toast,
    ConfirmDialog,
    ButtonDirective,
    MyPetCardComponent,
    EditPetDialogComponent,
    PetProfileFormComponent,
    PetProfileDisplayComponent,
    RouterLink,
  ],
  templateUrl: './my-pets-page.component.html',
  styleUrl: './my-pets-page.component.css'
})
export class MyPetsPageComponent implements OnInit {
  private myPetsService = inject(PetService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  myPets: PetInterface[] = [];
  isLoading: boolean = true;
  displayEditDialog: boolean = false;
  displayProfileDialog: boolean = false;
  displayViewProfileDialog: boolean = false;
  selectedPet: PetInterface | null = null;
  selectedProfile: PetProfileInterface | null = null;

  ngOnInit(): void {
    this.loadMyPets();
  }

  loadMyPets(): void {
    this.isLoading = true;

    this.myPetsService.getMyPets().subscribe({
      next: (pets) => {
        this.myPets = pets;
        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load your pets'
        });
        this.isLoading = false;
      }
    });
  }

  openEditDialog(pet: PetInterface): void {
    this.selectedPet = pet;
    this.displayEditDialog = true;
  }

  openProfileDialog(pet: PetInterface): void {
    this.selectedPet = pet;
    this.displayProfileDialog = true;
  }

  openViewProfileDialog(pet: PetInterface): void {
    this.selectedPet = pet;
    this.loadPetProfile(pet.id);
  }

  openProfileDialogFromView(): void {
    this.displayViewProfileDialog = false;
    this.displayProfileDialog = true;
  }

  private loadPetProfile(petId: string): void {
    this.myPetsService.getPetProfile(petId).subscribe({
      next: (profile) => {
        this.selectedProfile = profile;
        this.displayViewProfileDialog = true;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'warn',
          summary: 'No Profile Found',
          detail: 'This pet doesn\'t have a detailed profile yet. Create one now!'
        });
        // Abrir el formulario de creación si no existe perfil
        this.displayProfileDialog = true;
      }
    });
  }

  handlePetUpdate(updatedPet: PetInterface): void {
    const index = this.myPets.findIndex(p => p.id === updatedPet.id);
    if (index !== -1) {
      this.myPets[index] = updatedPet;
    }

    this.displayEditDialog = false;

    this.messageService.add({
      severity: 'success',
      summary: 'Pet Updated',
      detail: `${updatedPet.name}'s information has been updated successfully`
    });
  }

  handleProfileCreated(profile: PetProfileInterface): void {
    this.displayProfileDialog = false;
    this.selectedProfile = profile;

    this.messageService.add({
      severity: 'success',
      summary: 'Profile Created',
      detail: `Detailed profile for ${this.selectedPet?.name} has been created successfully`
    });
  }

  confirmDeletePet(pet: PetInterface): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${pet.name}? This action cannot be undone.`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deletePet(pet);
      }
    });
  }

  private deletePet(pet: PetInterface): void {
    this.myPetsService.deleteMyPet(pet.id).subscribe({
      next: () => {
        this.myPets = this.myPets.filter(p => p.id !== pet.id);

        this.messageService.add({
          severity: 'success',
          summary: 'Pet Deleted',
          detail: `${pet.name} has been removed from your pets`
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to delete pet'
        });
      }
    });
  }
}
