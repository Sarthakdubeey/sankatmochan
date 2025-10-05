
'use client';

import { useState, useEffect } from 'react';
import type { ApiStatus } from '@/app/types/notification';

const mockApiStatus: ApiStatus[] = [
  {
    name: 'India Meteorological Department',
    status: 'connected',
    lastUpdate: new Date().toISOString(),
    description: 'Official weather forecasts and warnings for India'
  },
  {
    name: 'National Disaster Management Authority',
    status: 'connected',
    lastUpdate: new Date().toISOString(),
    description: 'Natural disaster alerts and emergency management'
  },
  {
    name: 'Google Weather API',
    status: 'connected',
    lastUpdate: new Date().toISOString(),
    description: 'Global weather data and severe weather alerts'
  }
];

export const ApiStatus = ({ isClient }: { isClient: boolean }) => {
  const [apiStatus, setApiStatus] = useState<ApiStatus[]>(mockApiStatus);

  useEffect(() => {
    // Simulate API status changes
    const interval = setInterval(() => {
      setApiStatus(prev => prev.map(api => ({
        ...api,
        lastUpdate: new Date().toISOString(),
        status: Math.random() > 0.1 ? 'connected' : 'disconnected'
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return '🟢';
      case 'disconnected': return '🔴';
      case 'error': return '🟡';
      default: return '⚪';
    }
  };

  return (
    <div className="bg-black/30 rounded-2xl p-6 backdrop-blur-sm shadow-2xl border border-white/10 mt-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <span className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
          <span className="text-sm">🔌</span>
        </span>
        API Integration Status
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {apiStatus.map((api, index) => (
          <div
            key={index}
            className="bg-white/10 rounded-xl p-4 hover:bg-white/15 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">{api.name}</h3>
              <span className="text-2xl">{getStatusIcon(api.status)}</span>
            </div>
            
            <p className="text-sm opacity-80 mb-3">{api.description}</p>
            
            <div className="flex items-center justify-between text-sm">
              <span className={
                api.status === 'connected' ? 'text-green-400' :
                api.status === 'disconnected' ? 'text-red-400' :
                'text-yellow-400'
              }>
                {api.status.charAt(0).toUpperCase() + api.status.slice(1)}
              </span>
              {isClient && (
                  <span className="opacity-70">
                    Updated: {new Date(api.lastUpdate).toLocaleTimeString()}
                  </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
