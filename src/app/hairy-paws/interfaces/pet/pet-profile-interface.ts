
export interface PetProfileInterface {
  // Características de comportamiento
  energyLevel: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
  socialLevel: 'shy' | 'reserved' | 'friendly' | 'very_social' | 'dominant';
  goodWithKids?: boolean;
  goodWithOtherPets?: boolean;
  goodWithStrangers?: boolean;

  // Entrenamiento
  trainingLevel: 'untrained' | 'basic' | 'intermediate' | 'advanced' | 'professional';
  houseTrained: boolean;
  leashTrained?: boolean;
  knownCommands?: string[];

  // Cuidados
  careLevel: 'low' | 'moderate' | 'high' | 'special_needs';
  exerciseNeeds: 'low' | 'moderate' | 'high' | 'very_high';
  groomingNeeds: 'low' | 'moderate' | 'high';

  // Salud y dieta
  specialDiet: boolean;
  dietDescription?: string;
  chronicConditions?: string[];
  medications?: string[];
  allergies?: string[];
  veterinaryNeeds?: string;

  // Comportamiento específico
  destructiveBehavior: boolean;
  separationAnxiety: boolean;
  noiseSensitivity: boolean;
  escapeTendency: boolean;

  // Preferencias de hogar
  idealHomeType?: 'apartment' | 'house_no_yard' | 'house_small_yard' | 'house_large_yard' | 'farm';
  spaceRequirements: 'small' | 'moderate' | 'large';
  climatePreferences?: string[];

  // Historia y notas
  rescueStory?: string;
  previousHomeExperience?: string;
  behavioralNotes?: string;

  // Compatibilidad
  beginnerFriendly: boolean;
  apartmentSuitable: boolean;
  familyFriendly: boolean;
}
