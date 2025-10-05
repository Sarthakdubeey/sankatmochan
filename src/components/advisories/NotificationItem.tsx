
import { Notification } from '@/app/types/notification';
import { formatDistanceToNow } from 'date-fns';

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
      return 'border-red-500 bg-red-500/10 text-red-800 dark:text-red-300';
    case 'warning':
      return 'border-orange-500 bg-orange-500/10 text-orange-800 dark:text-orange-300';
    default:
      return 'border-blue-500 bg-blue-500/10 text-blue-800 dark:text-blue-300';
  }
};

const getSourceStyles = (source: string) => {
  switch (source) {
    case 'IMD':
      return 'bg-blue-200/50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300';
    case 'NDMA':
      return 'bg-red-200/50 text-red-700 dark:bg-red-500/20 dark:text-red-300';
    case 'Google Weather':
      return 'bg-green-200/50 text-green-700 dark:bg-green-500/20 dark:text-green-300';
    default:
      return 'bg-gray-200/50 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300';
  }
};

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, isClient }) => {
  const timeAgo = isClient ? formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true }) : '';

  return (
    <div className={`p-4 rounded-lg border-l-4 ${getTypeStyles(notification.type)} transition-all hover:shadow-md`}>
      <div className="flex items-start gap-4">
        <div className="text-2xl flex-shrink-0 mt-1">
          {getIcon(notification.type, notification.source)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getSourceStyles(notification.source)}`}>
              {notification.source}
            </span>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
          
          <p className="font-medium text-foreground mb-2">{notification.message}</p>
          
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {notification.area && (
              <span className="flex items-center gap-1">
                <strong className="font-semibold">Area:</strong> {notification.area}
              </span>
            )}
            {notification.duration && (
              <span className="flex items-center gap-1">
                <strong className="font-semibold">Duration:</strong> {notification.duration}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
