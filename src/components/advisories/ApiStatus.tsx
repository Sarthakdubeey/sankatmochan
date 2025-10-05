
'use client';

import { useState, useEffect } from 'react';
import { ApiStatus as ApiStatusType } from '@/app/types/notification';
import { Plug, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const initialApiStatus: ApiStatusType[] = [
  {
    name: 'India Meteorological Department',
    status: 'connected',
    lastUpdate: '',
    description: 'Official weather forecasts and warnings for India'
  },
  {
    name: 'National Disaster Management Authority',
    status: 'connected',
    lastUpdate: '',
    description: 'Natural disaster alerts and emergency management'
  },
  {
    name: 'Google Weather',
    status: 'connected',
    lastUpdate: '',
    description: 'Global weather data and severe weather alerts'
  }
];

export const ApiStatus = () => {
  const [apiStatus, setApiStatus] = useState<ApiStatusType[]>(initialApiStatus);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Set initial state with current time on client
    setApiStatus(prev => prev.map(api => ({
      ...api,
      lastUpdate: new Date().toISOString(),
    })));

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

  const getStatusIcon = (status: ApiStatusType['status']) => {
    switch (status) {
      case 'connected': return <CheckCircle className="text-green-400" />;
      case 'disconnected': return <XCircle className="text-red-400" />;
      case 'error': return <AlertTriangle className="text-yellow-400" />;
      default: return <XCircle className="text-gray-400"/>;
    }
  };

  return (
    <div className="bg-black/30 rounded-2xl p-6 backdrop-blur-sm shadow-2xl border border-white/10 mt-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <Plug className="w-8 h-8 text-blue-400" />
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
              <div className="text-2xl">{getStatusIcon(api.status)}</div>
            </div>
            
            <p className="text-sm opacity-80 mb-3">{api.description}</p>
            
            <div className="flex items-center justify-between text-sm">
              <span className={cn(
                api.status === 'connected' ? 'text-green-400' :
                api.status === 'disconnected' ? 'text-red-400' :
                'text-yellow-400'
              )}>
                {api.status.charAt(0).toUpperCase() + api.status.slice(1)}
              </span>
              <span className="opacity-70">
                Updated: {isClient ? new Date(api.lastUpdate).toLocaleTimeString() : <Skeleton className="h-4 w-20 inline-block bg-white/20" />}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
