import {Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {PetInterface} from '../../../interfaces/pet/pet-interface';
import {PetProfileInterface} from '../../../interfaces/pet/pet-profile-interface';
import {PetService} from '../../../services/pet/pet.service';
import {MessageService, PrimeTemplate} from 'primeng/api';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Card} from 'primeng/card';
import {Dialog} from 'primeng/dialog';
import {Divider} from 'primeng/divider';
import {DropdownModule} from 'primeng/dropdown';
import {InputText} from 'primeng/inputtext';
import {Textarea} from 'primeng/textarea';
import {Checkbox} from 'primeng/checkbox';
import {MultiSelectModule} from 'primeng/multiselect';
import {Button} from 'primeng/button';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-pet-profile-form',
  imports: [
    ReactiveFormsModule,
    NgIf,
    Card,
    Dialog,
    DropdownModule,
    InputText,
    Checkbox,
    MultiSelectModule,
    Button,
    Toast,
    PrimeTemplate
  ],
  templateUrl: './pet-profile-form.component.html',
  styleUrls: ['./pet-profile-form.component.css']
})
export class PetProfileFormComponent implements OnInit, OnChanges {
  @Input() pet: PetInterface | null = null;
  @Input() visible: boolean = false;
  @Output() profileCreated = new EventEmitter<PetProfileInterface>();
  @Output() visibleChange = new EventEmitter<boolean>();

  private fb = inject(FormBuilder);
  private petService = inject(PetService);
  private messageService = inject(MessageService);

  profileForm!: FormGroup;
  isSubmitting: boolean = false;

  // Opciones para dropdowns actualizadas según el backend
  energyLevelOptions = [
    { label: 'Very Low', value: 'very_low' },
    { label: 'Low', value: 'low' },
    { label: 'Moderate', value: 'moderate' },
    { label: 'High', value: 'high' },
    { label: 'Very High', value: 'very_high' }
  ];

  socialLevelOptions = [
    { label: 'Shy', value: 'shy' },
    { label: 'Reserved', value: 'reserved' },
    { label: 'Friendly', value: 'friendly' },
    { label: 'Very Social', value: 'very_social' },
    { label: 'Dominant', value: 'dominant' }
  ];

  trainingLevelOptions = [
    { label: 'Untrained', value: 'untrained' },
    { label: 'Basic', value: 'basic' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' },
    { label: 'Professional', value: 'professional' }
  ];

  careLevelOptions = [
    { label: 'Low', value: 'low' },
    { label: 'Moderate', value: 'moderate' },
    { label: 'High', value: 'high' },
    { label: 'Special Needs', value: 'special_needs' }
  ];

  exerciseNeedsOptions = [
    { label: 'Low', value: 'low' },
    { label: 'Moderate', value: 'moderate' },
    { label: 'High', value: 'high' },
    { label: 'Very High', value: 'very_high' }
  ];

  groomingNeedsOptions = [
    { label: 'Low', value: 'low' },
    { label: 'Moderate', value: 'moderate' },
    { label: 'High', value: 'high' }
  ];

  homeTypeOptions = [
    { label: 'Apartment', value: 'apartment' },
    { label: 'House (No Yard)', value: 'house_no_yard' },
    { label: 'House (Small Yard)', value: 'house_small_yard' },
    { label: 'House (Large Yard)', value: 'house_large_yard' },
    { label: 'Farm', value: 'farm' }
  ];

  spaceRequirementsOptions = [
    { label: 'Small', value: 'small' },
    { label: 'Moderate', value: 'moderate' },
    { label: 'Large', value: 'large' }
  ];

  climateOptions = [
    { label: 'Cold', value: 'cold' },
    { label: 'Temperate', value: 'temperate' },
    { label: 'Warm', value: 'warm' },
    { label: 'Hot', value: 'hot' }
  ];

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pet'] && this.pet) {
      this.loadExistingProfile();
    }
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      // Características de comportamiento
      energyLevel: ['moderate', Validators.required],
      socialLevel: ['friendly', Validators.required],
      goodWithKids: [null],
      goodWithOtherPets: [null],
      goodWithStrangers: [null],

      // Entrenamiento
      trainingLevel: ['basic', Validators.required],
      houseTrained: [false, Validators.required],
      leashTrained: [null],
      knownCommands: [[]],

      // Cuidados
      careLevel: ['moderate', Validators.required],
      exerciseNeeds: ['moderate', Validators.required],
      groomingNeeds: ['moderate', Validators.required],

      // Salud y dieta
      specialDiet: [false, Validators.required],
      dietDescription: [''],
      chronicConditions: [[]],
      medications: [[]],
      allergies: [[]],
      veterinaryNeeds: [''],

      // Comportamiento específico
      destructiveBehavior: [false, Validators.required],
      separationAnxiety: [false, Validators.required],
      noiseSensitivity: [false, Validators.required],
      escapeTendency: [false, Validators.required],

      // Preferencias de hogar
      idealHomeType: [null],
      spaceRequirements: ['moderate', Validators.required],
      climatePreferences: [[]],

      // Historia y notas
      rescueStory: [''],
      previousHomeExperience: [''],
      behavioralNotes: [''],

      // Compatibilidad
      beginnerFriendly: [true, Validators.required],
      apartmentSuitable: [true, Validators.required],
      familyFriendly: [true, Validators.required]
    });
  }

  // Métodos para manejar campos de array con input text
  getArrayAsString(fieldName: string): string {
    const value = this.profileForm.get(fieldName)?.value;
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return '';
  }

  updateArrayField(fieldName: string, event: any): void {
    const inputValue = event.target.value;
    const arrayValue = inputValue
      .split(',')
      .map((item: string) => item.trim())
      .filter((item: string) => item.length > 0);

    this.profileForm.get(fieldName)?.setValue(arrayValue);
  }

  private loadExistingProfile(): void {
    if (!this.pet) return;

    this.petService.getPetProfile(this.pet.id).subscribe({
      next: (profile) => {
        this.profileForm.patchValue(profile);
      },
      error: (error) => {
        console.log('No existing profile found for pet');
      }
    });
  }

  onSubmit(): void {
    if (!this.pet || this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Form Error',
        detail: 'Please check the form for errors'
      });
      return;
    }

    this.isSubmitting = true;
    const profileData: PetProfileInterface = this.prepareFormData();

    this.petService.createPetProfile(this.pet.id, profileData).subscribe({
      next: (createdProfile) => {
        this.isSubmitting = false;
        this.profileCreated.emit(createdProfile);
        this.messageService.add({
          severity: 'success',
          summary: 'Profile Created',
          detail: `Detailed profile for ${this.pet?.name} has been created successfully`
        });
        this.closeForm();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to create pet profile'
        });
      }
    });
  }

  private prepareFormData(): PetProfileInterface {
    const formValue = this.profileForm.value;
    const cleanedData: any = {};

    Object.keys(formValue).forEach(key => {
      const value = formValue[key];
      if (value !== null && value !== undefined) {
        if (Array.isArray(value) && value.length === 0) {
          if (['knownCommands', 'chronicConditions', 'medications', 'allergies', 'climatePreferences'].includes(key)) {
            return;
          }
        }
        cleanedData[key] = value;
      }
    });

    return cleanedData as PetProfileInterface;
  }

  closeForm(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.profileForm.reset();
    this.initForm();
  }

  isInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) {
      return 'This field is required';
    }

    return 'Invalid value';
  }
}
