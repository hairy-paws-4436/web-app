import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { TabViewModule } from 'primeng/tabview';
import { SkeletonModule } from 'primeng/skeleton';
import { AvatarModule } from 'primeng/avatar';

import {Ripple} from 'primeng/ripple';
import {GamificationService} from '../../services/gamification/gamification-service.service';
import {LeaderboardInterface} from '../../interfaces/gamification/ong-stats-interface';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-leaderboard-page',
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
    InputTextModule,
    DividerModule,
    TabViewModule,
    SkeletonModule,
    AvatarModule,
    Ripple,
    FormsModule
  ],
  providers: [MessageService],
  templateUrl: './leaderboard-page.component.html',
  styleUrls: ['./leaderboard-page.component.css']
})
export class LeaderboardPageComponent implements OnInit {
  private gamificationService = inject(GamificationService);
  private messageService = inject(MessageService);

  isLoading = false;
  leaderboard: LeaderboardInterface[] = [];
  topPerformers: LeaderboardInterface[] = [];
  paginatedLeaderboard: LeaderboardInterface[] = [];

  currentPage = 0;
  pageSize = 10;

  // Filter options
  selectedTimeframe = 'monthly';
  timeframeOptions = [
    { label: 'This Month', value: 'monthly' },
    { label: 'This Week', value: 'weekly' },
    { label: 'All Time', value: 'all' }
  ];

  ngOnInit(): void {
    this.loadLeaderboard();
  }

  loadLeaderboard(): void {
    this.isLoading = true;

    // Load main leaderboard
    this.gamificationService.getLeaderboard(this.selectedTimeframe, 50).subscribe({
      next: (leaderboard) => {
        this.leaderboard = leaderboard;
        this.updatePagination();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Loading Error',
          detail: error || 'Failed to load leaderboard'
        });
      }
    });

    // Load top performers
    this.gamificationService.getCommunityTopPerformers().subscribe({
      next: (topPerformers) => {
        this.topPerformers = topPerformers.slice(0, 6);
      },
      error: (error) => {
        console.error('Failed to load top performers:', error);
        // Fallback to top 6 from main leaderboard
        this.topPerformers = this.leaderboard.slice(0, 6);
      }
    });
  }

  onTimeframeChange(): void {
    this.currentPage = 0;
    this.loadLeaderboard();
  }

  updatePagination(): void {
    const startIndex = 0;
    const endIndex = (this.currentPage + 1) * this.pageSize;
    this.paginatedLeaderboard = this.leaderboard.slice(startIndex, endIndex);
  }

  loadMore(): void {
    this.currentPage++;
    this.updatePagination();
  }

  hasMoreEntries(): boolean {
    return (this.currentPage + 1) * this.pageSize < this.leaderboard.length;
  }

  // Helper methods
  getOngInitials(name: string): string {
    return name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase();
  }

  getCrownClass(index: number): string {
    switch (index) {
      case 0: return 'gold';
      case 1: return 'silver';
      case 2: return 'bronze';
      default: return '';
    }
  }

  getRankClass(rank: number): string {
    return rank <= 3 ? 'top-rank' : '';
  }

  formatPoints(points: number): string {
    if (points >= 1000000) {
      return (points / 1000000).toFixed(1) + 'M';
    } else if (points >= 1000) {
      return (points / 1000).toFixed(1) + 'K';
    }
    return points.toString();
  }

  calculateLevelProgress(points: number, level: number): number {
    // Calculate progress to next level (simplified)
    const pointsForCurrentLevel = this.getPointsForLevel(level - 1);
    const pointsForNextLevel = this.getPointsForLevel(level);

    if (pointsForNextLevel === pointsForCurrentLevel) return 100;

    return ((points - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)) * 100;
  }

  private getPointsForLevel(level: number): number {
    const levels = [0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 12000, 20000];
    return levels[level] || 20000;
  }
}
