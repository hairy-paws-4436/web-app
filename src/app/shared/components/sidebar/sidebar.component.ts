import {Component, computed, inject} from '@angular/core';
import {Ripple} from 'primeng/ripple';
import {StyleClassModule} from 'primeng/styleclass';
import {InputTextModule} from 'primeng/inputtext';
import {BadgeModule} from 'primeng/badge';
import {AuthService} from '../../../auth/services/auth.service';
import {RouterLink, RouterOutlet} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    Ripple,
    StyleClassModule,
    InputTextModule,
    BadgeModule,
    RouterOutlet,
    RouterLink,
    ScrollPanelModule,
    NgIf,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }


  get isOwner (): boolean {
    return this.authService.isOwner();
  }
  get isAdopter (): boolean {
    return this.authService.isAdopter();
  }
  get isONG (): boolean {
    return this.authService.isONG();
  }
}
