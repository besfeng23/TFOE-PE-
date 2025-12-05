
'use client';

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuthUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Event } from '@/lib/types';
import EventCalendar from '@/components/events/event-calendar';
import EventList from '@/components/events/event-list';
import EventDetails from '@/components/events/event-details';
import { EventFormDialog } from '@/components/events/event-form-dialog';
import { Skeleton } from '@/components/ui/skeleton';

export default function EventsPage() {
  const { profile, isProfileLoading } = useAuthUser();
  const firestore = useFirestore();
  const isAdmin = profile?.roleId === 'Admin';

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [eventForForm, setEventForForm] = useState<Event | null>(null);
  const [selectedEventDetails, setSelectedEventDetails] = useState<Event | null>(null);

  const eventsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'events'), orderBy('startDate', 'asc'));
  }, [firestore]);

  const { data: events, isLoading: areEventsLoading, error } = useCollection<Event>(eventsQuery);

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
                <EventCalendar events={events || []} onDateSelect={(date) => {
                    const eventOnDate = events?.find(e => e.startDate.toDate().toDateString() === date.toDateString());
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
                    events={events} 
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
