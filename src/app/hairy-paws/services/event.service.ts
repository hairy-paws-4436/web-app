import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {EventInterface} from '../interfaces/event-interface';
import {returnHeaders} from '../../shared/models/headers';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  /**
   * Get all events
   */
  getAllEvents(): Observable<EventInterface[]> {
    const url = `${this.baseUrl}/events`;

    return this.http.get<EventInterface[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get event by ID
   */
  getEventById(id: string): Observable<EventInterface> {
    const url = `${this.baseUrl}/events/${id}`;

    return this.http.get<EventInterface>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Create a new event
   */
  createEvent(eventData: EventInterface): Observable<EventInterface> {
    const url = `${this.baseUrl}/events`;

    return this.http.post<EventInterface>(url, eventData, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update event information
   */
  updateEvent(id: string, eventData: Partial<EventInterface>): Observable<EventInterface> {
    const url = `${this.baseUrl}/events/${id}`;

    return this.http.put<EventInterface>(url, eventData, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Delete an event
   */
  deleteEvent(id: string): Observable<any> {
    const url = `${this.baseUrl}/events/${id}`;

    return this.http.delete<any>(url, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get events by ONG ID
   */
  getEventsByOng(ongId: string): Observable<EventInterface[]> {
    const url = `${this.baseUrl}/events?ongId=${ongId}`;

    return this.http.get<EventInterface[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Error handler for HTTP requests
   */
  private handleError(error: any) {
    console.error('An error occurred in EventService', error);
    return Promise.reject(error.message || error);
  }
}
