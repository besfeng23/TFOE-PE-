
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import type { Event } from '@/lib/types';
import EventCalendar from '@/components/events/event-calendar';
import EventList from '@/components/events/event-list';
import EventDetails from '@/components/events/event-details';
import { EventFormDialog } from '@/components/events/event-form-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { getEvents } from '@/lib/repositories/events.repository';

export default function EventsPage() {
  const { profile, isLoading: isProfileLoading } = useAuth();
  const isAdmin = profile?.roleId === 'SuperAdmin';

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [eventForForm, setEventForForm] = useState<Event | null>(null);
  const [selectedEventDetails, setSelectedEventDetails] = useState<Event | null>(null);
  
  const [events, setEvents] = useState<Event[]>([]);
  const [areEventsLoading, setAreEventsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        const sortedData = data.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        setEvents(sortedData || []);
      } catch (error) {
        setError(error);
      } finally {
        setAreEventsLoading(false);
      }
    };
    fetchEvents();
  }, []);


  const handleEdit = (event: Event) => {
    setEventForForm(event);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEventForForm(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEventForForm(null);
  };

  const isLoading = isProfileLoading || areEventsLoading;
  
  const formattedEvents = events.map(event => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: event.endDate ? new Date(event.endDate) : undefined
  }));

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4">
                  <Skeleton className="w-full h-[300px]" />
                </div>
              ) : (
                <EventCalendar events={formattedEvents} onDateSelect={(date) => {
                    const eventOnDate = formattedEvents.find(e => e.startDate.toDateString() === date.toDateString());
                    if (eventOnDate) {
                        setSelectedEventDetails(eventOnDate);
                    }
                }}/>
              )}
            </CardContent>
          </Card>
           {selectedEventDetails && (
              <Card>
                  <CardContent>
                      <EventDetails event={selectedEventDetails} onClose={() => setSelectedEventDetails(null)} />
                  </CardContent>
              </Card>
           )}
        </div>
        <div>
          <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="font-headline">Upcoming Events</CardTitle>
                        <CardDescription>All scheduled programs and meetings.</CardDescription>
                    </div>
                    {isAdmin && (
                        <Button size="sm" onClick={handleAdd}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Event
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <EventList 
                    isLoading={isLoading} 
                    error={error} 
                    events={formattedEvents} 
                    isAdmin={isAdmin}
                    onEdit={handleEdit}
                    onSelectEvent={setSelectedEventDetails}
                    selectedEvent={selectedEventDetails}
                />
            </CardContent>
          </Card>
        </div>
      </div>
      {isAdmin && (
        <EventFormDialog
          isOpen={isFormOpen}
          onClose={closeForm}
          event={eventForForm}
        />
      )}
    </>
  );
}
