import { useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { mockNotifications } from '@/data/mockData';
import { Bell, BellOff, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    return <Bell className="h-5 w-5 text-blue-600" />;
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'New Plan':
        return 'bg-blue-50 border-blue-200';
      case 'Production Ready':
        return 'bg-green-50 border-green-200';
      case 'Production Started':
        return 'bg-purple-50 border-purple-200';
      case 'Readiness Pending':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            <Check className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BellOff className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No notifications yet</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map(notification => (
            <Card
              key={notification.id}
              className={`cursor-pointer transition-all ${
                !notification.read ? 'border-l-4 border-l-blue-600' : ''
              } ${getNotificationColor(notification.type)}`}
              onClick={() => {
                markAsRead(notification.id);
                navigate(`/plans/${notification.planId}`);
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline">{notification.type}</Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 font-medium">
                      {notification.message}
                    </p>
                    {!notification.read && (
                      <Badge variant="default" className="mt-2 text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
