export interface AdoptionInterface {
  animalId: string;
  type: 'adoption' | 'visit';
  visitDate?: Date | string;
  notes: string;
}
