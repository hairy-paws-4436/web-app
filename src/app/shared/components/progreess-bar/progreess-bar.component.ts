import { Component, Input } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [ProgressBarModule, DialogModule],
  templateUrl: './progreess-bar.component.html',
  styleUrl: './progreess-bar.component.css'
})
export class ProgressBarComponent {
  @Input() isUploading: boolean = false;
  @Input() uploadProgress: number = 0;
}
