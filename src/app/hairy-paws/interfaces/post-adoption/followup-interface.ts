// post-adoption/followup-interface.ts
export interface FollowupInterface {
  id: string;
  adoptionId: string;
  scheduledDate: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue' | 'skipped';
  type: 'initial' | 'week_1' | 'month_1' | 'month_3' | 'month_6' | 'annual';
  remindersSent: number;
  completedAt?: string;
  questionnaire?: FollowupQuestionnaireInterface;
}

// post-adoption/followup-questionnaire-interface.ts
export interface FollowupQuestionnaireInterface {
  adaptationLevel: 'excellent' | 'good' | 'fair' | 'poor' | '';
  eatingWell: boolean;
  sleepingWell: boolean;
  usingBathroomProperly: boolean;
  showingAffection: boolean;
  behavioralIssues: string[];
  healthConcerns: string[];
  vetVisitScheduled: boolean;
  vetVisitDate?: string;
  satisfactionScore: number; // 1-10
  wouldRecommend: boolean;
  additionalComments?: string;
  needsSupport: boolean;
  supportType: string[];
}

// post-adoption/followup-dashboard-interface.ts
export interface FollowupDashboardInterface {
  totalFollowups: number;
  completedFollowups: number;
  pendingFollowups: number;
  overdueFollowups: number;
  averageSatisfactionScore: number;
  successfulAdoptions: number;
  atRiskAdoptions: number;
  interventionsNeeded: number;
  monthlyCompletionRate: number;
  recentActivity: FollowupActivityInterface[];
}

// post-adoption/followup-activity-interface.ts
export interface FollowupActivityInterface {
  id: string;
  type: 'completed' | 'reminder_sent' | 'intervention' | 'overdue';
  adoptionId: string;
  petName: string;
  adopterName: string;
  timestamp: string;
  details: string;
}

// post-adoption/followup-analytics-interface.ts
export interface FollowupAnalyticsInterface {
  completionRates: {
    overall: number;
    byType: { [key: string]: number };
    byMonth: { [key: string]: number };
  };
  satisfactionTrends: {
    average: number;
    byPeriod: { period: string; score: number }[];
  };
  commonIssues: {
    behavioral: { issue: string; frequency: number }[];
    health: { issue: string; frequency: number }[];
  };
  interventionSuccess: {
    total: number;
    successful: number;
    rate: number;
  };
}

// post-adoption/adoption-stats-interface.ts
export interface AdoptionStatsInterface {
  totalFollowups: number;
  completionRate: number;
  averageSatisfactionScore: number;
  atRiskAdoptions: number;
  successfulAdoptions: number;
  pendingInterventions: number;
}
