import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {EventInterface} from '../../interfaces/event/event-interface';
import {returnHeaders} from '../../../shared/models/headers';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  getAllEvents(): Observable<EventInterface[]> {
    const url = `${this.baseUrl}/events`;

    return this.http.get<EventInterface[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  getEventById(id: string): Observable<EventInterface> {
    const url = `${this.baseUrl}/events/${id}`;

    return this.http.get<EventInterface>(url).pipe(
      catchError(this.handleError)
    );
  }

  createEvent(eventData: EventInterface): Observable<EventInterface> {
    const url = `${this.baseUrl}/events`;

    return this.http.post<EventInterface>(url, eventData, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateEvent(id: string, eventData: Partial<EventInterface>): Observable<EventInterface> {
    const url = `${this.baseUrl}/events/${id}`;

    return this.http.put<EventInterface>(url, eventData, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  deleteEvent(id: string): Observable<any> {
    const url = `${this.baseUrl}/events/${id}`;

    return this.http.delete<any>(url, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getEventsByOng(ongId: string): Observable<EventInterface[]> {
    const url = `${this.baseUrl}/events?ongId=${ongId}`;

    return this.http.get<EventInterface[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred in EventService', error);
    return Promise.reject(error.message || error);
  }
}
