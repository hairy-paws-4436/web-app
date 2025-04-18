import {inject, Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {DonationInterface} from '../interfaces/donation-interface';
import {returnHeaders} from '../../shared/models/headers';

@Injectable({
  providedIn: 'root'
})
export class DonationService {
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  /**
   * Get donations based on user role
   */
  getDonations(): Observable<DonationInterface[]> {
    const url = `${this.baseUrl}/donations`;

    return this.http.get<DonationInterface[]>(url, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get donation by ID
   */
  getDonationById(id: string): Observable<DonationInterface> {
    const url = `${this.baseUrl}/donations/${id}`;

    return this.http.get<DonationInterface>(url, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Register a new donation
   */
  createDonation(donationData: DonationInterface): Observable<DonationInterface> {
    const url = `${this.baseUrl}/donations`;

    return this.http.post<DonationInterface>(url, donationData, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Confirm donation receipt
   */
  confirmDonation(id: string): Observable<DonationInterface> {
    const url = `${this.baseUrl}/donations/${id}/confirm`;

    return this.http.put<DonationInterface>(url, {}, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Cancel donation
   */
  cancelDonation(id: string): Observable<DonationInterface> {
    const url = `${this.baseUrl}/donations/${id}/cancel`;

    return this.http.put<DonationInterface>(url, {}, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Error handler for HTTP requests
   */
  private handleError(error: any) {
    console.error('An error occurred in DonationService', error);
    return Promise.reject(error.message || error);
  }
}
