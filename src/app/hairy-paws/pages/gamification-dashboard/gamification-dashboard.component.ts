import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';
import { DataViewModule } from 'primeng/dataview';
import { PaginatorModule } from 'primeng/paginator';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { TabViewModule } from 'primeng/tabview';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import {Ripple} from 'primeng/ripple';
import {GamificationService} from '../../services/gamification/gamification-service.service';
import {LeaderboardInterface, OngStatsInterface} from '../../interfaces/gamification/ong-stats-interface';

@Component({
  selector: 'app-gamification-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CardModule,
    ButtonModule,
    ProgressBarModule,
    ToastModule,
    ProgressSpinnerModule,
    BadgeModule,
    TagModule,
    ChartModule,
    DataViewModule,
    PaginatorModule,
    InputNumberModule,
    DialogModule,
    DividerModule,
    TabViewModule,
    SkeletonModule,
    TooltipModule,
    Ripple
  ],
  providers: [MessageService],
  templateUrl: "./gamification-dashboard.component.html",
  styleUrl: "./gamification-dashboard.component.css",
})
export class GamificationDashboardComponent implements OnInit {
  private gamificationService = inject(GamificationService);
  private messageService = inject(MessageService);

  isLoading = false;
  isSettingGoal = false;
  showGoalDialog = false;
  newMonthlyGoal = 10;

  ongStats: OngStatsInterface | null = null;
  leaderboard: LeaderboardInterface[] = [];

  // Chart data
  chartData: any = {};
  chartOptions: any = {};

  ngOnInit(): void {
    this.loadDashboardData();
    this.setupChart();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // Load ONG stats
    this.gamificationService.getMyOngStats().subscribe({
      next: (stats) => {
        this.ongStats = stats;
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

    // Load leaderboard preview
    this.gamificationService.getLeaderboard('monthly', 10).subscribe({
      next: (leaderboard) => {
        this.leaderboard = leaderboard;
      },
      error: (error) => {
        console.error('Failed to load leaderboard:', error);
      }
    });
  }

  setupChart(): void {
    // Sample data for monthly progress chart
    this.chartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Points Earned',
          data: [120, 190, 300, 250, 420, 350],
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Adoptions',
          data: [5, 8, 12, 10, 18, 15],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
          yAxisID: 'y1'
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Month'
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Points'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Adoptions'
          },
          grid: {
            drawOnChartArea: false,
          },
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    };
  }

  // Helper methods for stats display (updated to use new data structure)
  getLevelProgress(): number {
    if (!this.ongStats) return 0;
    const currentPoints = this.ongStats.gamification.totalPoints;
    const pointsToNext = this.ongStats.gamification.pointsToNextLevel;
    const currentLevel = this.ongStats.gamification.currentLevel;

    const pointsForCurrentLevel = this.getPointsForLevel(currentLevel - 1);
    const pointsForNextLevel = this.getPointsForLevel(currentLevel);

    if (pointsForNextLevel === pointsForCurrentLevel) return 100;

    return ((currentPoints - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)) * 100;
  }

  getNextLevelPoints(): number {
    if (!this.ongStats) return 0;
    const currentLevel = this.ongStats.gamification.currentLevel;
    return this.getPointsForLevel(currentLevel);
  }

  getPointsToNextLevel(): number {
    if (!this.ongStats) return 0;
    return this.ongStats.gamification.pointsToNextLevel;
  }

  getPointsForLevel(level: number): number {
    const levels = [0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 12000, 20000];
    return levels[level] || 20000;
  }

  getTotalOngs(): number {
    return this.ongStats?.rankingInfo.totalOngs || 1;
  }

  getMonthlyGoalProgress(): number {
    if (!this.ongStats) return 0;
    const target = this.getMonthlyTarget();
    const current = this.ongStats.gamification.monthlyAdoptionsCurrent;
    return target > 0 ? Math.min((current / target) * 100, 100) : 0;
  }

  getMonthlyTarget(): number {
    return this.ongStats?.gamification.monthlyAdoptionGoal || 0;
  }

  // Badge helper methods
  getBadgeRarityClass(rarity: string): string {
    return rarity.toLowerCase();
  }

  // Date formatting
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  // Leaderboard helpers
  getCrownClass(index: number): string {
    switch (index) {
      case 0: return 'gold';
      case 1: return 'silver';
      case 2: return 'bronze';
      default: return '';
    }
  }

  getOngInitials(name: string): string {
    return name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase();
  }

  // Goal setting
  calculateGoalBonus(goal: number): number {
    return goal * 10; // 10 points per adoption goal
  }

  setMonthlyGoal(): void {
    if (!this.newMonthlyGoal || this.newMonthlyGoal < 1) return;

    this.isSettingGoal = true;

    this.gamificationService.setMonthlyGoal(this.newMonthlyGoal).subscribe({
      next: (goal) => {
        this.isSettingGoal = false;
        this.showGoalDialog = false;

        this.messageService.add({
          severity: 'success',
          summary: 'Goal Set',
          detail: `Monthly goal of ${this.newMonthlyGoal} adoptions has been set!`
        });

        // Reload stats to reflect new goal
        this.loadDashboardData();
      },
      error: (error) => {
        this.isSettingGoal = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Goal Setting Failed',
          detail: error || 'Failed to set monthly goal'
        });
      }
    });
  }

  shareAchievement(): void {
    if (!this.ongStats || this.ongStats.recentAchievements.length === 0) {
      this.messageService.add({
        severity: 'info',
        summary: 'No Achievements',
        detail: 'Complete some activities to unlock achievements to share!'
      });
      return;
    }

    const latestAchievement = this.ongStats.recentAchievements[0];
    const shareText = `🏆 Just unlocked "${latestAchievement.title}" on Hairy Paws! Join our community and help pets find loving homes. #HairyPaws #PetAdoption`;

    if (navigator.share) {
      navigator.share({
        title: 'Hairy Paws Achievement',
        text: shareText,
        url: window.location.origin
      }).catch(() => {
        this.fallbackShare(shareText);
      });
    } else {
      this.fallbackShare(shareText);
    }
  }

  private fallbackShare(text: string): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Copied to Clipboard',
          detail: 'Achievement text copied! You can now paste it on social media.'
        });
      });
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Share Text',
        detail: text
      });
    }
  }
}
