import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AdoptionInterface} from '../interfaces/adoption-interface';
import {catchError, Observable, switchMap, throwError} from 'rxjs';
import {returnHeaders} from '../../shared/models/headers';

@Injectable({
  providedIn: 'root'
})
export class AdoptionService {
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  constructor() {
  }

  requestAdoptionOrVisit(adoptionData: AdoptionInterface): Observable<AdoptionInterface> {
    const url = `${this.baseUrl}/adoptions`;
    return this.http.post<AdoptionInterface>(url, adoptionData, {headers: returnHeaders()}).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage = error.error?.message || 'An unexpected error occurred while submitting the request.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
