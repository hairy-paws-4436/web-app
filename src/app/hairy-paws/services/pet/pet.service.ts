import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {PetInterface} from '../../interfaces/pet/pet-interface';
import {PetProfileInterface} from '../../interfaces/pet/pet-profile-interface';
import {catchError, map, Observable, of, throwError} from 'rxjs';
import {returnHeaders} from '../../../shared/models/headers';

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

  registerPet(petData: FormData): Observable<PetInterface> {
    const url = `${this.baseUrl}/animals`;

    const headers = {
      ...returnHeaders()
    };

    delete headers['Content-Type'];

    return this.http.post<PetInterface>(url, petData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  updateMyPet(id: string, petData: Partial<PetInterface>){
    const url = `${this.baseUrl}/animals/${id}`;

    return this.http.put<PetInterface>(url, petData, {headers: returnHeaders()}).pipe(
      catchError(this.handleError)
    );
  }

  getPetById(id: string): Observable<PetInterface> {
    const url = `${this.baseUrl}/animals/${id}`;
    return this.http.get<PetInterface>(url).pipe(
      catchError(this.handleError)
    );
  }

  // NUEVOS MÉTODOS: Gestión de perfiles detallados
  createPetProfile(animalId: string, profileData: PetProfileInterface): Observable<PetProfileInterface> {
    const url = `${this.baseUrl}/matching/animals/${animalId}/profile`;

    return this.http.post<{profile: PetProfileInterface}>(url, profileData, {headers: returnHeaders()}).pipe(
      map(response => response.profile),
      catchError(this.handleError)
    );
  }

  getPetProfile(animalId: string): Observable<PetProfileInterface> {
    const url = `${this.baseUrl}/matching/animals/${animalId}/profile`;

    return this.http.get<{profile: PetProfileInterface, hasProfile: boolean}>(url, {headers: returnHeaders()}).pipe(
      map(response => {
        if (!response.hasProfile) {
          throw new Error('Pet profile not found');
        }
        return response.profile;
      }),
      catchError(this.handleError)
    );
  }

  updatePetProfile(animalId: string, profileData: Partial<PetProfileInterface>): Observable<PetProfileInterface> {
    const url = `${this.baseUrl}/matching/animals/${animalId}/profile`;

    return this.http.put<{profile: PetProfileInterface}>(url, profileData, {headers: returnHeaders()}).pipe(
      map(response => response.profile),
      catchError(this.handleError)
    );
  }

  // MÉTODO ADICIONAL: Verificar si existe perfil
  checkPetProfileExists(animalId: string): Observable<boolean> {
    const url = `${this.baseUrl}/matching/animals/${animalId}/profile`;

    return this.http.get<{hasProfile: boolean}>(url, {headers: returnHeaders()}).pipe(
      map(response => response.hasProfile),
      catchError(() => of(false))
    );
  }

  private handleError(error: any) {
    console.error('An error occurred in PetService', error);
    return throwError(() => new Error(error.message || error));
  }
}
