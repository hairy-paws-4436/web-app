import {Component, inject, OnInit} from '@angular/core';
import {PetInterface} from '../../interfaces/pet-interface';
import {PetService} from '../../services/pet.service';
import Swal from 'sweetalert2';
import {PetCardComponent} from '../../components/pet-card/pet-card.component';
import {NgForOf, NgIf} from '@angular/common';
import {ProgreessSpinnerComponent} from '../../../shared/components/progreess-spinner/progreess-spinner.component';
import {Paginator} from 'primeng/paginator';
import {MessageService} from 'primeng/api';
import {PetsDetailsDialogComponent} from '../../components/pets-details-dialog/pets-details-dialog.component';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-pets-page',
  imports: [
    PetCardComponent,
    NgIf,
    ProgreessSpinnerComponent,
    Paginator,
    NgForOf,
    PetsDetailsDialogComponent,
    Toast
  ],
  templateUrl: './pets-page.component.html',
  styleUrl: './pets-page.component.css'
})
export class PetsPageComponent implements OnInit {
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
    this.loadPets();
  }

  private loadPets(): void {
    this.petService.getPetsByTypeAndBreed(this.type, this.breed).subscribe({
      next: (pets) => {
        this.pets = pets;
        // Initialize the first page after loading data
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

