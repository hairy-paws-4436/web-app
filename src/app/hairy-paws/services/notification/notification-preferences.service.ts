import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { returnHeaders } from '../../../shared/models/headers';
import {
  NotificationPreferencesInterface,
  NotificationTemplateInterface,
  NotificationTemplatesApiResponse,
  FrequencyOption,
  ChannelOption
} from '../../interfaces/notification/notification-preferences-interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationPreferencesService {
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  getNotificationPreferences(): Observable<NotificationPreferencesInterface> {
    const url = `${this.baseUrl}/notification-preferences`;
    return this.http.get<NotificationPreferencesInterface>(url, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateNotificationPreferences(preferences: Partial<NotificationPreferencesInterface>): Observable<NotificationPreferencesInterface> {
    const url = `${this.baseUrl}/notification-preferences`;

    // Remove read-only fields and fields not expected by the API
    const updateData = { ...preferences };
    delete updateData.id;
    delete updateData.userId;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.user;
    delete updateData.lastDigestSent;

    // Remove frequency fields that are not in the DTO
    delete updateData.donationConfirmationsFrequency;
    delete updateData.eventRemindersFrequency;
    delete updateData.newEventsFrequency;
    delete updateData.followupRemindersFrequency;
    delete updateData.accountUpdatesEnabled;
    delete updateData.accountUpdatesFrequency;

    // Convert time format from HH:MM:SS to HH:MM for API
    if (updateData.quietHoursStart) {
      updateData.quietHoursStart = this.convertTimeFormat(updateData.quietHoursStart);
    }
    if (updateData.quietHoursEnd) {
      updateData.quietHoursEnd = this.convertTimeFormat(updateData.quietHoursEnd);
    }

    return this.http.put<NotificationPreferencesInterface>(url, updateData, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getAvailableTemplates(): Observable<NotificationTemplateInterface[]> {
    const url = `${this.baseUrl}/notification-preferences/templates`;
    return this.http.get<NotificationTemplatesApiResponse>(url, { headers: returnHeaders() }).pipe(
      map(response => {
        // Transform the API response into an array of templates
        return Object.entries(response).map(([key, template]) => ({
          id: key,
          name: template.name,
          description: template.description,
          category: 'preset',
          config: template.config,
          settings: {
            emailEnabled: true,
            pushEnabled: true,
            smsEnabled: false,
            frequency: 'immediate'
          }
        }));
      }),
      catchError((error) => {
        console.error('Failed to load templates:', error);
        // Provide fallback templates if API fails
        return this.getFallbackTemplates();
      })
    );
  }

  private getFallbackTemplates(): Observable<NotificationTemplateInterface[]> {
    const fallbackTemplates: NotificationTemplateInterface[] = [
      {
        id: 'minimal',
        name: 'Mínimas',
        description: 'Solo notificaciones esenciales',
        category: 'preset',
        config: {
          adoptionRequestsEnabled: true,
          adoptionRequestsFrequency: 'immediate',
          adoptionStatusEnabled: true,
          adoptionStatusFrequency: 'immediate',
          newMatchesEnabled: false,
          newAnimalsEnabled: false,
          eventRemindersEnabled: false,
          newEventsEnabled: false,
          donationConfirmationsEnabled: true,
          followupRemindersEnabled: true,
          promotionalEnabled: false,
          newsletterEnabled: false
        },
        settings: { emailEnabled: true, pushEnabled: true, smsEnabled: false, frequency: 'immediate' }
      },
      {
        id: 'balanced',
        name: 'Equilibradas',
        description: 'Buena combinación de utilidad y tranquilidad',
        category: 'preset',
        config: {
          adoptionRequestsEnabled: true,
          adoptionRequestsFrequency: 'immediate',
          adoptionStatusEnabled: true,
          adoptionStatusFrequency: 'immediate',
          newMatchesEnabled: true,
          newMatchesFrequency: 'daily_digest',
          newAnimalsEnabled: true,
          newAnimalsFrequency: 'weekly_digest',
          eventRemindersEnabled: true,
          newEventsEnabled: false,
          donationConfirmationsEnabled: true,
          followupRemindersEnabled: true,
          promotionalEnabled: false,
          newsletterEnabled: true
        },
        settings: { emailEnabled: true, pushEnabled: true, smsEnabled: false, frequency: 'daily_digest' }
      },
      {
        id: 'everything',
        name: 'Todas',
        description: 'Mantente al día con todo lo que pasa',
        category: 'preset',
        config: {
          adoptionRequestsEnabled: true,
          adoptionRequestsFrequency: 'immediate',
          adoptionStatusEnabled: true,
          adoptionStatusFrequency: 'immediate',
          newMatchesEnabled: true,
          newMatchesFrequency: 'immediate',
          newAnimalsEnabled: true,
          newAnimalsFrequency: 'daily_digest',
          eventRemindersEnabled: true,
          newEventsEnabled: true,
          newEventsFrequency: 'weekly_digest',
          donationConfirmationsEnabled: true,
          followupRemindersEnabled: true,
          promotionalEnabled: true,
          newsletterEnabled: true
        },
        settings: { emailEnabled: true, pushEnabled: true, smsEnabled: true, frequency: 'immediate' }
      }
    ];

    return new Observable(observer => {
      observer.next(fallbackTemplates);
      observer.complete();
    });
  }

  applyTemplate(templateKey: string): Observable<NotificationPreferencesInterface> {
    const url = `${this.baseUrl}/notification-preferences/template/${templateKey}`;
    return this.http.put<NotificationPreferencesInterface>(url, { templateName: templateKey }, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getDefaultPreferences(): NotificationPreferencesInterface {
    return {
      userId: '',
      globalNotificationsEnabled: true,
      quietHoursEnabled: false,
      quietHoursStart: '22:00:00',
      quietHoursEnd: '07:00:00',
      preferredChannels: ['in_app', 'email'],

      // Adoption notifications
      adoptionRequestsEnabled: true,
      adoptionRequestsFrequency: 'immediate',
      adoptionStatusEnabled: true,
      adoptionStatusFrequency: 'immediate',

      // New matches and animals
      newMatchesEnabled: true,
      newMatchesFrequency: 'daily_digest',
      newAnimalsEnabled: true,
      newAnimalsFrequency: 'weekly_digest',

      // Donations
      donationConfirmationsEnabled: true,
      donationConfirmationsFrequency: 'immediate',

      // Events
      eventRemindersEnabled: true,
      eventRemindersFrequency: 'immediate',
      newEventsEnabled: false,
      newEventsFrequency: 'weekly_digest',

      // Follow-ups and account
      followupRemindersEnabled: true,
      followupRemindersFrequency: 'immediate',
      accountUpdatesEnabled: true,
      accountUpdatesFrequency: 'immediate',

      // Filtering preferences
      preferredAnimalTypesForNotifications: null,
      maxDistanceNotificationsKm: 50,
      onlyHighCompatibility: false,

      // Marketing
      promotionalEnabled: false,
      newsletterEnabled: true,

      // System settings
      lastDigestSent: null,
      timezone: 'America/Lima',
      language: 'es'
    };
  }

  getFrequencyOptions(): FrequencyOption[] {
    return [
      { label: 'Inmediato', value: 'immediate' },
      { label: 'Resumen Diario', value: 'daily_digest' },
      { label: 'Resumen Semanal', value: 'weekly_digest' },
      { label: 'Deshabilitado', value: 'disabled' }
    ];
  }

  getChannelOptions(): ChannelOption[] {
    return [
      { label: 'En la App', value: 'in_app', icon: 'pi pi-bell' },
      { label: 'Email', value: 'email', icon: 'pi pi-envelope' },
      { label: 'SMS', value: 'sms', icon: 'pi pi-comment' },
      { label: 'Push', value: 'push', icon: 'pi pi-mobile' }
    ];
  }

  getLanguageOptions() {
    return [
      { label: 'English', value: 'en' },
      { label: 'Español', value: 'es' },
      { label: 'Português', value: 'pt' },
      { label: 'Français', value: 'fr' }
    ];
  }

  getTimezoneOptions() {
    return [
      { label: 'UTC-5 (Lima, Perú)', value: 'America/Lima' },
      { label: 'UTC-3 (São Paulo, Brasil)', value: 'America/Sao_Paulo' },
      { label: 'UTC-6 (Ciudad de México)', value: 'America/Mexico_City' },
      { label: 'UTC-5 (Nueva York)', value: 'America/New_York' },
      { label: 'UTC-8 (Los Ángeles)', value: 'America/Los_Angeles' },
      { label: 'UTC+0 (Londres)', value: 'Europe/London' },
      { label: 'UTC+1 (Madrid)', value: 'Europe/Madrid' }
    ];
  }

  getAnimalTypeOptions() {
    return [
      { label: 'Perros', value: 'dog' },
      { label: 'Gatos', value: 'cat' },
      { label: 'Aves', value: 'bird' },
      { label: 'Animales Pequeños', value: 'small' },
      { label: 'Exóticos', value: 'exotic' }
    ];
  }

  private handleError(error: any) {
    console.error('An error occurred in NotificationPreferencesService', error);
    const errorMessage = error?.error?.message || error?.message || 'An unexpected error occurred';
    return throwError(() => errorMessage);
  }

  /**
   * Convert time format from HH:MM:SS to HH:MM
   * @param time Time string in HH:MM:SS or HH:MM format
   * @returns Time string in HH:MM format
   */
  private convertTimeFormat(time: string): string {
    if (!time) return time;

    // If already in HH:MM format, return as is
    if (time.length === 5 && time.includes(':')) {
      return time;
    }

    // If in HH:MM:SS format, convert to HH:MM
    if (time.length === 8 && time.includes(':')) {
      return time.substring(0, 5);
    }

    return time;
  }
}
