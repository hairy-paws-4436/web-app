import {Component, computed, effect, inject} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {NgIf} from '@angular/common';
import {Dialog} from 'primeng/dialog';
import {PrimeTemplate} from 'primeng/api';
import {ButtonDirective} from 'primeng/button';
import {AuthService} from './auth/services/auth.service';
import {AuthStatusEnum} from './auth/enums/status-enum';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgIf, Dialog, PrimeTemplate, ButtonDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  public finishedAuthCheck = computed<boolean>(() => {
    return this.authService.authStatus() !== AuthStatusEnum.checking;
  });

  public sessionExpired = computed<boolean>(() => this.authService.sessionExpired());

  constructor() {
    effect(() => {
      if (this.sessionExpired()) {
        console.log('Sesión expirada, mostrando diálogo');
      }
    });
  }

  ngOnInit(): void {}

  onCloseDialog() {
    this.authService.sessionExpired.set(false);
    this.authService.logout();
  }
}
