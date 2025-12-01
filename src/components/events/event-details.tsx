'use client';

import type { Attendance, Event } from '@/lib/types';
import { Button } from '../ui/button';
import { Calendar, CheckCircle, Clipboard, MapPin, Users, X } from 'lucide-react';
import { format, isPast } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { addDocumentNonBlocking, useAuthUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, query, where } from 'firebase/firestore';

interface EventDetailsProps {
  event: Event;
  onClose: () => void;
}

const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined }) => {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3">
            <Icon className="h-4 w-4 text-muted-foreground mt-1" />
            <div className="flex-1">
                <p className="text-sm font-medium">{label}</p>
                <p className="text-sm text-muted-foreground">{value}</p>
            </div>
        </div>
    )
}

const CopyableInfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined }) => {
    if (!value) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        toast({
            title: 'Copied to Clipboard',
            description: `${label} has been copied.`,
        });
    }

    return (
        <div className="flex items-start gap-3">
            <Icon className="h-4 w-4 text-muted-foreground mt-1" />
            <div className="flex-1">
                <p className="text-sm font-medium">{label}</p>
                <p className="text-sm text-muted-foreground">{value}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy}>
                <Clipboard className="h-4 w-4" />
                <span className="sr-only">Copy {label}</span>
            </Button>
        </div>
    )
}

const AttendanceCounter = ({ eventId }: { eventId: string }) => {
    const firestore = useFirestore();

    const attendanceQuery = useMemoFirebase(() => {
        if (!firestore || !eventId) return null;
        return query(collection(firestore, 'attendance'), where('eventId', '==', eventId));
    }, [firestore, eventId]);

    const { data: attendanceList, isLoading } = useCollection<Attendance>(attendanceQuery);

    const count = attendanceList?.length ?? 0;

    return (
        <div className="flex items-start gap-3">
            <Users className="h-4 w-4 text-muted-foreground mt-1" />
            <div className="flex-1">
                <p className="text-sm font-medium">Attendance</p>
                <p className="text-sm text-muted-foreground">
                    {isLoading ? 'Loading...' : `${count} members have checked in.`}
                </p>
            </div>
        </div>
    )
}


export default function EventDetails({ event, onClose }: EventDetailsProps) {
  const { user, profile } = useAuthUser();
  const firestore = useFirestore();
  const isEventPast = isPast(event.startDate.toDate());
  const isAdmin = profile?.roleId === 'Admin';
  
  const userAttendanceQuery = useMemoFirebase(() => {
    if (!firestore || !user || !event) return null;
    return query(
        collection(firestore, 'attendance'),
        where('userId', '==', user.uid),
        where('eventId', '==', event.id)
    );
  }, [firestore, user, event]);

  const { data: userAttendance, isLoading: isAttendanceLoading } = useCollection<Attendance>(userAttendanceQuery);

  const hasAttended = (userAttendance?.length ?? 0) > 0;

  const handleMarkAttendance = () => {
    if (!firestore || !user || !event) return;

    const attendanceCollection = collection(firestore, 'attendance');
    const newAttendance = {
        eventId: event.id,
        userId: user.uid,
        attended: true
    };
    
    addDocumentNonBlocking(attendanceCollection, newAttendance);

    toast({
        title: "Attendance Marked",
        description: `You have successfully checked in to "${event.title}".`
    });
  }


  return (
    <div className="relative space-y-6">
      <Button variant="ghost" size="icon" className="absolute top-0 right-0 h-8 w-8" onClick={onClose}>
        <X className="h-4 w-4" />
        <span className="sr-only">Close details</span>
      </Button>

      <div className="space-y-2">
        <h3 className="text-xl font-bold font-headline">{event.title}</h3>
        <p className="text-sm text-muted-foreground">{event.description}</p>
      </div>

      <div className="space-y-4">
        <InfoRow 
            icon={Calendar} 
            label="Date & Time" 
            value={`${format(event.startDate.toDate(), 'PPP, p')} - ${format(event.endDate.toDate(), 'p')}`}
        />
        <InfoRow icon={MapPin} label="Location" value={event.location} />
        
        <CopyableInfoRow icon={Clipboard} label="Meeting ID" value={event.meetingId} />
        <CopyableInfoRow icon={Clipboard} label="Passcode" value={event.passcode} />
        {isAdmin && <AttendanceCounter eventId={event.id} />}
      </div>

      {!isAdmin && isEventPast && (
          <div className="pt-4">
            {hasAttended ? (
                 <Button variant="secondary" disabled className="w-full">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    You have attended this event
                </Button>
            ) : (
                <Button className="w-full" onClick={handleMarkAttendance} disabled={isAttendanceLoading}>
                    Mark as Attended
                </Button>
            )}
          </div>
      )}
    </div>
  );
}
