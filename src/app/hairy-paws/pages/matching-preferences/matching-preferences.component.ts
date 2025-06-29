import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { SliderModule } from 'primeng/slider';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { StepsModule } from 'primeng/steps';
import { TabViewModule } from 'primeng/tabview';
import { DividerModule } from 'primeng/divider';
import { Ripple } from 'primeng/ripple';

import { MatchingService } from '../../services/matching/matching.service';
import { MatchingPreferencesInterface } from '../../interfaces/matching/matching-preferences-interface';

@Component({
  selector: 'app-matching-preferences-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    MultiSelectModule,
    CheckboxModule,
    SliderModule,
    TextareaModule,
    ToastModule,
    ProgressSpinnerModule,
    StepsModule,
    TabViewModule,
    DividerModule,
    Ripple
  ],
  providers: [MessageService],
  templateUrl: './matching-preferences.component.html',
  styleUrl: './matching-preferences.component.css'
})
export class MatchingPreferencesPageComponent implements OnInit {
  private matchingService = inject(MatchingService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  activeIndex = 0;
  isLoading = false;

  steps = [
    { label: 'Pet Preferences' },
    { label: 'Living Situation' },
    { label: 'Lifestyle' },
    { label: 'Final Details' }
  ];

  preferences: MatchingPreferencesInterface = {
    preferredAnimalTypes: [],
    preferredGenders: [],
    minAge: 0,
    maxAge: 15,
    minSize: 0,
    maxSize: 50,
    experienceLevel: '',
    previousPetTypes: [],
    housingType: '',
    familyComposition: '',
    hasOtherPets: false,
    otherPetsDescription: '',
    timeAvailability: '',
    preferredActivityLevel: '',
    workSchedule: '',
    prefersTrained: false,
    acceptsSpecialNeeds: false,
    prefersVaccinated: true,
    prefersSterilized: true,
    maxDistanceKm: 50,
    latitude: -12.0464, // Lima, Peru default
    longitude: -77.0428,
    monthlyBudget: 300, // Changed to match your backend range (50-2000)
    adoptionReason: '',
    lifestyleDescription: ''
  };

  // Options for dropdowns using service methods
  animalTypeOptions = this.matchingService.getAnimalTypes();
  genderOptions = this.matchingService.getGenderOptions();
  experienceLevelOptions = this.matchingService.getExperienceLevels();
  housingTypeOptions = this.matchingService.getHousingTypes();
  familyCompositionOptions = this.matchingService.getFamilyCompositions();
  activityLevelOptions = this.matchingService.getActivityLevels();
  timeAvailabilityOptions = this.matchingService.getTimeAvailabilityOptions();
  workScheduleOptions = this.matchingService.getWorkScheduleOptions();

  ngOnInit(): void {
    this.loadExistingPreferences();
  }

  loadExistingPreferences(): void {
    this.matchingService.getUserPreferences().subscribe({
      next: (preferences) => {
        // Merge with existing preferences to ensure all arrays are initialized
        this.preferences = {
          ...this.preferences,
          ...preferences,
          preferredAnimalTypes: preferences.preferredAnimalTypes || [],
          preferredGenders: preferences.preferredGenders || [],
          previousPetTypes: preferences.previousPetTypes || []
        };

        this.messageService.add({
          severity: 'info',
          summary: 'Preferences Loaded',
          detail: 'Your existing preferences have been loaded'
        });
      },
      error: (error) => {
        // User might not have preferences yet, that's okay
        console.log('No existing preferences found');
      }
    });
  }

  nextStep(): void {
    if (this.isStepValid()) {
      this.activeIndex++;
    }
  }

  previousStep(): void {
    this.activeIndex--;
  }

  isStepValid(): boolean {
    switch (this.activeIndex) {
      case 0:
        return this.preferences.preferredAnimalTypes && this.preferences.preferredAnimalTypes.length > 0;
      case 1:
        return !!(this.preferences.experienceLevel &&
          this.preferences.housingType &&
          this.preferences.familyComposition);
      case 2:
        return !!(this.preferences.timeAvailability &&
          this.preferences.preferredActivityLevel);
      case 3:
        return !!(this.preferences.adoptionReason && this.preferences.adoptionReason.trim() !== '');
      default:
        return true;
    }
  }

  savePreferences(): void {
    if (!this.isStepValid()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Incomplete Information',
        detail: 'Please fill in all required fields'
      });
      return;
    }

    // Validate required fields explicitly
    if (!this.preferences.preferredAnimalTypes || this.preferences.preferredAnimalTypes.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please select at least one preferred animal type'
      });
      return;
    }

    if (!this.preferences.experienceLevel || !this.preferences.housingType || !this.preferences.familyComposition) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please complete all required fields'
      });
      return;
    }

    if (!this.preferences.timeAvailability || !this.preferences.preferredActivityLevel) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please complete time availability and activity level'
      });
      return;
    }

    this.isLoading = true;

    console.log('Preferences before sending:', this.preferences); // Debug log

    this.matchingService.createOrUpdatePreferences(this.preferences).subscribe({
      next: (savedPreferences) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Preferences Saved',
          detail: 'Your matching preferences have been saved successfully!'
        });

        setTimeout(() => {
          this.router.navigate(['/hairy-paws/smart-matching/recommendations']);
        }, 2000);

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error saving preferences:', error); // Debug log
        this.messageService.add({
          severity: 'error',
          summary: 'Save Failed',
          detail: error || 'Failed to save your preferences'
        });
        this.isLoading = false;
      }
    });
  }
}
