
'use client';

import { useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { useState, useEffect } from 'react';

export const NotificationBar = ({ isClient }: { isClient: boolean }) => {
  const {
    notifications,
    isLoading,
    soundEnabled,
    setSoundEnabled,
    refreshNotifications,
    clearNotifications,
  } = useNotifications();

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  return (
    <div className="bg-black/40 rounded-2xl p-6 backdrop-blur-sm shadow-2xl border border-white/10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-white/20">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <span className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-sm">🔔</span>
          </span>
          Active Weather Alerts
          {isClient && notifications.length > 0 && (
            <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
              {notifications.length}
            </span>
          )}
        </h2>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={refreshNotifications}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all disabled:opacity-50"
          >
            <span className={isLoading ? 'animate-spin' : ''}>🔄</span>
            Refresh
          </button>
          
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              soundEnabled 
                ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30' 
                : 'bg-gray-500/20 text-gray-300 hover:bg-gray-500/30'
            }`}
          >
            {soundEnabled ? '🔊' : '🔇'}
            {soundEnabled ? 'Sound On' : 'Sound Off'}
          </button>
          
          <button
            onClick={clearNotifications}
            disabled={!isClient || notifications.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50"
          >
            🗑️ Clear All
          </button>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin text-3xl mb-2">⏳</div>
            <p>Loading alerts...</p>
          </div>
        ) : isClient && notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">🌤️</div>
            <p>No active weather alerts</p>
            <p className="text-sm">All clear for now!</p>
          </div>
        ) : isClient ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <div className="animate-spin text-3xl mb-2">⏳</div>
            <p>Loading alerts...</p>
          </div>
        )}
      </div>
    </div>
  );
};
