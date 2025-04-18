import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PetInterface} from '../../interfaces/pet-interface';
import {NgClass, NgIf, TitleCasePipe} from '@angular/common';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {Tooltip} from 'primeng/tooltip';
import {Tag} from 'primeng/tag';

@Component({
  selector: 'app-my-pet-card',
  imports: [
    NgClass,
    NgIf,
    ButtonDirective,
    Ripple,
    Tooltip,
    TitleCasePipe,
    Tag
  ],
  templateUrl: './my-pet-card.component.html',
  styleUrl: './my-pet-card.component.css'
})
export class MyPetCardComponent {
  @Input() pet!: PetInterface;

  @Output() editPet = new EventEmitter<PetInterface>();
  @Output() deletePet = new EventEmitter<PetInterface>();

  /**
   * Emit edit event for the current pet
   */
  onEdit(): void {
    this.editPet.emit(this.pet);
  }

  /**
   * Emit delete event for the current pet
   */
  onDelete(): void {
    this.deletePet.emit(this.pet);
  }

  /**
   * Get formatted gender text
   */
  getGender(): string {
    return this.pet.gender === 'male' ? 'Male' : 'Female';
  }

  /**
   * Get severity class for adoption status
   */
  getAdoptionStatusSeverity(): string {
    return this.pet.availableForAdoption ? 'success' : 'danger';
  }

  /**
   * Get text for adoption status
   */
  getAdoptionStatusText(): string {
    return this.pet.availableForAdoption ? 'Available for adoption' : 'Not available';
  }
}
