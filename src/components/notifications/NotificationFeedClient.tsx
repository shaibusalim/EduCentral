
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { BellRing, AlertTriangle, Info, PlusCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import type { NotificationItem, NotificationType } from '@/types';
import { useAppContext } from "@/contexts/AppContext";
import { AddNotificationDialog } from "./AddNotificationDialog";
import type { NotificationFormData } from "./NotificationForm";
import { useToast } from "@/hooks/use-toast";
import { getNotifications, addNotificationToFirestore } from "@/services/notificationService";

const NotificationIcon = ({ type }: { type: NotificationType }) => {
  switch (type) {
    case 'announcement': return <BellRing className="h-5 w-5 text-primary" />;
    case 'alert': return <AlertTriangle className="h-5 w-5 text-destructive" />;
    case 'info': return <Info className="h-5 w-5 text-blue-500" />;
    default: return <BellRing className="h-5 w-5 text-muted-foreground" />;
  }
};

export function NotificationFeedClient() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { role } = useAppContext();
  const { toast } = useToast();

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedNotifications = await getNotifications();
      setNotifications(fetchedNotifications.map(n => ({...n, read: n.read || false }))); // Ensure 'read' is initialized
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load notifications",
        description: (error as Error).message || "Could not fetch notification data.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);


  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  
  const handleAddNotification = async (data: NotificationFormData) => {
    try {
      await addNotificationToFirestore(data);
      toast({
        title: "Notification Created",
        description: `"${data.title}" has been posted.`,
      });
      fetchNotifications(); // Refresh list
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Failed to create notification",
        description: (error as Error).message,
      });
    }
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
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
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
                <CardDescription className="text-xs text-muted-foreground">{new Date(notification.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</CardDescription>
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
