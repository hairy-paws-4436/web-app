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
import { PrimeTemplate, MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Toast } from 'primeng/toast';

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
    Toast,
  ],
  templateUrl: './twofa-page.component.html',
  styleUrl: './twofa-page.component.css',
  providers: [MessageService] // Añadimos MessageService como proveedor
})
export class TwofaPageComponent {
  @Input() visible: boolean = false;
  @Input() userId: string = '';
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() verificationComplete = new EventEmitter<void>();
  @Output() onShow = new EventEmitter<void>();

  @ViewChildren('input1, input2, input3, input4, input5, input6') inputFields!: QueryList<ElementRef<HTMLInputElement>>;

  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

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
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No user ID found for verification'
      });
      return;
    }

    const code = this.getCodeFromInputs();

    if (code.length !== 6) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter a 6-digit code'
      });
      return;
    }

    this.authService.verifyTwoFactorCode(this.userId, code).subscribe({
      next: (response) => {
        this.closeDialog();
        this.verificationComplete.emit();
        this.router.navigateByUrl('/hairy-paws');
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Verification completed successfully'
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Verification Error',
          detail: err.message || 'Failed to verify code'
        });
      }
    });
  }

  onDialogShow() {
    setTimeout(() => {
      this.inputFields.first?.nativeElement.focus();
      this.onShow.emit();
    }, 50);
  }
}
