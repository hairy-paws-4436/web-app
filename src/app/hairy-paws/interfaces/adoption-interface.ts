export interface AdoptionInterface {
  animalId: string;
  type: 'adoption' | 'visit';
  visitDate?: Date | string;
  notes: string;
  adopterId?: string,
  id?: string
  ownerId?: string
  status?: string
  requestDate?: string
  approvalDate?: any
  rejectionDate?: any
}
