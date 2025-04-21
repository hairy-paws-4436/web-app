import {Component, computed, inject, OnInit} from '@angular/core';
import {Ripple} from 'primeng/ripple';
import {StyleClassModule} from 'primeng/styleclass';
import {InputTextModule} from 'primeng/inputtext';
import {BadgeModule} from 'primeng/badge';
import {AuthService} from '../../../auth/services/auth.service';
import {RouterLink, RouterOutlet} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {NgIf} from '@angular/common';
import {OngService} from '../../../hairy-paws/services/ong/ong.service';
import {MessageService} from 'primeng/api';

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
export class SidebarComponent implements OnInit {
  private authService = inject(AuthService);
  private ongService = inject(OngService);

  isOwner = false;
  isAdopter = false;
  isONG = false;
  isAdmin = false;
  hasOng = false;

  ngOnInit(): void {
    this.updateRoles();
    if (this.authService.isONG()) {
      this.checkHasOng();
    }
  }

  private updateRoles(): void {
    this.isOwner = this.authService.isOwner();
    this.isAdopter = this.authService.isAdopter();
    this.isONG = this.authService.isONG();
    this.isAdmin = this.authService.isAdmin();
  }

  private checkHasOng(): void {
    this.ongService.getMyOng().subscribe({
      next: () => {
        this.hasOng = true;
      },
      error: () => {
        this.hasOng = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
