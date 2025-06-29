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
import { ChartModule } from 'primeng/chart';
import { DataViewModule } from 'primeng/dataview';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { TabViewModule } from 'primeng/tabview';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';

import { PostAdoptionService } from '../../services/post-adoption/post-adoption.service';

import {
  FollowupAnalyticsInterface,
  FollowupDashboardInterface,
  FollowupInterface
} from '../../interfaces/post-adoption/followup-interface';
import {Ripple} from 'primeng/ripple';

@Component({
  selector: 'app-followup-dashboard-page',
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
    ChartModule,
    DataViewModule,
    TableModule,
    ProgressBarModule,
    TabViewModule,
    DividerModule,
    SkeletonModule,
    Ripple
  ],
  providers: [MessageService],
  templateUrl: 'followup-dashboard-page.component.html',
  styleUrls: ['./followup-dashboard-page.component.css']
})
export class FollowupDashboardPageComponent implements OnInit {
  private postAdoptionService = inject(PostAdoptionService);
  private messageService = inject(MessageService);

  isLoading = false;
  isSendingReminders = false;
  dashboardData: FollowupDashboardInterface | null = null;
  analyticsData: FollowupAnalyticsInterface | null = null;
  atRiskFollowups: FollowupInterface[] = [];

  // Chart data
  statusChartData: any = {};
  trendChartData: any = {};
  satisfactionTrendData: any = {};
  chartOptions: any = {};
  lineChartOptions: any = {};

  ngOnInit(): void {
    this.loadDashboardData();
    this.setupCharts();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // Load dashboard overview
    this.postAdoptionService.getOngDashboard().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.updateCharts();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Loading Error',
          detail: error || 'Failed to load dashboard data'
        });
      }
    });

    // Load analytics
    this.postAdoptionService.getOngAnalytics().subscribe({
      next: (analytics) => {
        this.analyticsData = analytics;
      },
      error: (error) => {
        console.error('Failed to load analytics:', error);
      }
    });

    // Load at-risk adoptions
    this.postAdoptionService.getAtRiskAdoptions().subscribe({
      next: (atRisk) => {
        this.atRiskFollowups = atRisk;
      },
      error: (error) => {
        console.error('Failed to load at-risk adoptions:', error);
      }
    });
  }

  setupCharts(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    };

    this.lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
  }

  updateCharts(): void {
    if (!this.dashboardData) return;

    // Status distribution chart
    this.statusChartData = {
      labels: ['Completed', 'Pending', 'Overdue'],
      datasets: [{
        data: [
          this.dashboardData.completedFollowups,
          this.dashboardData.pendingFollowups,
          this.dashboardData.overdueFollowups
        ],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0
      }]
    };

    // Trend chart (mock data - would come from analytics)
    this.trendChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Completion Rate %',
        data: [85, 78, 92, 88, 94, 89],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };

    // Satisfaction trend
    if (this.analyticsData) {
      this.satisfactionTrendData = {
        labels: this.analyticsData.satisfactionTrends.byPeriod.map(p => p.period),
        datasets: [{
          label: 'Average Satisfaction Score',
          data: this.analyticsData.satisfactionTrends.byPeriod.map(p => p.score),
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.4,
          fill: true
        }]
      };
    }
  }

  // Helper methods
  getCompletionRate(): number {
    if (!this.dashboardData || this.dashboardData.totalFollowups === 0) return 0;
    return Math.round((this.dashboardData.completedFollowups / this.dashboardData.totalFollowups) * 100);
  }

  getCompletionByType(): { label: string; rate: number }[] {
    if (!this.analyticsData) return [];

    return Object.entries(this.analyticsData.completionRates.byType).map(([type, rate]) => ({
      label: this.getFollowupTypeLabel(type),
      rate: Math.round(rate)
    }));
  }

  getFollowupTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'initial': '48 Hours',
      'week_1': '1 Week',
      'month_1': '1 Month',
      'month_3': '3 Months',
      'month_6': '6 Months',
      'annual': 'Annual'
    };
    return labels[type] || type;
  }

  getMaxIssueFrequency(): number {
    if (!this.analyticsData) return 1;
    const maxBehavioral = Math.max(...this.analyticsData.commonIssues.behavioral.map(i => i.frequency), 0);
    const maxHealth = Math.max(...this.analyticsData.commonIssues.health.map(i => i.frequency), 0);
    return Math.max(maxBehavioral, maxHealth, 1);
  }

  // Activity helpers
  getActivityIcon(type: string): string {
    switch (type) {
      case 'completed': return 'pi pi-check';
      case 'reminder_sent': return 'pi pi-send';
      case 'intervention': return 'pi pi-phone';
      case 'overdue': return 'pi pi-exclamation-triangle';
      default: return 'pi pi-info-circle';
    }
  }

  getActivityIconClass(type: string): string {
    return type;
  }

  getActivityTitle(type: string): string {
    switch (type) {
      case 'completed': return 'Follow-up Completed';
      case 'reminder_sent': return 'Reminder Sent';
      case 'intervention': return 'Intervention Initiated';
      case 'overdue': return 'Follow-up Overdue';
      default: return 'Activity';
    }
  }

  formatRelativeTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  }

  // At-risk helpers
  getPetName(followup: FollowupInterface): string {
    // This would come from the followup data
    return 'Pet Name'; // Placeholder
  }

  getAdopterName(followup: FollowupInterface): string {
    // This would come from the followup data
    return 'Adopter Name'; // Placeholder
  }

  getRiskLevel(followup: FollowupInterface): string {
    // Logic to determine risk level based on followup data
    if (followup.status === 'overdue') return 'High Risk';
    return 'Medium Risk';
  }

  getRiskSeverity(followup: FollowupInterface): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
    if (followup.status === 'overdue') return 'danger';
    return 'warn';
  }

  getRiskIndicators(followup: FollowupInterface): string[] {
    // Logic to determine risk indicators
    const indicators = [];
    if (followup.status === 'overdue') {
      indicators.push('Survey overdue by ' + this.calculateOverdueDays(followup.dueDate) + ' days');
    }
    if (followup.remindersSent > 2) {
      indicators.push('Multiple reminders sent');
    }
    return indicators;
  }

  private calculateOverdueDays(dueDate: string): number {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = now.getTime() - due.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  // Actions
  sendReminders(): void {
    this.isSendingReminders = true;

    // Get overdue followup IDs
    const overdueIds = this.atRiskFollowups
      .filter(f => f.status === 'overdue')
      .map(f => f.id);

    if (overdueIds.length === 0) {
      this.messageService.add({
        severity: 'info',
        summary: 'No Reminders Needed',
        detail: 'No overdue follow-ups found'
      });
      this.isSendingReminders = false;
      return;
    }

    this.postAdoptionService.sendManualReminders(overdueIds).subscribe({
      next: (result) => {
        this.isSendingReminders = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Reminders Sent',
          detail: `${result.sent} reminders sent successfully`
        });
        this.loadDashboardData();
      },
      error: (error) => {
        this.isSendingReminders = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Failed to Send Reminders',
          detail: error || 'Could not send reminders'
        });
      }
    });
  }

  initiateIntervention(followup: FollowupInterface): void {
    // Navigate to intervention form or open modal
    this.messageService.add({
      severity: 'info',
      summary: 'Intervention',
      detail: 'Intervention process would be initiated here'
    });
  }
}
