export interface IncidentEvent {
  id: string | number;
  lat: number;
  lng: number;
  status: 'reported' | 'in_progress' | 'resolved';
  severity: 0 | 1 | 2 | 3;
  title: string;
  type: string;
  address?: string;
}