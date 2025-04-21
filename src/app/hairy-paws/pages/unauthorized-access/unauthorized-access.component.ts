import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import {AuthService} from '../../../auth/services/auth.service';

@Component({
  selector: 'app-unauthorized-access',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule],
  templateUrl: './unauthorized-access.component.html',
  styleUrls: ['./unauthorized-access.component.css']
})
export class UnauthorizedAccessComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  messages = [
    "Whoa there, intruder! This isn't the page you're looking for 🕵️",
    "Hold your horses! This territory belongs to someone else 🐎",
    "Access denied! This is private property 🚫",
    "Oops! You seem to have wandered into restricted territory 🗺️",
    "Nice try! But this page isn't yours to explore 🔐",
    "Permission denied! You shall not pass! 🧙‍♂️"
  ];

  funnyMessage: string;

  constructor() {
    this.funnyMessage = this.messages[Math.floor(Math.random() * this.messages.length)];
  }

  goBack(): void {
    if (this.authService.isONG()) {
      this.router.navigate(['/hairy-paws/my-ong']);
    } else if (this.authService.isOwner() || this.authService.isAdopter()) {
      this.router.navigate(['/hairy-paws/pets']);
    } else {
      this.router.navigate(['/']);
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
