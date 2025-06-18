"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { BellRing, AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'announcement' | 'alert' | 'info';
  date: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: '1', title: 'Upcoming School Closure', description: 'School will be closed on Oct 26th for a regional holiday.', type: 'alert', date: '2023-10-20', read: false },
  { id: '2', title: 'Parent-Teacher Meeting Reminder', description: 'Scheduled for Nov 5th. Please confirm your attendance.', type: 'info', date: '2023-10-18', read: true },
  { id: '3', title: 'New Sports Equipment Arrived!', description: 'Check out the new basketballs and footballs in the gym.', type: 'announcement', date: '2023-10-15', read: false },
  { id: '4', title: 'Fee Payment Overdue', description: 'Your term fee payment is overdue. Please pay by Oct 30th.', type: 'alert', date: '2023-10-12', read: false },
  { id: '5', title: 'Library Books Return', description: 'All borrowed library books must be returned by the end of this week.', type: 'info', date: '2023-10-10', read: true },
];

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
  switch (type) {
    case 'announcement': return <BellRing className="h-5 w-5 text-primary" />;
    case 'alert': return <AlertTriangle className="h-5 w-5 text-destructive" />;
    case 'info': return <Info className="h-5 w-5 text-blue-500" />;
    default: return <BellRing className="h-5 w-5 text-muted-foreground" />;
  }
};

export function NotificationFeedClient() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-primary">
          Notifications {unreadCount > 0 && <Badge variant="destructive" className="ml-2">{unreadCount} New</Badge>}
        </h2>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline" size="sm">Mark all as read</Button>
        )}
      </div>
      {notifications.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No new notifications.
          </CardContent>
        </Card>
      ) : (
        notifications.map(notification => (
          <Card key={notification.id} className={`transition-all duration-300 ${notification.read ? 'opacity-70 bg-card/50' : 'bg-card shadow-md hover:shadow-lg'}`}>
            <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-3">
              <NotificationIcon type={notification.type} />
              <div className="flex-1">
                <CardTitle className="text-lg">{notification.title}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">{new Date(notification.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
              </div>
              {!notification.read && (
                <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>Mark as read</Button>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{notification.description}</p>
            </CardContent>
             {notification.type === 'alert' && !notification.read && (
              <CardFooter>
                <Button variant="destructive" size="sm" onClick={() => markAsRead(notification.id)}>Acknowledge</Button>
              </CardFooter>
            )}
          </Card>
        ))
      )}
    </div>
  );
}
