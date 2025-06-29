import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { returnHeaders } from '../../../shared/models/headers';
import {
  AdoptionStatsInterface,
  FollowupAnalyticsInterface,
  FollowupDashboardInterface,
  FollowupInterface,
  FollowupQuestionnaireInterface
} from '../../interfaces/post-adoption/followup-interface';


@Injectable({
  providedIn: 'root'
})
export class PostAdoptionService {
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  // User followups
  getMyFollowups(): Observable<FollowupInterface[]> {
    const url = `${this.baseUrl}/post-adoption/my-followups`;
    return this.http.get<FollowupInterface[]>(url, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getFollowupDetails(followupId: string): Observable<FollowupInterface> {
    const url = `${this.baseUrl}/post-adoption/followup/${followupId}`;
    return this.http.get<FollowupInterface>(url, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  completeFollowup(followupId: string, questionnaire: FollowupQuestionnaireInterface): Observable<FollowupInterface> {
    const url = `${this.baseUrl}/post-adoption/followup/${followupId}/complete`;
    return this.http.post<FollowupInterface>(url, questionnaire, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  skipFollowup(followupId: string): Observable<FollowupInterface> {
    const url = `${this.baseUrl}/post-adoption/followup/${followupId}/skip`;
    return this.http.post<FollowupInterface>(url, {}, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // ONG Dashboard and Analytics
  getOngDashboard(): Observable<FollowupDashboardInterface> {
    const url = `${this.baseUrl}/post-adoption/ong/dashboard`;
    return this.http.get<FollowupDashboardInterface>(url, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getOngAnalytics(): Observable<FollowupAnalyticsInterface> {
    const url = `${this.baseUrl}/post-adoption/ong/analytics`;
    return this.http.get<FollowupAnalyticsInterface>(url, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getAtRiskAdoptions(): Observable<FollowupInterface[]> {
    const url = `${this.baseUrl}/post-adoption/ong/at-risk`;
    return this.http.get<FollowupInterface[]>(url, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  initiateIntervention(followupId: string, interventionData: { type: string; notes: string; priority: string }): Observable<any> {
    const url = `${this.baseUrl}/post-adoption/ong/intervention/${followupId}`;
    return this.http.post<any>(url, interventionData, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Admin functions
  getGlobalStats(): Observable<AdoptionStatsInterface> {
    const url = `${this.baseUrl}/post-adoption/admin/stats`;
    return this.http.get<AdoptionStatsInterface>(url, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  sendManualReminders(followupIds: string[]): Observable<{ sent: number; failed: number }> {
    const url = `${this.baseUrl}/post-adoption/admin/send-reminders`;
    return this.http.post<{ sent: number; failed: number }>(url, { followupIds }, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Helper methods for form options
  getAdaptationLevels(): { value: string; label: string }[] {
    return [
      { value: 'excellent', label: 'Excellent - Perfect adaptation' },
      { value: 'good', label: 'Good - Minor adjustments needed' },
      { value: 'fair', label: 'Fair - Some challenges' },
      { value: 'poor', label: 'Poor - Significant difficulties' }
    ];
  }

  getBehavioralIssueOptions(): string[] {
    return [
      'Separation anxiety',
      'Excessive barking/meowing',
      'Destructive behavior',
      'Aggression towards people',
      'Aggression towards other pets',
      'House training issues',
      'Escape attempts',
      'Food guarding',
      'Excessive energy',
      'Fear/shyness',
      'Other'
    ];
  }

  getHealthConcernOptions(): string[] {
    return [
      'Loss of appetite',
      'Digestive issues',
      'Skin problems',
      'Respiratory issues',
      'Limping/mobility issues',
      'Eye problems',
      'Ear problems',
      'Lethargy',
      'Weight loss/gain',
      'Dental issues',
      'Other'
    ];
  }

  getSupportTypeOptions(): string[] {
    return [
      'Behavioral training',
      'Veterinary consultation',
      'Nutrition guidance',
      'Exercise recommendations',
      'Socialization tips',
      'Emergency support',
      'Equipment/supplies',
      'Financial assistance',
      'Other'
    ];
  }

  getFollowupTypes(): { value: string; label: string; description: string }[] {
    return [
      { value: 'initial', label: '48 Hours', description: 'Initial check-in after adoption' },
      { value: 'week_1', label: '1 Week', description: 'First week adaptation check' },
      { value: 'month_1', label: '1 Month', description: 'One month progress review' },
      { value: 'month_3', label: '3 Months', description: 'Three month milestone' },
      { value: 'month_6', label: '6 Months', description: 'Six month evaluation' },
      { value: 'annual', label: 'Annual', description: 'Yearly check-up' }
    ];
  }

  private handleError(error: any) {
    console.error('An error occurred in PostAdoptionService', error);
    const errorMessage = error?.error?.message || error?.message || 'An unexpected error occurred';
    return throwError(() => errorMessage);
  }
}
