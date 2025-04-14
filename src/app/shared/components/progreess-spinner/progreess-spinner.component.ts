import {Component, Input} from '@angular/core';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {NgIf} from '@angular/common';
import {DialogModule} from 'primeng/dialog';

@Component({
  selector: 'app-progreess-spinner',
  standalone: true,
  imports: [
    ProgressSpinnerModule,
    NgIf,
    DialogModule
  ],
  templateUrl: './progreess-spinner.component.html',
  styleUrl: './progreess-spinner.component.css'
})
export class ProgreessSpinnerComponent {
  @Input() isLoading: boolean = false;
}
