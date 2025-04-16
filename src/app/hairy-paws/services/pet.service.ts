import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {PetInterface} from '../interfaces/pet-interface';
import {catchError, throwError} from 'rxjs';
import {returnHeaders} from '../../shared/models/headers';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  constructor() { }

  getPetsByTypeAndBreed(type: string, breed: string) {
    const url = `${this.baseUrl}/animals`;
    const params = { type, breed };

    return this.http.get<PetInterface[]>(url, { params }).pipe(
      catchError(() => {
        return throwError(() => new Error('Failed to retrieve pets. Please try again later.'));
      })
    );
  }

  myPets(){
    const url = `${this.baseUrl}/animals/owner`;

    return this.http.get<PetInterface[]>(url, {headers: returnHeaders()}).pipe(
      catchError(() => {
        return throwError(() => new Error('Failed to retrieve pets. Please try again later.'));
      })
    );
  }

}
