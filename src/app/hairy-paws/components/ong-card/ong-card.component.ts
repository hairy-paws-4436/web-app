import {Component, EventEmitter, Input, Output} from '@angular/core';
import {OngInterface} from '../../interfaces/ong-interface';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';

@Component({
  selector: 'app-ong-card',
  imports: [
    ButtonDirective,
    Ripple
  ],
  templateUrl: './ong-card.component.html',
  styleUrl: './ong-card.component.css'
})
export class OngCardComponent {
  @Input() ong!: OngInterface;

  @Output() viewDetailsClick = new EventEmitter<void>();
  @Output() donateClick = new EventEmitter<void>();

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
    this.viewDetailsClick.emit();
  }

  /**
   * Handle donate button click
   */
  onDonate(): void {
    this.donateClick.emit();
  }
}
