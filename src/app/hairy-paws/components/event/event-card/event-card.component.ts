import {Component, EventEmitter, Input, Output} from '@angular/core';
import {EventInterface} from '../../../interfaces/event/event-interface';
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

  getMonthShort(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { month: 'short' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  getDayOfMonth(dateString: string): number {
    return new Date(dateString).getDate();
  }

  isPastEvent(): boolean {
    const eventDate = new Date(this.event.eventDate);
    return eventDate < new Date();
  }

  truncateText(text: string, maxLength: number = 100): string {
    if (!text) return '';

    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  }

  onViewDetails(): void {
    this.viewDetails.emit();
  }
}
