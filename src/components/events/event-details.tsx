'use client';

import type { Event } from '@/lib/types';
import { Button } from '../ui/button';
import { Calendar, Clipboard, MapPin, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

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

export default function EventDetails({ event, onClose }: EventDetailsProps) {
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
        
        {event.meetingId && <CopyableInfoRow icon={Clipboard} label="Meeting ID" value={event.meetingId} />}
        {event.passcode && <CopyableInfoRow icon={Clipboard} label="Passcode" value={event.passcode} />}

      </div>
    </div>
  );
}
