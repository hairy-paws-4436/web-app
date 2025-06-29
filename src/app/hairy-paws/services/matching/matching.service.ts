import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, catchError, throwError, map} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {returnHeaders} from '../../../shared/models/headers';
import {
  AnimalProfileInterface, CompatibilityAnalysisInterface,
  MatchingPreferencesInterface, PetRecommendationInterface,
  RecommendationsResponseInterface, MatchingStatusInterface,
  ExperienceLevel, HousingType, ActivityLevel, TimeAvailability, FamilyComposition
} from '../../interfaces/matching/matching-preferences-interface';

@Injectable({
  providedIn: 'root'
})
export class MatchingService {
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  // User Preferences
  createOrUpdatePreferences(preferences: MatchingPreferencesInterface): Observable<MatchingPreferencesInterface> {
    const url = `${this.baseUrl}/matching/preferences`;

    // Clean the data before sending - remove readonly fields and ensure flat structure
    const cleanData: any = {
      preferredAnimalTypes: preferences.preferredAnimalTypes,
      preferredGenders: preferences.preferredGenders,
      minAge: preferences.minAge,
      maxAge: preferences.maxAge,
      minSize: preferences.minSize,
      maxSize: preferences.maxSize,
      experienceLevel: preferences.experienceLevel,
      previousPetTypes: preferences.previousPetTypes,
      housingType: preferences.housingType,
      familyComposition: preferences.familyComposition,
      hasOtherPets: preferences.hasOtherPets,
      otherPetsDescription: preferences.otherPetsDescription,
      timeAvailability: preferences.timeAvailability,
      preferredActivityLevel: preferences.preferredActivityLevel,
      workSchedule: preferences.workSchedule,
      prefersTrained: preferences.prefersTrained,
      acceptsSpecialNeeds: preferences.acceptsSpecialNeeds,
      prefersVaccinated: preferences.prefersVaccinated,
      prefersSterilized: preferences.prefersSterilized,
      maxDistanceKm: preferences.maxDistanceKm,
      latitude: preferences.latitude,
      longitude: preferences.longitude,
      monthlyBudget: preferences.monthlyBudget,
      adoptionReason: preferences.adoptionReason,
      lifestyleDescription: preferences.lifestyleDescription
    };

    // Remove undefined values
    Object.keys(cleanData).forEach(key => {
      if (cleanData[key] === undefined || cleanData[key] === null) {
        delete cleanData[key];
      }
    });

    console.log('Sending data to backend:', cleanData); // Debug log

    return this.http.post<MatchingPreferencesInterface>(url, cleanData, {headers: returnHeaders()}).pipe(
      catchError(this.handleError)
    );
  }

  getUserPreferences(): Observable<MatchingPreferencesInterface> {
    const url = `${this.baseUrl}/matching/preferences`;
    return this.http.get<MatchingPreferencesInterface>(url, {headers: returnHeaders()}).pipe(
      catchError(this.handleError)
    );
  }

  getPreferencesStatus(): Observable<MatchingStatusInterface> {
    const url = `${this.baseUrl}/matching/preferences/status`;
    return this.http.get<MatchingStatusInterface>(url, {headers: returnHeaders()}).pipe(
      catchError(this.handleError)
    );
  }

  // Animal Profiles
  createAnimalProfile(animalId: string, profile: AnimalProfileInterface): Observable<AnimalProfileInterface> {
    const url = `${this.baseUrl}/matching/animals/${animalId}/profile`;
    return this.http.post<AnimalProfileInterface>(url, profile, {headers: returnHeaders()}).pipe(
      catchError(this.handleError)
    );
  }

  getAnimalProfile(animalId: string): Observable<AnimalProfileInterface> {
    const url = `${this.baseUrl}/matching/animals/${animalId}/profile`;
    return this.http.get<AnimalProfileInterface>(url, {headers: returnHeaders()}).pipe(
      catchError(this.handleError)
    );
  }

  // Recommendations
  getPersonalizedRecommendations(): Observable<PetRecommendationInterface[]> {
    const url = `${this.baseUrl}/matching/recommendations`;

    return this.http.get<RecommendationsResponseInterface>(url, {headers: returnHeaders()}).pipe(
      map((response) => {
        if (!response || !response.recommendations) {
          return [];
        }
        return response.recommendations;
      }),
      catchError(this.handleError)
    );
  }

  getCompatibilityAnalysis(animalId: string): Observable<CompatibilityAnalysisInterface> {
    const url = `${this.baseUrl}/matching/recommendations/${animalId}/compatibility`;
    return this.http.get<CompatibilityAnalysisInterface>(url, {headers: returnHeaders()}).pipe(
      catchError(this.handleError)
    );
  }

