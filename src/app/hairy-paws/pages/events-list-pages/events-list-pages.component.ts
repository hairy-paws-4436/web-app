import {Component, inject, OnInit} from '@angular/core';
import {EventService} from '../../services/event.service';
import {MessageService} from 'primeng/api';
import {EventInterface} from '../../interfaces/event-interface';
import {Router} from '@angular/router';
import {Toast} from 'primeng/toast';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {InputText} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {DatePicker} from 'primeng/datepicker';
import {Checkbox} from 'primeng/checkbox';
import {SelectButton} from 'primeng/selectbutton';
import {ProgressSpinner} from 'primeng/progressspinner';
import {NgForOf, NgIf} from '@angular/common';
import {EventCardComponent} from '../../components/event-card/event-card.component';

interface FilterOptions {
  searchTerm: string;
  volunteerOnly: boolean;
  dateFilter: Date | null;
  sortBy: string;
}

@Component({
  selector: 'app-events-list-pages',
  imports: [
    Toast,
    ButtonDirective,
    Ripple,
    InputText,
    FormsModule,
    DatePicker,
    Checkbox,
    SelectButton,
    ProgressSpinner,
    NgIf,
    NgForOf,
    EventCardComponent
  ],
  templateUrl: './events-list-pages.component.html',
  styleUrl: './events-list-pages.component.css'
})
export class EventsListPagesComponent implements OnInit {
  private eventService = inject(EventService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  events: EventInterface[] = [];
  filteredEvents: EventInterface[] = [];
  isLoading: boolean = true;

  // Filter options
  filterOptions: FilterOptions = {
    searchTerm: '',
    volunteerOnly: false,
    dateFilter: null,
    sortBy: 'date'
  };

  // Sort options
  sortOptions = [
    { label: 'Date (Nearest)', value: 'date' },
    { label: 'A-Z', value: 'title' }
  ];

  ngOnInit(): void {
    this.loadEvents();
  }

  /**
   * Load all events
   */
  loadEvents(): void {
    this.isLoading = true;

    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load events'
        });
        this.isLoading = false;
      }
    });
  }

  /**
   * Apply filters to events
   */
  applyFilters(): void {
    let filtered = [...this.events];

    // Filter by search term
    if (this.filterOptions.searchTerm) {
      const term = this.filterOptions.searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term)
      );
    }

    // Filter volunteer events only
    if (this.filterOptions.volunteerOnly) {
      filtered = filtered.filter(event => event.isVolunteerEvent);
    }

    // Filter by date
    if (this.filterOptions.dateFilter) {
      const filterDate = new Date(this.filterOptions.dateFilter);
      filterDate.setHours(0, 0, 0, 0);

      filtered = filtered.filter(event => {
        const eventDate = new Date(event.eventDate);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate.getTime() === filterDate.getTime();
      });
    }

    // Sort events
    this.sortEvents(filtered);

    this.filteredEvents = filtered;
  }

  /**
   * Sort events based on selected sort option
   */
  private sortEvents(events: EventInterface[]): void {
    if (this.filterOptions.sortBy === 'date') {
      events.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
    } else if (this.filterOptions.sortBy === 'title') {
      events.sort((a, b) => a.title.localeCompare(b.title));
    }
  }

  /**
   * Filter events on search input
   */
  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.filterOptions.searchTerm = target.value;
    this.applyFilters();
  }

  /**
   * Toggle volunteer events filter
   */
  onVolunteerFilterChange(): void {
    this.applyFilters();
  }

  /**
   * Apply date filter
   */
  onDateFilterChange(): void {
    this.applyFilters();
  }

  /**
   * Change sort option
   */
  onSortChange(): void {
    this.applyFilters();
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.filterOptions = {
      searchTerm: '',
      volunteerOnly: false,
      dateFilter: null,
      sortBy: 'date'
    };

    this.applyFilters();
  }

  /**
   * Navigate to event details
   */
  viewEventDetails(eventId: string): void {
    this.router.navigate(['/hairy-paws/events', eventId]);
  }

  /**
   * Navigate to create event page
   */
  navigateToCreateEvent(): void {
    this.router.navigate(['/hairy-paws/event-register']);
  }
}

