import { NotificationFeedClient } from '@/components/notifications/NotificationFeedClient';
import { PageTitle } from '@/components/ui/PageTitle';

export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageTitle 
        title="School Notifications"
        subtitle="Stay informed about important announcements, alerts, and updates."
      />
      <NotificationFeedClient />
    </div>
  );
}
