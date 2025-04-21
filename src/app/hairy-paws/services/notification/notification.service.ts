import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import {returnHeaders} from '../../../shared/models/headers';
import {NotificationInterface} from '../../interfaces/notification/notification-interface';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  getNotifications(): Observable<NotificationInterface[]> {
    const url = `${this.baseUrl}/notifications`;

    return this.http.get<NotificationInterface[]>(url, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  markAsRead(notificationId: string): Observable<any> {
    const url = `${this.baseUrl}/notifications/${notificationId}/read`;

    return this.http.post<any>(url, {}, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  markAllAsRead(): Observable<any> {
    const url = `${this.baseUrl}/notifications/read-all`;

    return this.http.post<any>(url, {}, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  deleteNotification(notificationId: string): Observable<any> {
    const url = `${this.baseUrl}/notifications/${notificationId}`;

    return this.http.delete<any>(url, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  approveAdoption(id: string, params: { notes: string }): Observable<any> {
    const url = `${this.baseUrl}/adoptions/${id}/approve`;

    return this.http.put<any>(url, params, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  rejectAdoption(id: string, params: { reason: string }): Observable<any> {
    const url = `${this.baseUrl}/adoptions/${id}/reject`;

    return this.http.put<any>(url, params, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  cancelAdoption(id: string): Observable<any> {
    const url = `${this.baseUrl}/adoptions/${id}/cancel`;

    return this.http.put<any>(url, {}, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  confirmDonation(id: string, params: { notes: string }): Observable<any> {
    const url = `${this.baseUrl}/donations/${id}/confirm`;

    return this.http.put<any>(url, params, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  cancelDonation(id: string): Observable<any> {
    const url = `${this.baseUrl}/donations/${id}/cancel`;

    return this.http.put<any>(url, {}, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred in NotificationService', error);
    return Promise.reject(error.message || error);
  }
}

