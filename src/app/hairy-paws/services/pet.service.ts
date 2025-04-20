import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {PetInterface} from '../interfaces/pet-interface';
import {catchError, Observable, throwError} from 'rxjs';
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
      catchError(this.handleError)
    );
  }

  getMyPets(){
    const url = `${this.baseUrl}/animals/owner`;

    return this.http.get<PetInterface[]>(url, {headers: returnHeaders()}).pipe(
      catchError(this.handleError)
    );
  }

  deleteMyPet(id: string){
    const url = `${this.baseUrl}/animals/${id}`;

    return this.http.delete<any>(url, {headers: returnHeaders()}).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Register a new pet
   */
  registerPet(petData: FormData): Observable<PetInterface> {
    const url = `${this.baseUrl}/animals`;


    return this.http.post<PetInterface>(url, petData, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateMyPet(id: string, petData: Partial<PetInterface>){
    const url = `${this.baseUrl}/animals/${id}`;

    return this.http.put<PetInterface>(url, petData, {headers: returnHeaders()}).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred in PetService', error);
    return Promise.reject(error.message || error);
  }

}
