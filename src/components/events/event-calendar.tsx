'use client';

import React, { useMemo } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { type Event } from '@/lib/types';
import { isSameDay } from 'date-fns';

interface EventCalendarProps {
  events: Event[];
  onDateSelect: (date: Date) => void;
}

export default function EventCalendar({ events, onDateSelect }: EventCalendarProps) {
  const eventDays = useMemo(() => {
    return events.map(event => event.startDate.toDate());
  }, [events]);

  return (
    <Calendar
      mode="single"
      selected={new Date()}
      onSelect={(date) => date && onDateSelect(date)}
      className="p-3 w-full"
      modifiers={{
        hasEvent: eventDays,
      }}
      modifiersStyles={{
        hasEvent: {
            position: 'relative',
        }
      }}
      components={{
        DayContent: (props) => {
            const hasEvent = eventDays.some(d => isSameDay(d, props.date));
            return (
                <div className='relative'>
                    {props.date.getDate()}
                    {hasEvent && <div className='absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary' />}
                </div>
            )
        }
      }}
    />
  );
}
