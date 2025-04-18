import {Component, inject, OnInit} from '@angular/core';
import {OngService} from '../../services/ong.service';
import {MessageService} from 'primeng/api';
import {EventService} from '../../services/event.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {OngInterface} from '../../interfaces/ong-interface';
import {EventInterface} from '../../interfaces/event-interface';
import {Toast} from 'primeng/toast';
import {NgForOf, NgIf} from '@angular/common';
import {ProgressSpinner} from 'primeng/progressspinner';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {Card} from 'primeng/card';
import {Divider} from 'primeng/divider';
import {EventCardComponent} from '../event-card/event-card.component';

@Component({
  selector: 'app-ong-details',
  imports: [
    Toast,
    NgIf,
    ProgressSpinner,
    ButtonDirective,
    Ripple,
    Card,
    Divider,
    NgForOf,
    RouterLink,
    EventCardComponent
  ],
  templateUrl: './ong-details.component.html',
  styleUrl: './ong-details.component.css'
})
export class OngDetailsComponent implements OnInit {
  private ongService = inject(OngService);
  private eventService = inject(EventService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);

  ong: OngInterface | null = null;
  events: EventInterface[] = [];
  isLoading: boolean = true;
  eventsLoading: boolean = true;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.loadOngDetails(id);
        this.loadOngEvents(id);
      } else {
        this.router.navigate(['/ongs']);
      }
    });
  }

  /**
   * Load ONG details
   */
  private loadOngDetails(id: string): void {
    this.isLoading = true;

    this.ongService.getOngById(id).subscribe({
      next: (ong) => {
        this.ong = ong;
        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load NGO details'
        });
        this.isLoading = false;
        this.router.navigate(['/ongs']);
      }
    });
  }

  /**
   * Load events for this ONG
   */
  private loadOngEvents(ongId: string): void {
    this.eventsLoading = true;

    this.eventService.getEventsByOng(ongId).subscribe({
      next: (events) => {
        this.events = events;
        this.eventsLoading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load NGO events'
        });
        this.eventsLoading = false;
      }
    });
  }

  /**
   * Navigate to donation page for this ONG
   */
  navigateToDonate(): void {
    if (this.ong) {
      this.router.navigate(['/hairy-paws/donations-register'], { queryParams: { ongId: this.ong.id } });
    }
  }

  /**
   * Navigate to event details
   */
  viewEventDetails(eventId: string): void {
    this.router.navigate(['/hairy-paws/events', eventId]);
  }

  /**
   * Format a simple multiline text with line breaks
   */
  formatTextWithLineBreaks(text: string): string {
    if (!text) return '';
    return text.replace(/\n/g, '<br>');
  }
}


