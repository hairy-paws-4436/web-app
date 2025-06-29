import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { TabViewModule } from 'primeng/tabview';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import {Ripple} from 'primeng/ripple';
import {BadgeInterface, OngStatsInterface} from '../../interfaces/gamification/ong-stats-interface';
import {GamificationService} from '../../services/gamification/gamification-service.service';

@Component({
  selector: 'app-badges-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    BadgeModule,
    ToastModule,
    ProgressSpinnerModule,
    TagModule,
    DataViewModule,
    DropdownModule,
    ProgressBarModule,
    TabViewModule,
    DividerModule,
    SkeletonModule,
    TooltipModule,
    DialogModule,
    Ripple
  ],
  providers: [MessageService],
  templateUrl: './badges-page.component.html',
  styleUrls: ['./badges-page.component.css']
})
export class BadgesPageComponent implements OnInit {
  private gamificationService = inject(GamificationService);
  private messageService = inject(MessageService);

  isLoading = false;
  ongStats: OngStatsInterface | null = null;
  availableBadges: BadgeInterface[] = [];
  filteredBadges: BadgeInterface[] = [];
  featuredBadges: BadgeInterface[] = [];

  // Dialog
  showBadgeDialog = false;
  selectedBadge: BadgeInterface | null = null;

  // Filters
  selectedRarityFilter = '';
  selectedCategoryFilter = '';
  rarityFilterOptions = [
    { label: 'All Rarities', value: '' },
    { label: 'Common', value: 'common' },
    { label: 'Rare', value: 'rare' },
    { label: 'Epic', value: 'epic' },
    { label: 'Legendary', value: 'legendary' }
  ];
  categoryFilterOptions = [
    { label: 'All Categories', value: '' },
    { label: 'Adoption', value: 'adoption' },
    { label: 'Community', value: 'community' },
    { label: 'Milestone', value: 'milestone' },
    { label: 'Special', value: 'special' }
  ];

  ngOnInit(): void {
    this.loadBadges();
  }

  loadBadges(): void {
    this.isLoading = true;

    // Load ONG stats (which includes recent achievements)
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
          detail: error || 'Failed to load stats'
        });
      }
    });

    // Load available badges
    this.gamificationService.getAvailableBadges().subscribe({
      next: (badges) => {
        this.availableBadges = badges;
        this.filteredBadges = badges;

        // Set featured badges (earned badges with progress)
        this.featuredBadges = badges.filter(b => b.earnedAt || b.progress).slice(0, 3);
      },
      error: (error) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Loading Error',
          detail: error || 'Failed to load badges'
        });
      }
    });
  }

  applyFilters(): void {
    this.filteredBadges = this.availableBadges.filter(badge => {
      const rarityMatch = !this.selectedRarityFilter || badge.rarity === this.selectedRarityFilter;
      const categoryMatch = !this.selectedCategoryFilter || badge.category === this.selectedCategoryFilter;
      return rarityMatch && categoryMatch;
    });
  }

  clearFilters(): void {
    this.selectedRarityFilter = '';
    this.selectedCategoryFilter = '';
    this.filteredBadges = this.availableBadges;
  }

  showBadgeDetails(badge: BadgeInterface): void {
    this.selectedBadge = badge;
    this.showBadgeDialog = true;
  }

  setAsFeatured(badge: BadgeInterface): void {
    if (!badge.earnedAt) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cannot Feature',
        detail: 'You can only feature badges you have earned'
      });
      return;
    }

    // This would call the API to update featured badges
    this.messageService.add({
      severity: 'success',
      summary: 'Badge Featured',
      detail: `"${badge.name}" is now featured on your profile`
    });

    this.showBadgeDialog = false;
  }

  switchToMyBadges(): void {
    // Switch to the first tab (My Badges)
    // This would require accessing the TabView component reference
  }

  // Helper methods
  getEarnedCount(): number {
    return this.availableBadges.filter(b => b.earnedAt).length;
  }

  getInProgressCount(): number {
    return this.availableBadges.filter(b => !b.earnedAt && b.progress).length;
  }

  getBadgeRarityClass(rarity: string): string {
    return rarity.toLowerCase();
  }

  getRaritySeverity(rarity: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
    switch (rarity.toLowerCase()) {
      case 'common': return 'secondary';
      case 'rare': return 'info';
      case 'epic': return 'warn';
      case 'legendary': return 'danger';
      default: return 'secondary';
    }
  }

  getBadgeTooltip(badge: BadgeInterface): string {
    if (badge.earnedAt) {
      return `Earned on ${this.formatDate(badge.earnedAt)}`;
    } else if (badge.progress) {
      return `Progress: ${badge.progress.current}/${badge.progress.target}`;
    } else {
      return 'Not started yet';
    }
  }

  getProgressPercentage(progress: { current: number | string; target: number }): number {
    const current = typeof progress.current === 'string' ? parseFloat(progress.current) : progress.current;
    return Math.round((current / progress.target) * 100);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatDetailedDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
