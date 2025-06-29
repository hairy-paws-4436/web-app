// matching/matching-preferences-interface.ts
export interface MatchingPreferencesInterface {
  id?: string;
  userId?: string;

  // Basic pet preferences
  preferredAnimalTypes: string[];
  preferredGenders: string[];
  minAge?: number;
  maxAge?: number;
  minSize?: number;
  maxSize?: number;

  // Experience and knowledge
  experienceLevel: string;
  previousPetTypes?: string[];

  // Housing situation
  housingType: string;
  familyComposition: string;
  hasOtherPets: boolean;
  otherPetsDescription?: string;

  // Time and activity
  timeAvailability: string;
  preferredActivityLevel: string;
  workSchedule?: string;

  // Specific preferences
  prefersTrained: boolean;
  acceptsSpecialNeeds: boolean;
  prefersVaccinated: boolean;
  prefersSterilized: boolean;

  // Location and distance
  maxDistanceKm: number;
  latitude?: number;
  longitude?: number;

  // Budget
  monthlyBudget?: number;

  // Reasons and motivation
  adoptionReason?: string;
  lifestyleDescription?: string;

  // Metadata
  isComplete?: boolean;
  completionDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

// matching/animal-profile-interface.ts
export interface AnimalProfileInterface {
  id?: string;
  animalId: string;

  // Personality and behavior
  energyLevel: string;
  socialLevel: string;
  goodWithKids?: boolean;
  goodWithOtherPets?: boolean;
  goodWithStrangers?: boolean;

  // Training and skills
  trainingLevel: string;
  houseTrained: boolean;
  leashTrained?: boolean;
  knownCommands?: string[];

  // Care and needs
  careLevel: string;
  exerciseNeeds: string;
  groomingNeeds: string;
  specialDiet: boolean;
  dietDescription?: string;

  // Health and medical conditions
  chronicConditions?: string[];
  medications?: string[];
  allergies?: string[];
  veterinaryNeeds?: string;

  // Specific behaviors
  destructiveBehavior: boolean;
  separationAnxiety: boolean;
  noiseSensitivity: boolean;
  escapeTendency: boolean;

  // Environmental preferences
  idealHomeType?: string;
  spaceRequirements: string;
  climatePreferences?: string[];

  // History and background
  rescueStory?: string;
  previousHomeExperience?: string;
  behavioralNotes?: string;

  // Calculated compatibility
  beginnerFriendly: boolean;
  apartmentSuitable: boolean;
  familyFriendly: boolean;

  createdAt?: string;
  updatedAt?: string;
}

// matching/pet-recommendation-interface.ts
export interface PetRecommendationInterface {
  animal: {
    id: string;
    name: string;
    type: string;
    breed: string;
    age: number;
    gender: string;
    description: string;
    images: string[];
    weight: string;
    vaccinated: boolean;
    sterilized: boolean;
    healthDetails: string;
  };
  compatibility: {
    overall: number;
    personality: number;
    lifestyle: number;
    experience: number;
    practical: number;
  };
  score: number;
  matchReasons: string[];
  concerns: string[];
}

// matching/compatibility-analysis-interface.ts
export interface CompatibilityAnalysisInterface {
  overall_score: number;
  lifestyle_compatibility: number;
  experience_match: number;
  space_suitability: number;
  care_requirements: number;
  detailed_analysis: {
    strengths: string[];
    concerns: string[];
    recommendations: string[];
  };
  prediction: {
    success_probability: number;
    adaptation_timeline: string;
    support_needs: string[];
  };
}

export interface RecommendationsResponseInterface {
  needsOnboarding: boolean;
  totalMatches: number;
  recommendations: PetRecommendationInterface[];
}

export interface MatchingStatusInterface {
  hasCompletedPreferences: boolean;
  needsOnboarding: boolean;
}

// Enums that match your backend exactly
export enum AnimalType {
  DOG = 'dog',
  CAT = 'cat',
  BIRD = 'bird',
  RODENT = 'rodent',
  REPTILE = 'reptile',
  OTHER = 'other',
}

export enum AnimalGender {
  MALE = 'male',
  FEMALE = 'female'
}

export enum ExperienceLevel {
  FIRST_TIME = 'first_time',
  SOME_EXPERIENCE = 'some_experience',
  EXPERIENCED = 'experienced',
  EXPERT = 'expert',
}

export enum HousingType {
  APARTMENT = 'apartment',
  HOUSE_NO_YARD = 'house_no_yard',
  HOUSE_SMALL_YARD = 'house_small_yard',
  HOUSE_LARGE_YARD = 'house_large_yard',
  FARM = 'farm',
}

export enum ActivityLevel {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  VERY_HIGH = 'very_high',
}

export enum TimeAvailability {
  MINIMAL = 'minimal', // < 2 horas/día
  LIMITED = 'limited', // 2-4 horas/día
  MODERATE = 'moderate', // 4-6 horas/día
  EXTENSIVE = 'extensive', // > 6 horas/día
}

export enum FamilyComposition {
  SINGLE = 'single',
  COUPLE = 'couple',
  FAMILY_YOUNG_KIDS = 'family_young_kids', // < 5 años
  FAMILY_OLDER_KIDS = 'family_older_kids', // > 5 años
  ELDERLY = 'elderly',
}
