export interface IncidentEvent {
  id: string;
  lat: number;
  lng: number;
  status: 'approved' | 'pending' | 'resolved';
  severity: 0 | 1 | 2 | 3;
  title: string;
  type: string;
}