'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Bell,
  Book,
  Calendar,
  ClipboardCheck,
  FileText,
  ListTodo,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import {
  useCollection,
  useAuthUser,
  useMemoFirebase,
  useFirestore,
  updateDocumentNonBlocking,
} from '@/firebase';
import { collection, query, where, orderBy, doc, Timestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import type { Notification, Task, Event } from '@/lib/types';

const quickAccessItems = [
  {
    title: 'General Documents',
    description: 'Resolutions, Letters, etc.',
    icon: FileText,
    href: '/documents',
  },
  {
    title: 'Financial Records',
    description: 'Budgets, Expense Reports',
    icon: Wallet,
    href: '/documents',
  },
  {
    title: 'Meeting Attendance',
    description: 'Meeting & Event Attendance',
    icon: ClipboardCheck,
    href: '/documents',
  },
  {
    title: 'Financial Ledgers',
    description: 'Financial Records & Analytics',
    icon: Book,
    href: '/analytics',
  },
  {
    title: 'Programs & Events',
    description: 'Schedules and Details',
    icon: Calendar,
    href: '/events',
  },
];

function NotificationItem({ notification, onToggleRead }: { notification: Notification, onToggleRead: (id: string, read: boolean) => void }) {
  return (
    <div
      className="flex cursor-pointer items-start gap-4 rounded-md p-2 hover:bg-muted"
      onClick={() => onToggleRead(notification.id, !notification.read)}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
        <Bell className="h-4 w-4 text-secondary-foreground" />
      </div>
      <div className="flex-1">
        <p
          className={`font-medium ${
            notification.read ? 'text-muted-foreground' : 'text-foreground'
          }`}
        >
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground">
          {new Date(notification.timestamp.toDate()).toLocaleString()}
        </p>
      </div>
      {!notification.read && (
        <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-accent" />
      )}
    </div>
  );
}

function StatCard({ title, value, description, icon: Icon, isLoading }: { title: string, value: number, description: string, icon: React.ElementType, isLoading: boolean }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-7 w-12" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}


export default function DashboardPage() {
  const { user, profile, isUserLoading, isProfileLoading } = useAuthUser();
  const firestore = useFirestore();

  // Notifications query for all notifications
  const notificationsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, `userProfiles/${user.uid}/notifications`),
      orderBy('timestamp', 'desc')
    );
  }, [firestore, user]);

  const { data: notifications, isLoading: areNotificationsLoading } = useCollection<Notification>(notificationsQuery);
  
  // Query for unread notifications for the stat card
  const unreadNotificationsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, `userProfiles/${user.uid}/notifications`), where('read', '==', false));
  }, [firestore, user]);

  const { data: unreadNotifications, isLoading: areUnreadNotificationsLoading } = useCollection<Notification>(unreadNotificationsQuery);


  const tasksQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, `userProfiles/${user.uid}/tasks`), where('completed', '==', false));
  }, [firestore, user]);
  const { data: pendingTasks, isLoading: areTasksLoading } = useCollection<Task>(tasksQuery);
  
  const eventsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'events'), where('startDate', '>=', Timestamp.now()));
  }, [firestore]);

  const { data: upcomingEvents, isLoading: areEventsLoading } = useCollection<Event>(eventsQuery);

  const handleToggleRead = (id: string, read: boolean) => {
    if (!firestore || !user) return;
    const notificationRef = doc(firestore, `userProfiles/${user.uid}/notifications`, id);
    updateDocumentNonBlocking(notificationRef, { read });
  };
  
  const isLoading = isUserLoading || isProfileLoading;

  return (
    <div className="flex flex-col gap-8">
      <div>
        {isLoading ? (
          <>
            <Skeleton className="h-9 w-64" />
            <Skeleton className="mt-2 h-5 w-80" />
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
              Welcome back, {profile?.firstName || 'User'}!
            </h1>
            <p className="text-muted-foreground">
              Here&apos;s a quick overview of your nest.
            </p>
          </>
        )}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard 
            title="Pending Tasks"
            value={pendingTasks?.length ?? 0}
            description="Tasks that require your action"
            icon={ListTodo}
            isLoading={areTasksLoading}
        />
         <StatCard 
            title="Upcoming Events"
            value={upcomingEvents?.length ?? 0}
            description="Events scheduled in the future"
            icon={Calendar}
            isLoading={areEventsLoading}
        />
        <StatCard 
            title="Unread Notifications"
            value={unreadNotifications?.length ?? 0}
            description="New messages and alerts"
            icon={Bell}
            isLoading={areUnreadNotificationsLoading}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-4">
            {quickAccessItems.map((item) => (
              <Link href={item.href} key={item.title}>
                <Card className="hover:bg-muted/50 transition-colors h-full flex flex-col justify-center">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {item.title}
                    </CardTitle>
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
        </div>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Recent activities and pending actions. Click to toggle read status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {areNotificationsLoading && (
                <>
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </>
              )}
              {!areNotificationsLoading && notifications && notifications.length > 0 &&
                notifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} onToggleRead={handleToggleRead}/>
                ))}
              {!areNotificationsLoading && (!notifications || notifications.length === 0) && (
                <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/30 bg-muted/50 p-12 text-center">
                    <div className="rounded-full bg-background p-3">
                        <Bell className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No new notifications</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        You're all caught up!
                    </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
