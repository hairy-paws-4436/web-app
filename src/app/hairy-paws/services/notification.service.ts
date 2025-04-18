// notification.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import {returnHeaders} from '../../shared/models/headers';
import {NotificationActionParams, NotificationInterface} from '../interfaces/notification-interface';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  /**
   * Get all notifications for the authenticated user
   */
  getNotifications(): Observable<NotificationInterface[]> {
    const url = `${this.baseUrl}/notifications`;

    return this.http.get<NotificationInterface[]>(url, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Mark a single notification as read
   */
  markAsRead(notificationId: string): Observable<any> {
    const url = `${this.baseUrl}/notifications/${notificationId}/read`;

    return this.http.post<any>(url, {}, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): Observable<any> {
    const url = `${this.baseUrl}/notifications/read-all`;

    return this.http.post<any>(url, {}, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Delete a notification
   */
  deleteNotification(notificationId: string): Observable<any> {
    const url = `${this.baseUrl}/notifications/${notificationId}`;

    return this.http.delete<any>(url, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Approve an adoption request
   */
  approveAdoption(adoptionId: string, params: { notes: string }): Observable<any> {
    const url = `${this.baseUrl}/adoptions/${adoptionId}/approve`;

    return this.http.put<any>(url, params, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Reject an adoption request
   */
  rejectAdoption(adoptionId: string, params: { reason: string }): Observable<any> {
    const url = `${this.baseUrl}/adoptions/${adoptionId}/reject`;

    return this.http.put<any>(url, params, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Cancel an adoption request
   */
  cancelAdoption(adoptionId: string): Observable<any> {
    const url = `${this.baseUrl}/adoptions/${adoptionId}/cancel`;

    return this.http.put<any>(url, {}, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Confirm a donation
   */
  confirmDonation(donationId: string, params: { notes: string }): Observable<any> {
    const url = `${this.baseUrl}/donations/${donationId}/confirm`;

    return this.http.put<any>(url, params, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Cancel a donation
   */
  cancelDonation(donationId: string): Observable<any> {
    const url = `${this.baseUrl}/donations/${donationId}/cancel`;

    return this.http.put<any>(url, {}, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Error handler for HTTP requests
   */
  private handleError(error: any) {
    console.error('An error occurred in NotificationService', error);
    return Promise.reject(error.message || error);
  }
}

