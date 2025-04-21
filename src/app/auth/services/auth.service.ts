import {computed, inject, Injectable, signal} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, Observable, switchMap, throwError} from 'rxjs';
import {AuthStatusEnum} from '../enums/status-enum';
import {LoginResponseInterface} from '../interfaces/response/login-response-interface';
import {RegisterResponseInterface} from '../interfaces/response/register-response-interface';
import {Router} from '@angular/router';
import {jwtDecode} from 'jwt-decode';
import {RoleEnum} from '../enums/role-enum';
import {LoginRequestInterface} from '../interfaces/request/login-request-interface';
import {RegisterRequestInterface} from '../interfaces/request/register-request-interface';
import {JwtPayload} from '../interfaces/jwt-payload';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  private _authStatus = signal<AuthStatusEnum>(AuthStatusEnum.checking);
  public authStatus = computed(() => this._authStatus());
  private router = inject(Router);
  public sessionExpired = signal<boolean>(false);
  public _userRole = signal<RoleEnum | null>(null);
  private _userId = signal<string | null>(null);
  private _ongId = signal<string | null>(null);

  constructor() {
    this.initializeAuthStatus();
    this.startaccess_tokenCheck();
  }

  private initializeAuthStatus(): void {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      this._authStatus.set(AuthStatusEnum.authenticated);
      this.loadUserFromToken(access_token);
    } else {
      this._authStatus.set(AuthStatusEnum.notAuthenticated);
    }
  }

  private loadUserFromToken(access_token: string): void {
    try {
      const decoded = jwtDecode<JwtPayload>(access_token);
      if (decoded.role) {
        this._userRole.set(decoded.role);
      }
      if (decoded.userId) {
        this._userId.set(decoded.userId);
      }
      if (decoded.ongId) {
        this._ongId.set(decoded.ongId);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      this._userRole.set(null);
      this._userId.set(null);
      this._ongId.set(null);
    }
  }

  public setAuthentication(access_token: string, role: string): boolean {
    if (!access_token) return false;
    localStorage.setItem('access_token', access_token);
    this._authStatus.set(AuthStatusEnum.authenticated);
    this.loadUserFromToken(access_token);
    return true;
  }

  login(loginRequest: LoginRequestInterface): Observable<LoginResponseInterface> {
    const url = `${this.baseUrl}/auth/login`;
    return this.http.post<LoginResponseInterface>(url, loginRequest).pipe(
      map(({access_token, user, requiresTwoFactor, userId}) => {
        if (!requiresTwoFactor && access_token && user) {
          this.setAuthentication(access_token, user.role);
        }

        return {access_token, user, requiresTwoFactor, userId};
      }),
      catchError((err) => {
        const errorMessage =
          err?.error?.message ||
          err?.message ||
          'Error inesperado al iniciar sesión';

        return throwError(() => errorMessage);
      })
    );
  }

  verifyTwoFactorCode(userId: string, token: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/2fa/verify`;

    return this.http.post<LoginResponseInterface>(url, {userId, token}).pipe(
      map(response => {
        if (response.access_token && response.user) {
          this.setAuthentication(response.access_token, response.user.role);
          return true;
        }
        return false;
      }),
      catchError(err =>
        throwError(() => err.error?.message || 'Invalid verification code')
      )
    );
  }

  register(registerRequest: RegisterRequestInterface): Observable<LoginResponseInterface> {
    const url = `${this.baseUrl}/auth/register`;
    const loginRequest: LoginRequestInterface = {
      email: registerRequest.email,
      password: registerRequest.password
    };

    return this.http.post<RegisterResponseInterface>(url, registerRequest).pipe(
      switchMap(() => this.login(loginRequest)),
      catchError((error: HttpErrorResponse) => {
        const errorMessage = error.error?.message || 'Error inesperado al registrar';
        return throwError(() => errorMessage);
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    this._authStatus.set(AuthStatusEnum.notAuthenticated);
    this.sessionExpired.set(false);
    this._userRole.set(null);
    this._userId.set(null);
    this._ongId.set(null);
    this.router.navigateByUrl('/auth/login').then();
  }

  private getaccess_tokenExpiration(): number | null {
    const access_token = localStorage.getItem('access_token');
    if (!access_token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(access_token);
      return decoded.exp ? decoded.exp * 1000 : null;
    } catch (error) {
      return null;
    }
  }

  private isaccess_tokenExpired(access_token: string): boolean {
    const exp = this.getaccess_tokenExpiration();
    return exp ? Date.now() > exp : true;
  }

  private startaccess_tokenCheck() {
    setInterval(() => {
      const access_token = localStorage.getItem('access_token');
      if (access_token && this.isaccess_tokenExpired(access_token)) {
        this.logout();
        this.sessionExpired.set(true);
      }
    }, 60000);
  }

  isAdmin(): boolean {
    return this._userRole() === RoleEnum.ADMIN;
  }

  isOwner(): boolean {
    return this._userRole() === RoleEnum.OWNER;
  }

  isAdopter(): boolean {
    return this._userRole() === RoleEnum.ADOPTER;
  }

  isONG(): boolean {
    return this._userRole() === RoleEnum.ONG;
  }

  getCurrentUserId(): string | null {
    return this._userId();
  }

  getCurrentOngId(): string | null {
    return this._ongId();
  }

  getUserRole(): RoleEnum | null {
    return this._userRole();
  }

  hasRole(role: RoleEnum): boolean {
    return this._userRole() === role;
  }

  hasAnyRole(roles: RoleEnum[]): boolean {
    const currentRole = this._userRole();
    return currentRole ? roles.includes(currentRole) : false;
  }
}
