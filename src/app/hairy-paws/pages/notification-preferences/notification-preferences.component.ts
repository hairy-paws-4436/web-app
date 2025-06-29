import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabViewModule } from 'primeng/tabview';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SliderModule } from 'primeng/slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';

import { NotificationPreferencesService } from '../../services/notification/notification-preferences.service';
import {
  NotificationPreferencesInterface,
  NotificationTemplateInterface
} from '../../interfaces/notification/notification-preferences-interface';
import {Ripple} from 'primeng/ripple';
import {Tooltip} from 'primeng/tooltip';

@Component({
  selector: 'app-notification-preferences-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    CheckboxModule,
    DropdownModule,
    InputTextModule,
    ToastModule,
    ProgressSpinnerModule,
    TabViewModule,
    DividerModule,
    PanelModule,
    ToggleButtonModule,
    SliderModule,
    MultiSelectModule,
    InputNumberModule,
    Ripple,
    Tooltip
  ],
  providers: [MessageService],
  templateUrl: 'notification-preferences.component.html',
  styleUrls: ['notification-preferences.component.css']
})
export class NotificationPreferencesPageComponent implements OnInit {
  private notificationService = inject(NotificationPreferencesService);
  private messageService = inject(MessageService);

  isLoading = false;
  isSaving = false;
  preferences: NotificationPreferencesInterface = this.notificationService.getDefaultPreferences();
  availableTemplates: NotificationTemplateInterface[] = [];

  // Options from service
  frequencyOptions = this.notificationService.getFrequencyOptions();
  channelOptions = this.notificationService.getChannelOptions();
  languageOptions = this.notificationService.getLanguageOptions();
  timezoneOptions = this.notificationService.getTimezoneOptions();
  animalTypeOptions = this.notificationService.getAnimalTypeOptions();

  // Initialize preferences on component creation
  ngOnInit(): void {
    // Ensure preferences has default values before loading
    this.preferences = this.notificationService.getDefaultPreferences();
    this.loadPreferences();
    this.loadAvailableTemplates();
  }

  loadPreferences(): void {
    this.isLoading = true;

    this.notificationService.getNotificationPreferences().subscribe({
      next: (preferences) => {
        this.preferences = preferences;
        // Ensure preferredChannels is always an array
        if (!this.preferences.preferredChannels) {
          this.preferences.preferredChannels = ['in_app', 'email'];
        }
        this.isLoading = false;
      },
      error: (error) => {
        // If user doesn't have preferences yet, use defaults
        this.preferences = this.notificationService.getDefaultPreferences();
        this.isLoading = false;
        console.log('No existing preferences found, using defaults');
      }
    });
  }

  loadAvailableTemplates(): void {
    this.notificationService.getAvailableTemplates().subscribe({
      next: (templates) => {
        this.availableTemplates = templates;
      },
      error: (error) => {
        console.error('Failed to load templates:', error);
        this.availableTemplates = [];
      }
    });
  }

