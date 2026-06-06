
'use client';

import React, { useState } from 'react';
import type { Event } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '../ui/button';
import { MoreHorizontal, FileWarning } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';


interface EventListProps {
    isLoading: boolean;
    error: Error | null;
    events: Event[] | null;
    isAdmin: boolean;
    onEdit: (event: Event) => void;
    onSelectEvent: (event: Event | null) => void;
    selectedEvent: Event | null;
}

export default function EventList({ isLoading, error, events, isAdmin, onEdit, onSelectEvent, selectedEvent }: EventListProps) {
    const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
    const supabase = createClient();

    const handleDelete = (event: Event) => {
        setEventToDelete(event);
    };

    const confirmDelete = async () => {
        if (!eventToDelete) return;

        const { error } = await supabase.from('events').delete().eq('id', eventToDelete.id);

        if (error) {
            toast({
                title: "Error Deleting Event",
                description: error.message,
                variant: "destructive",
            });
        } else {
            toast({
                title: "Event Deleted",
                description: `"${eventToDelete.title}" has been removed.`,
            });
        }

        setEventToDelete(null);
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-start gap-4">
                        <div className="flex-1 space-y-2">
                           <Skeleton className="h-5 w-3/4" />
                           <Skeleton className="h-4 w-1/2" />
                        </div>
                        <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                ))}
            </div>
        );
    }
    
    if (error) {
         return (
            <div className="flex flex-col items-center justify-center rounded-md border-2 border-destructive/50 bg-destructive/10 p-8 text-center text-destructive">
                <FileWarning className="h-8 w-8" />
                <h3 className="mt-4 text-lg font-semibold">Error Loading Events</h3>
                <p className="mt-1 text-sm ">
                    There was a problem fetching events. Please try again later.
                </p>
            </div>
        )
    }

    if (!events || events.length === 0) {
        return <div className="text-center text-muted-foreground p-8">No upcoming events found.</div>
    }

    return (
        <div className="space-y-1">
            {events.map(event => (
                <div 
                    key={event.id}
                    className={`flex items-start gap-4 p-2 rounded-md cursor-pointer transition-colors ${selectedEvent?.id === event.id ? 'bg-muted' : 'hover:bg-muted/50'}`}
                    onClick={() => onSelectEvent(event)}
                >
                    <div className="flex-1">
                        <p className="font-semibold">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                            {new Date(event.startDate).toLocaleDateString()}
                        </p>
                    </div>
                    {isAdmin && (
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(event); }}>Edit Event</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className='text-destructive focus:bg-destructive/10 focus:text-destructive' onClick={(e) => { e.stopPropagation(); handleDelete(event);}}>Delete Event</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            ))}

            <AlertDialog open={!!eventToDelete} onOpenChange={(open) => !open && setEventToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the event
                        and remove its data from our servers.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
