export interface NotificationInterface {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
  referenceId: string;
  referenceType: 'adoption' | 'donation' | 'visit';
}

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  GENERAL = 'general',
  ADOPTION_REQUEST = 'adoption_request',
  ADOPTION_APPROVED = 'adoption_approved',
  ADOPTION_REJECTED = 'adoption_rejected',
  VISIT_REQUEST = 'visit_request',
  VISIT_APPROVED = 'visit_approved',
  VISIT_REJECTED = 'visit_rejected',
  DONATION_RECEIVED = 'donation_received',
  DONATION_CONFIRMED = 'donation_confirmed',
  EVENT_REMINDER = 'event_reminder',
  NEW_EVENT = 'new_event',
  ACCOUNT_VERIFIED = 'account_verified'
}

