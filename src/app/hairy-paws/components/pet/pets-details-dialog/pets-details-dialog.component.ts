import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Button, ButtonDirective} from 'primeng/button';
import { PetInterface } from '../../../interfaces/pet/pet-interface';
import {NgIf, TitleCasePipe} from '@angular/common';
import {Tag} from 'primeng/tag';
import {Ripple} from 'primeng/ripple';
import {Dialog} from 'primeng/dialog';

@Component({
  selector: 'app-pets-details-dialog',
  imports: [
    Button,
    NgIf,
    TitleCasePipe,
    Tag,
    ButtonDirective,
    Ripple,
    Dialog
  ],
  templateUrl: './pets-details-dialog.component.html',
  styleUrl: './pets-details-dialog.component.css'
})
export class PetsDetailsDialogComponent {
  @Input() visible: boolean = false;
  @Input() pet: PetInterface | null = null;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() adoptionRequested = new EventEmitter<PetInterface>();

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }
  getGender(gender: string): string {
    return gender === 'male' ? 'Male' : 'Female';
  }
}
