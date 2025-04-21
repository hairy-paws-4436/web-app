import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

import { LoginRequestInterface } from '../../interfaces/request/login-request-interface';
import { TwofaPageComponent } from '../twofa-page/twofa-page.component';
import {LoginResponseInterface} from '../../interfaces/response/login-response-interface';
import {FormsModule} from '@angular/forms';
import {Checkbox} from 'primeng/checkbox';
import {Divider} from 'primeng/divider';
import {ButtonDirective} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {InputText} from 'primeng/inputtext';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    TwofaPageComponent,
    FormsModule,
    Checkbox,
    Divider,
    ButtonDirective,
    Ripple,
    InputText,
    RouterLink,
    /* tus imports */],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  twoFaDialogVisible = false;
  userId: string | undefined = '';

  loginRequest: LoginRequestInterface = {
    email: '',
    password: '',
  };

  login() {
    if (!this.loginRequest?.email || !this.loginRequest?.password) {
      this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'Please complete all fields' });
      return;
    }

    this.authService.login(this.loginRequest).subscribe({
      next: (response: LoginResponseInterface) => {
        if (response.requiresTwoFactor && response.userId) {
          this.twoFaDialogVisible = true;
          this.userId = response.userId;
        } else if (response.access_token && response.user) {
          this.authService.setAuthentication(response.access_token, response.user.role);
          this.router.navigateByUrl('/hairy-paws');
          this.messageService.add({ severity: 'success', summary: 'Login Successful', detail: 'Welcome to Hairy Paws!' });
        }
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Login Error', detail: error.message });
      }
    });
  }

  onVerificationComplete() {
    this.twoFaDialogVisible = false;
    this.router.navigateByUrl('/hairy-paws');
  }

  onDialogShow() {
    setTimeout(() => {
      const firstInput = document.querySelector('input') as HTMLInputElement;
      firstInput?.focus();
    }, 50);
  }

}
