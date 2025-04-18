import {Component, EventEmitter, Input, Output} from '@angular/core';
import {EventInterface} from '../../interfaces/event-interface';
import {Tag} from 'primeng/tag';
import {NgIf} from '@angular/common';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';

@Component({
  selector: 'app-event-card',
  imports: [
    Tag,
    NgIf,
    ButtonDirective,
    Ripple
  ],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css'
})
export class EventCardComponent {
  @Input() event!: EventInterface;

  @Output() viewDetails = new EventEmitter<void>();

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };

    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  /**
   * Get month in short format (e.g. "Jan")
   */
  getMonthShort(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { month: 'short' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  /**
   * Get day of month (e.g. "15")
   */
  getDayOfMonth(dateString: string): number {
    return new Date(dateString).getDate();
  }

  /**
   * Check if event is in the past
   */
  isPastEvent(): boolean {
    const eventDate = new Date(this.event.eventDate);
    return eventDate < new Date();
  }

  /**
   * Truncate text to a specific length and add ellipsis
   */
  truncateText(text: string, maxLength: number = 100): string {
    if (!text) return '';

    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  }

  /**
   * Handle view details button click
   */
  onViewDetails(): void {
    this.viewDetails.emit();
  }
}
