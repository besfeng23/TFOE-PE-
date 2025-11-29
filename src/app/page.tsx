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
  Wallet,
} from 'lucide-react';
import Link from 'next/link';

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

const notifications = [
  {
    title: 'New Resolution requires approval',
    time: '2 hours ago',
    read: false,
  },
  {
    title: 'Membership application from Juan Dela Cruz',
    time: '1 day ago',
    read: false,
  },
  {
    title: 'GMM Scheduled for July 30, 2024',
    time: '3 days ago',
    read: true,
  },
  {
    title: 'Your expense report has been approved',
    time: '5 days ago',
    read: true,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back, here's a quick overview of your nest.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            Recent activities and pending actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <div
                key={index}
                className="flex items-start gap-4"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                  <Bell className="h-4 w-4 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {notification.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {notification.time}
                  </p>
                </div>
                {!notification.read && (
                  <div className="mt-1 h-2 w-2 rounded-full bg-accent" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
