// Updated interfaces to match your backend response structure

export interface OngStatsInterface {
  gamification: {
    id: string;
    ongId: string;
    totalPoints: number;
    monthlyPoints: number;
    weeklyPoints: number;
    currentLevel: number;
    pointsToNextLevel: number;
    globalRank: number;
    regionalRank: number;
    totalAdoptionsFacilitated: number;
    animalsPublished: number;
    eventsOrganized: number;
    donationsReceived: string;
    profileCompletionPercentage: number;
    responseTimeHours: number | null;
    adoptionSuccessRate: string;
    currentStreakDays: number;
    longestStreakDays: number;
    lastActivityDate: string | null;
    earnedBadges: any[];
    featuredBadges: any[] | null;
    monthlyRecognitionCount: number;
    communityVotes: number;
    testimonialsReceived: number;
    monthlyAdoptionGoal: number | null;
    monthlyAdoptionsCurrent: number;
    goalCompletionPercentage: string;
    partnerOngsCount: number;
    crossPromotionsCount: number;
    socialMediaMentions: number;
    volunteerHoursGenerated: string;
    lastPointsCalculation: string | null;
    weeklyResetDate: string | null;
    monthlyResetDate: string | null;
    createdAt: string;
    updatedAt: string;
  };
  recentAchievements: AchievementInterface[];
  nextBadges: NextBadgeInterface[];
  rankingInfo: {
    globalRank: number;
    monthlyRank: number;
    totalOngs: number;
  };
}

export interface NextBadgeInterface {
  badge: string;
  current: number | string;
  target: number;
  progress: number;
}

export interface BadgeInterface {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  earnedAt?: string;
  progress?: {
    current: number | string;
    target: number;
  };
}

export interface AchievementInterface {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlockedAt: string;
  category: string;
}

export interface LeaderboardInterface {
  rank: number;
  ongId: string;
  ongName: string;
  ongLogo?: string;
  points: number; // Changed from totalPoints to match backend
  level: number;
  badges: any[];
  adoptions: number; // Changed from monthlyAdoptions to match backend
  badgeCount?: number; // Will be calculated from badges array
  isCurrentUser?: boolean;
}

export interface GamificationProfileInterface {
  level: number;
  totalPoints: number;
  totalAdoptions: number;
  eventsOrganized: number;
  featuredBadges: any[];
  monthlyRank: number;
  globalRank: number;
  currentStreak: number;
}

export interface MonthlyGoalInterface {
  id: string;
  ongId: string;
  month: string;
  year: number;
  targetAdoptions: number;
  currentAdoptions: number;
  pointsReward: number;
  status: 'active' | 'completed' | 'failed';
  completedAt?: string;
}

export interface AvailableBadgesResponse {
  nextBadges: NextBadgeInterface[];
  allBadgeDescriptions: Record<string, BadgeDescriptionInterface>;
}

export interface BadgeDescriptionInterface {
  name: string;
  description: string;
  icon: string;
  points: number;
}

export interface TopPerformersResponse {
  monthlyTop: LeaderboardInterface[];
  allTimeTop: LeaderboardInterface[];
  category: string;
}
