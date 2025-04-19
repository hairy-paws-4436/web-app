import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {PetInterface} from '../../interfaces/pet-interface';
import {NgIf} from '@angular/common';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {Tooltip} from 'primeng/tooltip';
import {PetService} from '../../services/pet.service';
import {MessageService} from 'primeng/api';
import Swal from 'sweetalert2';
import {AdoptionService} from '../../services/adoption.service';
import {AdoptionInterface} from '../../interfaces/adoption-interface';
import {PetVisitDialogComponent} from '../pet-visit-dialog/pet-visit-dialog.component';
import {PetAdoptionDialogComponent} from '../pet-adoption-dialog/pet-adoption-dialog.component';
import {AuthService} from '../../../auth/services/auth.service';

@Component({
  selector: 'app-pet-card',
  imports: [
    NgIf,
    ButtonDirective,
    Ripple,
    Tooltip,
    PetVisitDialogComponent,
    PetAdoptionDialogComponent
  ],
  templateUrl: './pet-card.component.html',
  styleUrl: './pet-card.component.css'
})
export class PetCardComponent {
  @Input() petCard: PetInterface | null = null;
  @Output() viewDetails = new EventEmitter<PetInterface>();

  private adoptionService: AdoptionService = inject(AdoptionService);
  private messageService: MessageService = inject(MessageService);
  private authService: AuthService = inject(AuthService);

  // Dialog visibility states
  showVisitDialog: boolean = false;
  showAdoptionDialog: boolean = false;

  /**
   * Emit event to show details dialog
   */
  showDetails(): void {
    if (this.petCard) {
      this.viewDetails.emit(this.petCard);
    }
  }

  get isAdopter (): boolean {
    return this.authService.isAdopter();
  }

  /**
   * Open the visit scheduling dialog
   */
  openVisitDialog(): void {
    if (!this.petCard) return;
    this.showVisitDialog = true;
  }

  /**
   * Open the adoption request dialog
   */
  openAdoptionDialog(): void {
    if (!this.petCard) return;
    this.showAdoptionDialog = true;
  }

  /**
   * Handle the visit request submission
   */
  handleVisitRequest(visitData: AdoptionInterface): void {
    this.submitRequest(visitData, 'visit');
  }

  /**
   * Handle the adoption request submission
   */
  handleAdoptionRequest(adoptionData: AdoptionInterface): void {
    this.submitRequest(adoptionData, 'adoption');
  }

  /**
   * Submit the request to the service
   */
  private submitRequest(requestData: AdoptionInterface, type: string): void {
    console.log(requestData);
    this.adoptionService.requestAdoptionOrVisit(requestData).subscribe({
      next: (response) => {
        // Close the dialogs
        this.showVisitDialog = false;
        this.showAdoptionDialog = false;

        // Show success message
        this.messageService.add({
          severity: 'success',
          summary: type === 'visit' ? 'Visit Scheduled' : 'Adoption Requested',
          detail: type === 'visit'
            ? `Your visit with ${this.petCard?.name} has been scheduled!`
            : `Your adoption request for ${this.petCard?.name} has been submitted!`
        });
      },
      error: () => {
        let errorMessage = 'An error occurred while processing your request.';

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage
        });
      }
    });
  }
}
