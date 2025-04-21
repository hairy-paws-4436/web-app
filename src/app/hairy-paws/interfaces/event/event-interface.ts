export interface EventInterface {
  id?: string;
  title: string;
  description: string;
  eventDate: string;
  endDate?: string;
  location: string;
  isVolunteerEvent: boolean;
  maxParticipants?: number;
  requirements?: string;
  ongId?: string;
  createdAt?: string;
  updatedAt?: string;
  active: boolean;
  imageUrl: string;

}
