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
import { useCollection, useAuthUser, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc } from 'firebase/firestore';

const quickAccessItems = [
  {
    title: 'Standard Forms',
    description: 'Resolutions, Letters, etc.',
    icon: FileText,
    href: '/documents',
  },
  {
    title: 'Financial Forms',
    description: 'Budgets, Expense Reports',
    icon: Wallet,
    href: '/documents',
  },
  {
    title: 'Attendance Sheets',
    description: 'Meeting & Event Attendance',
    icon: ClipboardCheck,
    href: '/documents',
  },
  {
    title: 'Ledgers',
    description: 'Financial Records',
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

function NotificationItem({ notification, onToggleRead }: { notification: any, onToggleRead: (id: string, read: boolean) => void }) {
  return (
    <div
      key={notification.id}
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


export default function DashboardPage() {
  const { user, profile, isUserLoading, isProfileLoading } = useAuthUser();
  const firestore = useFirestore();

  const notificationsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );
  }, [firestore, user]);

  const { data: notifications, isLoading: areNotificationsLoading } = useCollection(notificationsQuery);

  const tasksQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, `userProfiles/${user.uid}/tasks`), where('completed', '==', false));
  }, [firestore, user]);

  const { data: pendingTasks, isLoading: areTasksLoading } = useCollection(tasksQuery);

  const { data: documents, isLoading: areDocumentsLoading } = useCollection(
    useMemoFirebase(() => {
      if (!firestore) return null;
      return collection(firestore, 'documents')
    }, [firestore])
  );
  
  // This query is now scoped to the logged-in user to respect security rules.
  const attendanceQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, 'attendance'),
      where('userId', '==', user.uid)
    );
  }, [firestore, user]);

  const { data: attendance, isLoading: areAttendanceLoading } = useCollection(attendanceQuery);


  const handleToggleRead = (id: string, read: boolean) => {
    if (!firestore) return;
    const notificationRef = doc(firestore, 'notifications', id);
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Pending Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {areTasksLoading ? (
              <Skeleton className="h-7 w-12" />
            ) : (
              <div className="text-2xl font-bold">{pendingTasks?.length ?? 0}</div>
            )}
            <p className="text-xs text-muted-foreground">Tasks that require your action</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents Stored</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {areDocumentsLoading ? (
               <Skeleton className="h-7 w-12" />
            ) : (
              <div className="text-2xl font-bold">{documents?.length ?? 0}</div>
            )}
            <p className="text-xs text-muted-foreground">Total documents uploaded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Event Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {areAttendanceLoading ? (
               <Skeleton className="h-7 w-12" />
             ) : (
                <div className="text-2xl font-bold">{attendance?.length ?? 0}</div>
             )}
            <p className="text-xs text-muted-foreground">Your attendance records</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
            {quickAccessItems.map((item) => (
              <Link href={item.href} key={item.title}>
                <Card className="hover:bg-muted/50 transition-colors h-full">
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

        <Card>
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
                   <Link href="#" key={notification.id} passHref>
                    <NotificationItem notification={notification} onToggleRead={handleToggleRead}/>
                   </Link>
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
