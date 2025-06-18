
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { BellRing, AlertTriangle, Info, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { NotificationItem, NotificationType } from '@/types';
import { useAppContext } from "@/contexts/AppContext";
import { AddNotificationDialog } from "./AddNotificationDialog";
import type { NotificationFormData } from "./NotificationForm";
import { useToast } from "@/hooks/use-toast";

const mockNotificationsData: NotificationItem[] = [
  { id: '1', title: 'Upcoming School Closure', description: 'School will be closed on Oct 26th for a regional holiday.', type: 'alert', date: new Date(2023, 9, 20).toISOString(), read: false },
  { id: '2', title: 'Parent-Teacher Meeting Reminder', description: 'Scheduled for Nov 5th. Please confirm your attendance.', type: 'info', date: new Date(2023, 9, 18).toISOString(), read: true },
  { id: '3', title: 'New Sports Equipment Arrived!', description: 'Check out the new basketballs and footballs in the gym.', type: 'announcement', date: new Date(2023, 9, 15).toISOString(), read: false },
  { id: '4', title: 'Fee Payment Overdue', description: 'Your term fee payment is overdue. Please pay by Oct 30th.', type: 'alert', date: new Date(2023, 9, 12).toISOString(), read: false },
  { id: '5', title: 'Library Books Return', description: 'All borrowed library books must be returned by the end of this week.', type: 'info', date: new Date(2023, 9, 10).toISOString(), read: true },
];

const NotificationIcon = ({ type }: { type: NotificationType }) => {
  switch (type) {
    case 'announcement': return <BellRing className="h-5 w-5 text-primary" />;
    case 'alert': return <AlertTriangle className="h-5 w-5 text-destructive" />;
    case 'info': return <Info className="h-5 w-5 text-blue-500" />;
    default: return <BellRing className="h-5 w-5 text-muted-foreground" />;
  }
};

export function NotificationFeedClient() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotificationsData);
  const { role } = useAppContext();
  const { toast } = useToast();

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  
  const handleAddNotification = (data: NotificationFormData) => {
    const newNotification: NotificationItem = {
      id: `notif-${Date.now().toString()}`,
      title: data.title,
      description: data.description,
      type: data.type as NotificationType,
      date: new Date().toISOString(),
      read: false, 
    };
    setNotifications(prev => [newNotification, ...prev]);
    toast({
      title: "Notification Created",
      description: `"${data.title}" has been posted.`,
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-primary">
          Notifications {unreadCount > 0 && <Badge variant="destructive" className="ml-2">{unreadCount} New</Badge>}
        </h2>
        <div className="flex items-center gap-2">
          {role === 'admin' && (
            <AddNotificationDialog onNotificationAdded={handleAddNotification}>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <PlusCircle className="mr-2 h-4 w-4" /> Create Notification
              </Button>
            </AddNotificationDialog>
          )}
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline" size="sm">Mark all as read</Button>
          )}
        </div>
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
