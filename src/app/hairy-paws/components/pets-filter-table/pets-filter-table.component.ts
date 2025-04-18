import {Component, inject, OnInit, ViewChild} from '@angular/core';
import { PetService } from '../../services/pet.service';
import {MessageService, PrimeTemplate} from 'primeng/api';
import {PetInterface} from '../../interfaces/pet-interface';
import Swal from 'sweetalert2';
import {Tag} from 'primeng/tag';
import {Button, ButtonDirective} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {Table, TableModule} from 'primeng/table';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Toast} from 'primeng/toast';
import {Dialog} from 'primeng/dialog';
import {NgIf, TitleCasePipe} from '@angular/common';
import {Ripple} from 'primeng/ripple';
import {Tooltip} from 'primeng/tooltip';
import {PetsDetailsDialogComponent} from '../pets-details-dialog/pets-details-dialog.component';
import {AdoptionInterface} from '../../interfaces/adoption-interface';
import {AdoptionService} from '../../services/adoption.service';
import {PetVisitDialogComponent} from '../pet-visit-dialog/pet-visit-dialog.component';
import {PetAdoptionDialogComponent} from '../pet-adoption-dialog/pet-adoption-dialog.component';
import {AuthService} from '../../../auth/services/auth.service';

interface AvailabilityOption {
  label: string;
  value: boolean | null;
}

@Component({
  selector: 'app-pets-filter-table',
  imports: [
    Tag,
    PrimeTemplate,
    DropdownModule,
    TableModule,
    FormsModule,
    InputText,
    Toast,
    NgIf,
    ButtonDirective,
    Ripple,
    Tooltip,
    PetsDetailsDialogComponent,
    PetVisitDialogComponent,
    PetAdoptionDialogComponent
  ],
  templateUrl: './pets-filter-table.component.html',
  styleUrl: './pets-filter-table.component.css'
})
export class PetsFilterTableComponent implements OnInit {
  @ViewChild('dt') table!: Table;

  private petService: PetService = inject(PetService);
  private adoptionService: AdoptionService = inject(AdoptionService);
  private messageService: MessageService = inject(MessageService);
  private authService: AuthService = inject(AuthService);

  pets: PetInterface[] = [];
  selectedPets: PetInterface[] = [];
  isLoading: boolean = true;

  availabilityOptions: AvailabilityOption[] = [
    { label: 'Any', value: null },
    { label: 'Available', value: true },
    { label: 'Not Available', value: false }
  ];


  displayPetDetails: boolean = false;
  displayVisitDialog: boolean = false;
  displayAdoptionDialog: boolean = false;
  selectedPet: PetInterface | null = null;

  ngOnInit() {
    this.loadPets();
  }
  private loadPets(): void {
    // You can modify this to fetch all pets, not just Labradors
    this.petService.getPetsByTypeAndBreed('dog', 'Labrador').subscribe({
      next: (pets) => {
        this.pets = pets;
        this.isLoading = false;
      },
      error: (message) => {
        Swal.fire('Error loading pets', message, 'error');
        this.isLoading = false;
      }
    });
  }

  get isAdopter (): boolean {
    return this.authService.isAdopter();
  }

  // Show pet details
  showDetails(pet: PetInterface): void {
    this.selectedPet = pet;
    this.displayPetDetails = true;
  }

  // Request a visit
  requestVisit(pet: PetInterface): void {
    this.selectedPet = pet;
    this.displayVisitDialog = true;
  }

  // Request adoption
  requestAdoption(pet: PetInterface): void {
    this.selectedPet = pet;
    this.displayAdoptionDialog = true;
  }

  // Handle visit request from dialog
  handleVisitRequest(visitData: AdoptionInterface): void {
    this.submitRequest(visitData, 'visit');
  }

  // Handle adoption request from dialog
  handleAdoptionRequest(adoptionData: AdoptionInterface): void {
    this.submitRequest(adoptionData, 'adoption');
  }

  // Submit the request to the API
  private submitRequest(requestData: AdoptionInterface, type: string): void {
    this.adoptionService.requestAdoptionOrVisit(requestData).subscribe({
      next: (response) => {
        // Close dialogs
        this.displayVisitDialog = false;
        this.displayAdoptionDialog = false;

        // Show success message
        this.messageService.add({
          severity: 'success',
          summary: type === 'visit' ? 'Visit Scheduled' : 'Adoption Requested',
          detail: type === 'visit'
            ? `Your visit with ${this.selectedPet?.name} has been scheduled!`
            : `Your adoption request for ${this.selectedPet?.name} has been submitted!`
        });
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: error.message || 'An error occurred while processing your request.',
          icon: 'error'
        });
      }
    });
  }

  // Handle pet adoption from details dialog
  handleAdoptionFromDetails(pet: PetInterface): void {
    this.displayPetDetails = false;

    this.messageService.add({
      severity: 'success',
      summary: 'Adoption Process Started',
      detail: `You've started the adoption process for ${pet.name}!`
    });
  }

  // Clear all filters
  clearFilters(): void {
    this.table.clear();
    this.messageService.add({
      severity: 'info',
      summary: 'Filters Cleared',
      detail: 'All filters have been cleared'
    });
  }

}