  applyTemplate(templateKey: string): void {
    if (!templateKey) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Error',
        detail: 'Por favor selecciona una plantilla válida'
      });
      return;
    }

    this.isSaving = true;

    // Find the template to get its config
    const template = this.availableTemplates.find(t => t.id === templateKey);

    if (!template) {
      this.isSaving = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Plantilla no encontrada'
      });
      return;
    }

    // Apply template config to current preferences, only including fields that the API accepts
    const updatedPreferences: Partial<NotificationPreferencesInterface> = {
      globalNotificationsEnabled: this.preferences.globalNotificationsEnabled,
      quietHoursEnabled: this.preferences.quietHoursEnabled,
      quietHoursStart: this.preferences.quietHoursStart,
      quietHoursEnd: this.preferences.quietHoursEnd,
      preferredChannels: this.preferences.preferredChannels,
      timezone: this.preferences.timezone,
      language: this.preferences.language,

      // Apply template config
      adoptionRequestsEnabled: template.config.adoptionRequestsEnabled,
      adoptionRequestsFrequency: template.config.adoptionRequestsFrequency,
      adoptionStatusEnabled: template.config.adoptionStatusEnabled,
      adoptionStatusFrequency: template.config.adoptionStatusFrequency,
      newMatchesEnabled: template.config.newMatchesEnabled,
      newMatchesFrequency: template.config.newMatchesFrequency || 'daily_digest',
      newAnimalsEnabled: template.config.newAnimalsEnabled,
      newAnimalsFrequency: template.config.newAnimalsFrequency || 'weekly_digest',
      eventRemindersEnabled: template.config.eventRemindersEnabled,
      newEventsEnabled: template.config.newEventsEnabled,
      donationConfirmationsEnabled: template.config.donationConfirmationsEnabled,
      followupRemindersEnabled: template.config.followupRemindersEnabled,
      promotionalEnabled: template.config.promotionalEnabled,
      newsletterEnabled: template.config.newsletterEnabled,

      // Keep existing filtering preferences
      preferredAnimalTypesForNotifications: this.preferences.preferredAnimalTypesForNotifications,
      maxDistanceNotificationsKm: this.preferences.maxDistanceNotificationsKm,
      onlyHighCompatibility: this.preferences.onlyHighCompatibility
    };

    // Update preferences with template config
    this.notificationService.updateNotificationPreferences(updatedPreferences).subscribe({
      next: (response) => {
        this.preferences = response;
        this.isSaving = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Plantilla Aplicada',
          detail: `La plantilla "${template.name}" se ha aplicado correctamente`
        });
      },
      error: (error) => {
        this.isSaving = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error al Aplicar Plantilla',
          detail: error || 'No se pudo aplicar la plantilla'
        });
      }
    });
  }

  savePreferences(): void {
    this.isSaving = true;

    this.notificationService.updateNotificationPreferences(this.preferences).subscribe({
      next: (updatedPreferences) => {
        this.preferences = updatedPreferences;
        this.isSaving = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Preferencias Guardadas',
          detail: 'Tus preferencias de notificación se han actualizado correctamente'
        });
      },
      error: (error) => {
        this.isSaving = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error al Guardar',
          detail: error || 'No se pudieron guardar las preferencias'
        });
      }
    });
  }

  resetToDefault(): void {
    this.preferences = this.notificationService.getDefaultPreferences();
    this.messageService.add({
      severity: 'info',
      summary: 'Restaurar Predeterminados',
      detail: 'Las preferencias se han restaurado a los valores predeterminados. Haz clic en "Guardar" para aplicar los cambios.'
    });
  }

  // Helper methods for UI
  isChannelEnabled(channel: string): boolean {
    return this.preferences.preferredChannels?.includes(channel) || false;
  }

  toggleChannel(channel: string): void {
    // Ensure preferredChannels is initialized
    if (!this.preferences.preferredChannels) {
      this.preferences.preferredChannels = [];
    }

    const index = this.preferences.preferredChannels.indexOf(channel);
    if (index > -1) {
      this.preferences.preferredChannels.splice(index, 1);
    } else {
      this.preferences.preferredChannels.push(channel);
    }
  }

  formatTime(timeString: string): string {
    // Convert "22:00:00" to "22:00" for HTML time input
    return timeString ? timeString.substring(0, 5) : '22:00';
  }

  updateQuietHoursStart(time: string): void {
    // Store as HH:MM:SS internally but API expects HH:MM
    this.preferences.quietHoursStart = time + ':00';
  }

  updateQuietHoursEnd(time: string): void {
    // Store as HH:MM:SS internally but API expects HH:MM
    this.preferences.quietHoursEnd = time + ':00';
  }

  getSelectedAnimalTypes(): string[] {
    return this.preferences.preferredAnimalTypesForNotifications || [];
  }

  updateAnimalTypes(selectedTypes: string[]): void {
    this.preferences.preferredAnimalTypesForNotifications = selectedTypes.length > 0 ? selectedTypes : null;
  }

}
