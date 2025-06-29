// notification/notification-preferences-interface.ts
export interface NotificationPreferencesInterface {
  id?: string;
  userId: string;
  globalNotificationsEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  preferredChannels: string[];

  // Adoption notifications
  adoptionRequestsEnabled: boolean;
  adoptionRequestsFrequency: string;
  adoptionStatusEnabled: boolean;
  adoptionStatusFrequency: string;

  // New matches and animals
  newMatchesEnabled: boolean;
  newMatchesFrequency: string;
  newAnimalsEnabled: boolean;
  newAnimalsFrequency: string;

  // Donations
  donationConfirmationsEnabled: boolean;
  donationConfirmationsFrequency: string;

  // Events
  eventRemindersEnabled: boolean;
  eventRemindersFrequency: string;
  newEventsEnabled: boolean;
  newEventsFrequency: string;

  // Follow-ups and account
  followupRemindersEnabled: boolean;
  followupRemindersFrequency: string;
  accountUpdatesEnabled: boolean;
  accountUpdatesFrequency: string;

  // Filtering preferences
  preferredAnimalTypesForNotifications: string[] | null;
  maxDistanceNotificationsKm: number;
  onlyHighCompatibility: boolean;

  // Marketing
  promotionalEnabled: boolean;
  newsletterEnabled: boolean;

  // System settings
  lastDigestSent: string | null;
  timezone: string;
  language: string;

  // Timestamps
  createdAt?: string;
  updatedAt?: string;

  // User info (if included in response)
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
    status: string;
    verified: boolean;
    address: string;
    profileImageUrl: string | null;
  };
}

// Template interface ajustada para la respuesta de la API
export interface NotificationTemplateInterface {
  id?: string;
  name: string;
  description: string;
  category?: string;
  config: NotificationTemplateConfigInterface;
  settings?: {
    emailEnabled: boolean;
    pushEnabled: boolean;
    smsEnabled: boolean;
    frequency: string;
  };
}

export interface NotificationTemplateConfigInterface {
  adoptionRequestsEnabled: boolean;
  adoptionRequestsFrequency: string;
  adoptionStatusEnabled: boolean;
  adoptionStatusFrequency: string;
  newMatchesEnabled: boolean;
  newMatchesFrequency?: string;
  newAnimalsEnabled: boolean;
  newAnimalsFrequency?: string;
  eventRemindersEnabled: boolean;
  eventRemindersFrequency?: string;
  newEventsEnabled: boolean;
  newEventsFrequency?: string;
  donationConfirmationsEnabled: boolean;
  donationConfirmationsFrequency?: string;
  followupRemindersEnabled: boolean;
  followupRemindersFrequency?: string;
  promotionalEnabled: boolean;
  newsletterEnabled: boolean;
}

// Interface para la respuesta de templates de la API
export interface NotificationTemplatesApiResponse {
  [key: string]: {
    name: string;
    description: string;
    config: NotificationTemplateConfigInterface;
  };
}

// Frequency options
export interface FrequencyOption {
  label: string;
  value: string;
}

// Channel options
export interface ChannelOption {
  label: string;
  value: string;
  icon: string;
}
