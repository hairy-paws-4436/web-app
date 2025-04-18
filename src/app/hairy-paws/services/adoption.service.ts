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

    // Create a copy of the data to avoid modifying the original
    const processedData = { ...adoptionData };

    // Format visitDate if it exists and the type is 'visit'
    if (processedData.type === 'visit' && processedData.visitDate) {
      // Convert to ISO format (YYYY-MM-DDTHH:mm:ssZ)
      if (processedData.visitDate instanceof Date) {
        processedData.visitDate = processedData.visitDate.toISOString();
      } else if (typeof processedData.visitDate === 'string') {
        // If it's already a string, ensure it's in ISO format
        const date = new Date(processedData.visitDate);
        processedData.visitDate = date.toISOString();
      }
    }

    // For 'adoption' type, remove visitDate if present
    if (processedData.type === 'adoption') {
      delete processedData.visitDate;
    }

    return this.http.post<AdoptionInterface>(url, processedData, {headers: returnHeaders()}).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage = error.error?.message || 'An unexpected error occurred while submitting the request.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

}
