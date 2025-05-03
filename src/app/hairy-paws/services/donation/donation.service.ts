import {inject, Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {DonationInterface} from '../../interfaces/donation/donation-interface';
import {returnHeaders} from '../../../shared/models/headers';

@Injectable({
  providedIn: 'root'
})
export class DonationService {
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  getDonations(): Observable<DonationInterface[]> {
    const url = `${this.baseUrl}/donations`;

    return this.http.get<DonationInterface[]>(url, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getDonationById(id: string): Observable<DonationInterface> {
    const url = `${this.baseUrl}/donations/${id}`;

    return this.http.get<DonationInterface>(url, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }



  createDonation(formData: FormData): Observable<DonationInterface> {
    const url = `${this.baseUrl}/donations`;

    const headers = returnHeaders();
    delete headers['Content-Type'];

    return this.http.post<DonationInterface>(url, formData, {
      headers: headers
    }).pipe(
      catchError(this.handleError)
    );
  }


  confirmDonation(id: string): Observable<DonationInterface> {
    const url = `${this.baseUrl}/donations/${id}/confirm`;

    return this.http.put<DonationInterface>(url, {}, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  cancelDonation(id: string): Observable<DonationInterface> {
    const url = `${this.baseUrl}/donations/${id}/cancel`;

    return this.http.put<DonationInterface>(url, {}, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred in DonationService', error);
    return Promise.reject(error.message || error);
  }
}
