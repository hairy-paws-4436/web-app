import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { TimelineModule } from 'primeng/timeline';
import { SkeletonModule } from 'primeng/skeleton';

import { PostAdoptionService } from '../../services/post-adoption/post-adoption.service';
import { FollowupInterface } from '../../interfaces/post-adoption/followup-interface';
import {Ripple} from 'primeng/ripple';

@Component({
  selector: 'app-my-followups-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardModule,
    ButtonModule,
    BadgeModule,
    ToastModule,
    ProgressSpinnerModule,
    TagModule,
    DataViewModule,
    DropdownModule,
    CalendarModule,
    DividerModule,
    TimelineModule,
    SkeletonModule,
    Ripple
  ],
  providers: [MessageService],
  templateUrl: 'my-followups-page.component.html',
  styleUrl: 'my-followups-page.component.css',
})
export class MyFollowupsPageComponent implements OnInit {
  private postAdoptionService = inject(PostAdoptionService);
  private messageService = inject(MessageService);

  isLoading = false;
  followups: FollowupInterface[] = [];
  sortedFollowups: FollowupInterface[] = [];

  ngOnInit(): void {
    this.loadFollowups();
  }

  loadFollowups(): void {
    this.isLoading = true;

    this.postAdoptionService.getMyFollowups().subscribe({
      next: (followups) => {
        this.followups = followups;
        this.sortFollowups();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Loading Error',
          detail: error || 'Failed to load follow-ups'
        });
      }
    });
  }

  private sortFollowups(): void {
    // Sort by due date, with pending/overdue first
    this.sortedFollowups = [...this.followups].sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status === 'overdue' && b.status !== 'overdue') return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }

  // Summary calculations
  getTotalFollowups(): number {
    return this.followups.length;
  }

  getPendingCount(): number {
    return this.followups.filter(f => f.status === 'pending').length;
  }

  getCompletedCount(): number {
    return this.followups.filter(f => f.status === 'completed').length;
  }

  getOverdueCount(): number {
    return this.followups.filter(f => f.status === 'overdue').length;
  }

  // UI helper methods
  getFollowupTitle(type: string): string {
    const titles: { [key: string]: string } = {
      'initial': '48 Hour Check-in',
      'week_1': '1 Week Follow-up',
      'month_1': '1 Month Follow-up',
      'month_3': '3 Month Follow-up',
      'month_6': '6 Month Follow-up',
      'annual': 'Annual Check-up'
    };
    return titles[type] || type;
  }

  getFollowupDescription(type: string): string {
    const descriptions: { [key: string]: string } = {
      'initial': 'Let us know how the first days are going with your new pet.',
      'week_1': 'Share how your pet is adapting after the first week.',
      'month_1': 'Tell us about your first month together and any challenges.',
      'month_3': 'Update us on your pet\'s progress and your experience.',
      'month_6': 'Share how things are going after six months.',
      'annual': 'Annual check-in to see how you and your pet are doing.'
    };
    return descriptions[type] || 'Follow-up survey to check on your pet\'s wellbeing.';
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'completed': return 'pi pi-check';
      case 'pending': return 'pi pi-clock';
      case 'overdue': return 'pi pi-exclamation-triangle';
      case 'skipped': return 'pi pi-times';
      default: return 'pi pi-question';
    }
  }

  getMarkerClass(status: string): string {
    return status;
  }

  getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warn';
      case 'overdue': return 'danger';
      case 'skipped': return 'secondary';
      default: return 'info';
    }
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  remindLater(followup: FollowupInterface): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Reminder Set',
      detail: 'We\'ll remind you about this survey in a few days.'
    });
  }
}
