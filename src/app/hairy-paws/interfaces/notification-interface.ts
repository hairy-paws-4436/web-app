// notification.interface.ts
export interface NotificationInterface {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  link: string;
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
  ACCOUNT_VERIFIED = 'account_verified',
  NEW_EVENT = 'new_event',
}

export interface NotificationActionParams {
  id: string; // ID of the related entity (adoption request, visit request, donation)
  notes?: string; // Optional notes for approval/rejection
  reason?: string; // Optional reason for rejection
}