  // Helper methods that match your backend enums exactly
  getAnimalTypes(): { label: string; value: string }[] {
    return [
      { label: 'Dog', value: 'dog' },
      { label: 'Cat', value: 'cat' },
      { label: 'Bird', value: 'bird' },
      { label: 'Rodent', value: 'rodent' },
      { label: 'Reptile', value: 'reptile' },
      { label: 'Other', value: 'other' }
    ];
  }

  getGenderOptions(): { label: string; value: string }[] {
    return [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' }
    ];
  }

  getExperienceLevels(): { value: string; label: string }[] {
    return [
      { value: ExperienceLevel.FIRST_TIME, label: 'First-time owner' },
      { value: ExperienceLevel.SOME_EXPERIENCE, label: 'Some experience' },
      { value: ExperienceLevel.EXPERIENCED, label: 'Very experienced' },
      { value: ExperienceLevel.EXPERT, label: 'Expert/Professional' }
    ];
  }

  getHousingTypes(): { value: string; label: string }[] {
    return [
      { value: HousingType.APARTMENT, label: 'Apartment' },
      { value: HousingType.HOUSE_NO_YARD, label: 'House without yard' },
      { value: HousingType.HOUSE_SMALL_YARD, label: 'House with small yard' },
      { value: HousingType.HOUSE_LARGE_YARD, label: 'House with large yard' },
      { value: HousingType.FARM, label: 'Farm/Rural property' }
    ];
  }

  getFamilyCompositions(): { value: string; label: string }[] {
    return [
      { value: FamilyComposition.SINGLE, label: 'Single person' },
      { value: FamilyComposition.COUPLE, label: 'Couple' },
      { value: FamilyComposition.FAMILY_YOUNG_KIDS, label: 'Family with young children (< 5 years)' },
      { value: FamilyComposition.FAMILY_OLDER_KIDS, label: 'Family with older children (> 5 years)' },
      { value: FamilyComposition.ELDERLY, label: 'Elderly' }
    ];
  }

  getActivityLevels(): { value: string; label: string }[] {
    return [
      { value: ActivityLevel.LOW, label: 'Low - Calm and quiet' },
      { value: ActivityLevel.MODERATE, label: 'Moderate - Some activity' },
      { value: ActivityLevel.HIGH, label: 'High - Very active' },
      { value: ActivityLevel.VERY_HIGH, label: 'Very High - Extremely active' }
    ];
  }

  getTimeAvailabilityOptions(): { value: string; label: string }[] {
    return [
      { value: TimeAvailability.MINIMAL, label: 'Minimal (< 2 hours/day)' },
      { value: TimeAvailability.LIMITED, label: 'Limited (2-4 hours/day)' },
      { value: TimeAvailability.MODERATE, label: 'Moderate (4-6 hours/day)' },
      { value: TimeAvailability.EXTENSIVE, label: 'Extensive (> 6 hours/day)' }
    ];
  }

  getWorkScheduleOptions(): { value: string; label: string }[] {
    return [
      { value: 'morning', label: 'Morning shift' },
      { value: 'afternoon', label: 'Afternoon shift' },
      { value: 'night', label: 'Night shift' },
      { value: 'flexible', label: 'Flexible/Variable' },
      { value: 'remote', label: 'Work from home' }
    ];
  }

  // Energy levels for animal profiles
  getEnergyLevels(): { value: string; label: string }[] {
    return [
      { value: 'very_low', label: 'Very Low' },
      { value: 'low', label: 'Low' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'high', label: 'High' },
      { value: 'very_high', label: 'Very High' }
    ];
  }

  getSocialLevels(): { value: string; label: string }[] {
    return [
      { value: 'shy', label: 'Shy' },
      { value: 'reserved', label: 'Reserved' },
      { value: 'friendly', label: 'Friendly' },
      { value: 'very_social', label: 'Very Social' },
      { value: 'dominant', label: 'Dominant' }
    ];
  }

  getTrainingLevels(): { value: string; label: string }[] {
    return [
      { value: 'untrained', label: 'Untrained' },
      { value: 'basic', label: 'Basic' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' },
      { value: 'professional', label: 'Professional' }
    ];
  }

  getCareLevels(): { value: string; label: string }[] {
    return [
      { value: 'low', label: 'Low' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'high', label: 'High' },
      { value: 'special_needs', label: 'Special Needs' }
    ];
  }

  private handleError(error: any) {
    console.error('An error occurred in MatchingService', error);
    const errorMessage = error?.error?.message || error?.message || 'An unexpected error occurred';
    return throwError(() => errorMessage);
  }
}
