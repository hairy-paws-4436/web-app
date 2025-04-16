import {Component, inject, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {Paginator} from "primeng/paginator";
import {PetCardComponent} from "../../components/pet-card/pet-card.component";
import {PetsDetailsDialogComponent} from "../../components/pets-details-dialog/pets-details-dialog.component";
import {ProgreessSpinnerComponent} from "../../../shared/components/progreess-spinner/progreess-spinner.component";
import {Toast} from "primeng/toast";
import {PetService} from '../../services/pet.service';
import {MessageService} from 'primeng/api';
import {PetInterface} from '../../interfaces/pet-interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-pets-page',
    imports: [
        NgForOf,
        NgIf,
        Paginator,
        PetCardComponent,
        PetsDetailsDialogComponent,
        ProgreessSpinnerComponent,
        Toast
    ],
  templateUrl: './my-pets-page.component.html',
  styleUrl: './my-pets-page.component.css'
})
export class MyPetsPageComponent implements OnInit {
  private petService: PetService = inject(PetService);
  private messageService: MessageService = inject(MessageService);

  pets: PetInterface[] = [];
  paginatedPets: PetInterface[] = [];
  type: string = 'dog';
  breed: string = 'Labrador';
  isLoading: boolean = true;

  // Pet details dialog
  displayPetDetails: boolean = false;
  selectedPet: PetInterface | null = null;

  ngOnInit() {
    this.myPets();
  }

  private myPets(): void {
    this.petService.myPets().subscribe({
      next: (pets) => {
        this.pets = pets;
        this.updatePaginatedPets(0);
        this.isLoading = false;
      },
      error: (message) => {
        Swal.fire('Error loading pets', message, 'error');
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: any) {
    this.updatePaginatedPets(event.first);
  }

  private updatePaginatedPets(startIndex: number): void {
    const endIndex = startIndex + 8;
    this.paginatedPets = this.pets.slice(startIndex, endIndex);
  }

  // Show pet details dialog
  showPetDetails(pet: PetInterface): void {
    this.selectedPet = pet;
    this.displayPetDetails = true;
  }

  // Handle adoption request
  handleAdoptionRequest(pet: PetInterface): void {
    this.displayPetDetails = false;

    this.messageService.add({
      severity: 'success',
      summary: 'Adoption Process Started',
      detail: `You've started the adoption process for ${pet.name}!`
    });

    // Additional adoption logic would go here
  }
}

