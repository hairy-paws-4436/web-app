export interface DonationInterface {
  id?: string;
  ongId: string;
  donorId?: string;
  type: DonationType;
  amount?: number;
  transactionId?: string;
  notes?: string;
  items?: DonationItem[];
  receipt?: any;
  status?: DonationStatus;
  createdAt?: string;
  updatedAt?: string;
}

export enum DonationType {
  MONEY = 'money',
  ITEMS = 'items'
}

export enum DonationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELED = 'canceled'
}

export interface DonationItem {
  name: string;
  quantity: number;
  description?: string;
}
