import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {PetInterface} from '../../../interfaces/pet/pet-interface';
import {NgIf} from '@angular/common';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {Tooltip} from 'primeng/tooltip';
import {MessageService} from 'primeng/api';
import {AdoptionService} from '../../../services/adoption/adoption.service';
import {AdoptionInterface} from '../../../interfaces/adoption/adoption-interface';
import {PetVisitDialogComponent} from '../pet-visit-dialog/pet-visit-dialog.component';
import {PetAdoptionDialogComponent} from '../pet-adoption-dialog/pet-adoption-dialog.component';
import {AuthService} from '../../../../auth/services/auth.service';

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

  showVisitDialog: boolean = false;
  showAdoptionDialog: boolean = false;

  showDetails(): void {
    if (this.petCard) {
      this.viewDetails.emit(this.petCard);
    }
  }

  get isAdopter (): boolean {
    return this.authService.isAdopter();
  }

  openVisitDialog(): void {
    if (!this.petCard) return;
    this.showVisitDialog = true;
  }

  openAdoptionDialog(): void {
    if (!this.petCard) return;
    this.showAdoptionDialog = true;
  }

  handleVisitRequest(visitData: AdoptionInterface): void {
    this.submitRequest(visitData, 'visit');
  }

  handleAdoptionRequest(adoptionData: AdoptionInterface): void {
    this.submitRequest(adoptionData, 'adoption');
  }

  private submitRequest(requestData: AdoptionInterface, type: string): void {
    console.log(requestData);
    this.adoptionService.requestAdoptionOrVisit(requestData).subscribe({
      next: () => {
        this.showVisitDialog = false;
        this.showAdoptionDialog = false;

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
