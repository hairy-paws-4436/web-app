import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, Observable, throwError, map} from 'rxjs';

import {returnHeaders} from '../../../shared/models/headers';
import {
  AchievementInterface,
  BadgeInterface,
  GamificationProfileInterface,
  LeaderboardInterface,
  MonthlyGoalInterface,
  OngStatsInterface,
  AvailableBadgesResponse,
  TopPerformersResponse,
  NextBadgeInterface
} from '../../interfaces/gamification/ong-stats-interface';

@Injectable({
  providedIn: 'root'
})
export class GamificationService {
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  // ONG Stats and Profile
  getMyOngStats(): Observable<OngStatsInterface> {
    const url = `${this.baseUrl}/gamification/my-stats`;
    return this.http.get<OngStatsInterface>(url, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getOngPublicProfile(ongId: string): Observable<GamificationProfileInterface> {
    const url = `${this.baseUrl}/gamification/ong/${ongId}/public-profile`;
    return this.http.get<GamificationProfileInterface>(url, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Leaderboard with optional parameters
  getLeaderboard(timeframe?: string, limit?: number): Observable<LeaderboardInterface[]> {
    const url = `${this.baseUrl}/gamification/leaderboard`;
    let params = new HttpParams();

    if (timeframe) {
      params = params.set('timeframe', timeframe);
    }
    if (limit) {
      params = params.set('limit', limit.toString());
    }

    return this.http.get<LeaderboardInterface[]>(url, {
      headers: returnHeaders(),
      params
    }).pipe(
      map(leaderboard => leaderboard.map(entry => ({
        ...entry,
        totalPoints: entry.points, // Map points to totalPoints for compatibility
        monthlyAdoptions: entry.adoptions, // Map adoptions to monthlyAdoptions
        badgeCount: entry.badges ? entry.badges.length : 0
      }))),
      catchError(this.handleError)
    );
  }

  // Badges and Achievements
  getAvailableBadges(): Observable<BadgeInterface[]> {
    const url = `${this.baseUrl}/gamification/badges/available`;
    return this.http.get<AvailableBadgesResponse>(url, { headers: returnHeaders() }).pipe(
      map(response => this.transformBadgesResponse(response)),
      catchError(this.handleError)
    );
  }

  getRecentAchievements(limit?: number): Observable<AchievementInterface[]> {
    const url = `${this.baseUrl}/gamification/achievements/recent`;
    let params = new HttpParams();

    if (limit) {
      params = params.set('limit', limit.toString());
    }

    return this.http.get<{recentAchievements: AchievementInterface[]}>(url, {
      headers: returnHeaders(),
      params
    }).pipe(
      map(response => response.recentAchievements),
      catchError(this.handleError)
    );
  }

  // Top Performers with optional category
  getCommunityTopPerformers(category?: string): Observable<LeaderboardInterface[]> {
    const url = `${this.baseUrl}/gamification/community/top-performers`;
    let params = new HttpParams();

    if (category) {
      params = params.set('category', category);
    }

    return this.http.get<TopPerformersResponse>(url, {
      headers: returnHeaders(),
      params
    }).pipe(
      map(response => {
        // Return monthly top performers, but you could also return allTimeTop based on your needs
        return response.monthlyTop.map(entry => ({
          ...entry,
          totalPoints: entry.points,
          monthlyAdoptions: entry.adoptions,
          badgeCount: entry.badges ? entry.badges.length : 0
        }));
      }),
      catchError(this.handleError)
    );
  }

  // Monthly Goals
  setMonthlyGoal(targetAdoptions: number): Observable<MonthlyGoalInterface> {
    const url = `${this.baseUrl}/gamification/set-monthly-goal`;
    return this.http.post<MonthlyGoalInterface>(url, { targetAdoptions }, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  updateFeaturedBadges(badgeIds: string[]): Observable<BadgeInterface[]> {
    const url = `${this.baseUrl}/gamification/featured-badges`;
    return this.http.put<BadgeInterface[]>(url, { badgeIds }, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Admin functions
  recalculatePoints(): Observable<{ message: string }> {
    const url = `${this.baseUrl}/gamification/admin/recalculate-points`;
    return this.http.post<{ message: string }>(url, {}, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  getGlobalGamificationStats(): Observable<any> {
    const url = `${this.baseUrl}/gamification/admin/global-stats`;
    return this.http.get<any>(url, { headers: returnHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Transform badges response to match frontend interface
  private transformBadgesResponse(response: AvailableBadgesResponse): BadgeInterface[] {
    const badges: BadgeInterface[] = [];

    // Transform nextBadges (badges in progress)
    response.nextBadges.forEach(nextBadge => {
      const badgeKey = nextBadge.badge.toLowerCase();
      const description = response.allBadgeDescriptions[badgeKey];

      if (description) {
        badges.push({
          id: nextBadge.badge,
          name: description.name,
          description: description.description,
          category: this.getBadgeCategory(badgeKey),
          icon: description.icon,
          rarity: this.getBadgeRarity(description.points),
          points: description.points,
          progress: {
            current: nextBadge.current,
            target: nextBadge.target
          }
        });
      }
    });

    // Add all other available badges
    Object.entries(response.allBadgeDescriptions).forEach(([key, description]) => {
      if (!badges.find(b => b.id === key.toUpperCase())) {
        badges.push({
          id: key.toUpperCase(),
          name: description.name,
          description: description.description,
          category: this.getBadgeCategory(key),
          icon: description.icon,
          rarity: this.getBadgeRarity(description.points),
          points: description.points
        });
      }
    });

    return badges;
  }

  // Helper methods
  private getBadgeCategory(badgeKey: string): string {
    if (badgeKey.includes('adoption')) return 'adoption';
    if (badgeKey.includes('event')) return 'community';
    if (badgeKey.includes('donor') || badgeKey.includes('donation')) return 'special';
    if (badgeKey.includes('profile') || badgeKey.includes('active')) return 'milestone';
    return 'achievement';
  }

  private getBadgeRarity(points: number): 'common' | 'rare' | 'epic' | 'legendary' {
    if (points >= 1000) return 'legendary';
    if (points >= 500) return 'epic';
    if (points >= 250) return 'rare';
    return 'common';
  }

  getBadgeCategories(): { value: string; label: string }[] {
    return [
      { value: 'adoption', label: 'Adoptions' },
      { value: 'community', label: 'Community' },
      { value: 'milestone', label: 'Milestones' },
      { value: 'special', label: 'Special Events' },
      { value: 'achievement', label: 'Achievements' }
    ];
  }

  getBadgeRarities(): { value: string; label: string; color: string }[] {
    return [
      { value: 'common', label: 'Common', color: '#6B7280' },
      { value: 'rare', label: 'Rare', color: '#3B82F6' },
      { value: 'epic', label: 'Epic', color: '#8B5CF6' },
      { value: 'legendary', label: 'Legendary', color: '#F59E0B' }
    ];
  }

  getActivityLevels(): { value: string; label: string; description: string }[] {
    return [
      { value: 'bronze', label: 'Bronze', description: '1-10 successful adoptions' },
      { value: 'silver', label: 'Silver', description: '11-25 successful adoptions' },
      { value: 'gold', label: 'Gold', description: '26-50 successful adoptions' },
      { value: 'platinum', label: 'Platinum', description: '51-100 successful adoptions' },
      { value: 'diamond', label: 'Diamond', description: '100+ successful adoptions' }
    ];
  }

  calculateLevel(points: number): number {
    // Level calculation based on points
    if (points < 100) return 1;
    if (points < 250) return 2;
    if (points < 500) return 3;
    if (points < 1000) return 4;
    if (points < 2000) return 5;
    if (points < 3500) return 6;
    if (points < 5500) return 7;
    if (points < 8000) return 8;
    if (points < 12000) return 9;
    return 10;
  }

  getPointsForNextLevel(currentPoints: number): number {
    const levels = [0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 12000, 20000];
    const currentLevel = this.calculateLevel(currentPoints);

    if (currentLevel >= 10) return 0; // Max level reached

    return levels[currentLevel] - currentPoints;
  }

  private handleError(error: any) {
    console.error('An error occurred in GamificationService', error);
    const errorMessage = error?.error?.message || error?.message || 'An unexpected error occurred';
    return throwError(() => errorMessage);
  }
}
