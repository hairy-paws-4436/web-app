import { Component, inject, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { KeyFilterModule } from 'primeng/keyfilter';
import { RippleModule } from 'primeng/ripple';
import { TabViewModule } from 'primeng/tabview';
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-twofa-setup',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    DividerModule,
    InputTextModule,
    ToastModule,
    KeyFilterModule,
    RippleModule,
    TabViewModule,
    StepsModule
  ],
  providers: [MessageService],
  templateUrl: './enable2fa.component.html',
  styleUrls: ['./enable2fa.component.css']
})
export class TwofaSetupComponent implements OnInit {
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  @ViewChildren('input1, input2, input3, input4, input5, input6')
  inputFields!: QueryList<ElementRef<HTMLInputElement>>;

  qrCodeDataUrl: string | null = null;
  isLoading = false;
  is2FAEnabled = false;
  currentStep = 0;
  steps: MenuItem[] = [];
  userId: string | null = null;

  regexNum: RegExp = /^\d+$/;

  ngOnInit(): void {
    this.steps = [
      { label: 'Enable 2FA' },
      { label: 'Scan QR Code' },
      { label: 'Verify Code' },
      { label: 'Complete' }
    ];

    this.check2FAStatus();
    this.getUserId();
  }

  private getUserId(): void {
    this.authService.getAuthenticatedUserId().subscribe({
      next: (userId) => {
        this.userId = userId;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to get user ID. 2FA verification might not work properly.'
        });
      }
    });
  }

  private check2FAStatus(): void {
    this.isLoading = true;
    this.authService.get2FAStatus().subscribe({
      next: (enabled) => {
        this.is2FAEnabled = enabled;
        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to check 2FA status'
        });
        this.isLoading = false;
      }
    });
  }

  enable2FA(): void {
    this.isLoading = true;
    this.authService.enable2FA().subscribe({
      next: (qrCodeDataUrl) => {
        this.qrCodeDataUrl = qrCodeDataUrl;
        this.isLoading = false;
        this.currentStep = 1;
        this.messageService.add({
          severity: 'info',
          summary: 'Action Required',
          detail: 'Scan the QR code with your authenticator app and enter the verification code'
        });

        if (!this.userId) {
          this.getUserId();
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to enable 2FA: ' + error
        });
        this.isLoading = false;
      }
    });
  }



  verifyCode(): void {
    const code = this.getCodeFromInputs();

    if (code.length !== 6) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter a 6-digit code'
      });
      return;
    }

    if (!this.userId) {
      // If we still don't have the user ID, try to get it once more
      this.messageService.add({
        severity: 'info',
        summary: 'Retrieving User ID',
        detail: 'Getting your user ID before verifying the code...'
      });

      this.authService.getAuthenticatedUserId().subscribe({
        next: (userId) => {
          this.userId = userId;
          this.proceedWithVerification(code);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to get user ID. Cannot verify 2FA code.'
          });
        }
      });
      return;
    }

    this.proceedWithVerification(code);
  }

  private proceedWithVerification(code: string): void {
    if (!this.userId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'User ID not available. Cannot verify 2FA code.'
      });
      return;
    }

    this.isLoading = true;


    this.authService.verifyTwoFactorCode(this.userId, code).subscribe({
      next: (success) => {
        if (success) {
          this.currentStep = 3;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: '2FA has been enabled successfully'
          });

          // Logout after 3 seconds
          setTimeout(() => {
            this.messageService.add({
              severity: 'info',
              summary: 'Logging out',
              detail: 'You will be logged out to complete 2FA setup'
            });

            setTimeout(() => {
              this.authService.logout();
            }, 2000);
          }, 3000);
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Verification Error',
          detail: error || 'Failed to verify code'
        });
        this.isLoading = false;
      }
    });
  }

  focus(event: KeyboardEvent, input?: HTMLInputElement) {
    const ok = this.regexNum.test(event.key);
    if (ok && input) {
      input.focus();
    }
  }

  getCodeFromInputs(): string {
    const code = this.inputFields.toArray().map(input => input.nativeElement.value).join('');
    return code;
  }

  resetInputs() {
    this.inputFields.toArray().forEach(input => input.nativeElement.value = '');
    this.inputFields.first?.nativeElement.focus();
  }

  nextStep() {
    this.currentStep++;
  }

  prevStep() {
    this.currentStep--;
  }

  restart() {
    this.currentStep = 0;
    this.qrCodeDataUrl = null;
    this.resetInputs();
  }

  cancel() {
    this.restart();
  }
}

