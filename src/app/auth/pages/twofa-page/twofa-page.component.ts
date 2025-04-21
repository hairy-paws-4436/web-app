import {
  Component,
  inject,
  Input,
  ElementRef,
  QueryList,
  ViewChildren,
  EventEmitter,
  Output
} from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { KeyFilter } from 'primeng/keyfilter';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { PrimeTemplate } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-twofa-page',
  standalone: true,
  imports: [
    Dialog,
    InputText,
    KeyFilter,
    ButtonDirective,
    Ripple,
    PrimeTemplate,
  ],
  templateUrl: './twofa-page.component.html',
  styleUrl: './twofa-page.component.css'
})
export class TwofaPageComponent {
  @Input() visible: boolean = false;
  @Input() userId: string = '';
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() verificationComplete = new EventEmitter<void>();

  @ViewChildren('input1, input2, input3, input4, input5, input6') inputFields!: QueryList<ElementRef<HTMLInputElement>>;

  private authService = inject(AuthService);
  private router = inject(Router);

  regexNum: RegExp = /^\d+$/;

  focus(event: KeyboardEvent, input?: HTMLInputElement) {
    const ok = this.regexNum.test(event.key);
    if (ok && input) {
      input.focus();
    }
  }


  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.resetInputs();
  }

  resetInputs() {
    this.inputFields.toArray().forEach(input => input.nativeElement.value = '');
  }

  getCodeFromInputs(): string {
    const code = this.inputFields.toArray().map(input => input.nativeElement.value).join('');
    return code;
  }

  submitCode() {
    if (!this.userId) {
      Swal.fire('Error', 'No user ID found for verification', 'error').then();
      return;
    }

    const code = this.getCodeFromInputs();

    if (code.length !== 6) {
      Swal.fire('Error', 'Please enter a 6-digit code', 'error');
      return;
    }

    this.authService.verifyTwoFactorCode(this.userId, code).subscribe({
      next: (response) => {
        this.closeDialog();
        this.verificationComplete.emit();
        this.router.navigateByUrl('/hairy-paws');
      },
      error: (err) => {
        Swal.fire('Error', err, 'error');
      }
    });
  }
  onDialogShow() {
    setTimeout(() => {
      this.inputFields.first?.nativeElement.focus();
    }, 50);
  }

}
