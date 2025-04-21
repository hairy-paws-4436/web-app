import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {OngInterface} from '../../interfaces/ong/ong-interface';
import {returnHeaders} from '../../../shared/models/headers';

@Injectable({
  providedIn: 'root'
})
export class OngService {
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  getAllOngs(): Observable<OngInterface[]> {
    const url = `${this.baseUrl}/ongs`;

    return this.http.get<OngInterface[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  getOngById(id: string): Observable<OngInterface> {
    if (id === 'me') {
      return this.getMyOng();
    }

    const url = `${this.baseUrl}/ongs/${id}`;

    return this.http.get<OngInterface>(url).pipe(
      catchError(this.handleError)
    );
  }

  getMyOng(): Observable<OngInterface> {
    const url = `${this.baseUrl}/ongs/user/me`;

    return this.http.get<OngInterface>(url, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  registerOng(ongData: FormData): Observable<OngInterface> {
    const url = `${this.baseUrl}/ongs`;
    const headers = {
      ...returnHeaders(),
    };
    delete headers['Content-Type'];

    return this.http.post<OngInterface>(url, ongData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  updateOng(id: string, ongData: FormData | Partial<OngInterface>): Observable<OngInterface> {
    const url = `${this.baseUrl}/ongs/${id}`;

    let headers = returnHeaders();

    if (ongData instanceof FormData) {
      delete headers['Content-Type'];
    }

    return this.http.put<OngInterface>(url, ongData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  createOngFormData(ongData: Partial<OngInterface>, logoFile?: File): FormData {
    const formData = new FormData();

    Object.keys(ongData).forEach(key => {
      const value = ongData[key as keyof OngInterface];
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    if (logoFile) {
      formData.append('logo', logoFile, logoFile.name);
    }

    return formData;
  }

  private handleError(error: any) {
    console.error('An error occurred in OngService', error);
    return Promise.reject(error.message || error);
  }
}
