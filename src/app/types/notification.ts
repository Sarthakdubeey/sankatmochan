
export interface Notification {
  id: string;
  source: 'IMD' | 'NDMA' | 'Google Weather';
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'critical';
  severity: number;
  area?: string;
  duration?: string;
}

export interface ApiStatus {
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  lastUpdate: string;
  description: string;
}
