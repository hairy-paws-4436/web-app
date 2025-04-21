import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {returnHeaders} from '../../../shared/models/headers';
import {PasswordChangeInterface, UserInterface} from '../../../auth/interfaces/user-interface';
import {catchError, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  getUserProfile(): Observable<UserInterface> {
    const url = `${this.baseUrl}/users/profile`;

    return this.http.get<UserInterface>(url, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateUserProfile(userData: Partial<UserInterface>): Observable<UserInterface> {
    const url = `${this.baseUrl}/users/profile`;

    return this.http.put<UserInterface>(url, userData, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  changePassword(passwordData: PasswordChangeInterface): Observable<any> {
    const url = `${this.baseUrl}/users/change-password`;

    return this.http.post<any>(url, passwordData, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  deactivateAccount(): Observable<any> {
    const url = `${this.baseUrl}/users/deactivate`;

    return this.http.post<any>(url, {}, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  uploadProfileImage(imageFile: File): Observable<any> {
    const url = `${this.baseUrl}/users/profile/image`;
    const formData = new FormData();
    formData.append('profileImage', imageFile);

    return this.http.post<any>(url, formData, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred in UserService', error);
    return Promise.reject(error.message || error);
  }
}
