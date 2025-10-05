
import { Notification } from '@/app/types/notification';

interface NotificationItemProps {
  notification: Notification;
  isClient: boolean;
}

const getIcon = (type: string, source: string) => {
  if (source === 'IMD') return '🌧️';
  if (source === 'NDMA') return '⚠️';
  if (source === 'Google Weather') return '🌡️';
  
  switch (type) {
    case 'critical': return '🚨';
    case 'warning': return '⚡';
    default: return 'ℹ️';
  }
};

const getTypeStyles = (type: string) => {
  switch (type) {
    case 'critical':
      return 'border-red-500 bg-red-500/10';
    case 'warning':
      return 'border-orange-500 bg-orange-500/10';
    default:
      return 'border-blue-500 bg-blue-500/10';
  }
};

const getSourceStyles = (source: string) => {
  switch (source) {
    case 'IMD':
      return 'bg-blue-500/20 text-blue-300';
    case 'NDMA':
      return 'bg-red-500/20 text-red-300';
    case 'Google Weather':
      return 'bg-green-500/20 text-green-300';
    default:
      return 'bg-gray-500/20 text-gray-300';
  }
};

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, isClient }) => {
  const timeAgo = isClient ? new Date(notification.timestamp).toLocaleTimeString() : '';

  return (
    <div className={`p-4 rounded-lg border-l-4 ${getTypeStyles(notification.type)} transition-all hover:scale-[1.02] hover:shadow-lg`}>
      <div className="flex items-start gap-4">
        <div className="text-2xl flex-shrink-0">
          {getIcon(notification.type, notification.source)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceStyles(notification.source)}`}>
              {notification.source}
            </span>
            <span className="text-sm opacity-70">{timeAgo}</span>
          </div>
          
          <p className="text-lg font-medium mb-2">{notification.message}</p>
          
          <div className="flex flex-wrap gap-4 text-sm opacity-80">
            {notification.area && (
              <span className="flex items-center gap-1">
                📍 {notification.area}
              </span>
            )}
            {notification.duration && (
              <span className="flex items-center gap-1">
                ⏱️ {notification.duration}
              </span>
            )}
            <span className="flex items-center gap-1">
              🚨 Severity: {notification.severity}/3
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
