// components/pet/pet-profile-display/pet-profile-display.component.ts
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PetInterface} from '../../../interfaces/pet/pet-interface';
import {PetProfileInterface} from '../../../interfaces/pet/pet-profile-interface';
import {NgForOf, NgIf, TitleCasePipe} from '@angular/common';
import {Dialog} from 'primeng/dialog';
import {Card} from 'primeng/card';
import {Tag} from 'primeng/tag';
import {Button} from 'primeng/button';
import {Divider} from 'primeng/divider';
import {PrimeTemplate} from 'primeng/api';

@Component({
  selector: 'app-pet-profile-display',
  imports: [
    NgIf,
    Dialog,
    Card,
    Tag,
    Button,
    TitleCasePipe,
    PrimeTemplate,
    NgForOf
  ],
  templateUrl: './pet-profile-display.component.html',
  styleUrls: ['./pet-profile-display.component.css']
})
export class PetProfileDisplayComponent {
  @Input() visible: boolean = false;
  @Input() pet: PetInterface | null = null;
  @Input() profile: PetProfileInterface | null = null;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() editProfile = new EventEmitter<void>();

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  onEditProfile(): void {
    this.editProfile.emit();
  }

  // Helper methods para mostrar labels legibles
  getEnergyLevelLabel(level: string): string {
    const labels: {[key: string]: string} = {
      'very_low': 'Very Low',
      'low': 'Low',
      'moderate': 'Moderate',
      'high': 'High',
      'very_high': 'Very High'
    };
    return labels[level] || level;
  }

  getSocialLevelLabel(level: string): string {
    const labels: {[key: string]: string} = {
      'shy': 'Shy',
      'reserved': 'Reserved',
      'friendly': 'Friendly',
      'very_social': 'Very Social',
      'dominant': 'Dominant'
    };
    return labels[level] || level;
  }

  getTrainingLevelLabel(level: string): string {
    const labels: {[key: string]: string} = {
      'untrained': 'Untrained',
      'basic': 'Basic',
      'intermediate': 'Intermediate',
      'advanced': 'Advanced',
      'professional': 'Professional'
    };
    return labels[level] || level;
  }

  getCareLevelLabel(level: string): string {
    const labels: {[key: string]: string} = {
      'low': 'Low',
      'moderate': 'Moderate',
      'high': 'High',
      'special_needs': 'Special Needs'
    };
    return labels[level] || level;
  }

  getHomeTypeLabel(type: string): string {
    const labels: {[key: string]: string} = {
      'apartment': 'Apartment',
      'house_no_yard': 'House (No Yard)',
      'house_small_yard': 'House (Small Yard)',
      'house_large_yard': 'House (Large Yard)',
      'farm': 'Farm'
    };
    return labels[type] || type;
  }

  getBooleanTag(value: boolean | null | undefined): {severity: 'success' | 'danger' | 'secondary', label: string} {
    if (value === null || value === undefined) {
      return {severity: 'secondary', label: 'Unknown'};
    }
    return value ? {severity: 'success', label: 'Yes'} : {severity: 'danger', label: 'No'};
  }

  // Nuevos métodos con tipos específicos para severity
  getBehaviorSeverity(hasBehavior: boolean): 'success' | 'danger' {
    return hasBehavior ? 'danger' : 'success';
  }

  getNoiseSensitivitySeverity(hasSensitivity: boolean): 'success' | 'warn' {
    return hasSensitivity ? 'warn' : 'success';
  }
}
