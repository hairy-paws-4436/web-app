import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {OngInterface} from '../interfaces/ong-interface';
import {returnHeaders} from '../../shared/models/headers';

@Injectable({
  providedIn: 'root'
})
export class OngService {
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  /**
   * Get all ONGs
   */
  getAllOngs(): Observable<OngInterface[]> {
    const url = `${this.baseUrl}/ongs`;

    return this.http.get<OngInterface[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get ONG by ID
   */
  getOngById(id: string): Observable<OngInterface> {
    const url = `${this.baseUrl}/ongs/${id}`;

    return this.http.get<OngInterface>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get ONG of the authenticated user
   */
  getMyOng(): Observable<OngInterface> {
    const url = `${this.baseUrl}/ongs/user/me`;

    return this.http.get<OngInterface>(url, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Register a new ONG
   */
  registerOng(ongData: OngInterface): Observable<OngInterface> {
    const url = `${this.baseUrl}/ongs`;

    return this.http.post<OngInterface>(url, ongData, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update ONG information
   */
  updateOng(id: string, ongData: Partial<OngInterface>): Observable<OngInterface> {
    const url = `${this.baseUrl}/ongs/${id}`;

    return this.http.put<OngInterface>(url, ongData, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Error handler for HTTP requests
   */
  private handleError(error: any) {
    console.error('An error occurred in OngService', error);
    return Promise.reject(error.message || error);
  }
}
