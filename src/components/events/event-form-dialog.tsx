
'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { Event } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { createClient } from '@/lib/supabase/client';

interface EventFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event | null;
}

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  description: z.string().min(10, 'Description is required.'),
  location: z.string().min(3, 'Location is required.'),
  startDate: z.date({ required_error: 'Start date is required.'}),
  endDate: z.date({ required_error: 'End date is required.'}),
  meetingId: z.string().optional(),
  passcode: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const defaultFormValues = {
    title: '',
    description: '',
    location: '',
    startDate: undefined,
    endDate: undefined,
    meetingId: '',
    passcode: '',
};

export function EventFormDialog({ isOpen, onClose, event }: EventFormDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();
  const isEditing = !!event;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });
  
  const locationValue = useWatch({
    control: form.control,
    name: 'location'
  });

  const isVirtualEvent = locationValue?.toLowerCase().includes('zoom') || locationValue?.toLowerCase().includes('online');

  
  useEffect(() => {
      if (isOpen && event) {
          form.reset({
              ...event,
              startDate: new Date(event.startDate),
              endDate: event.endDate ? new Date(event.endDate) : undefined,
          });
      } else if (isOpen && !event) {
          form.reset(defaultFormValues);
      }
  }, [event, form, isOpen])

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      form.reset(defaultFormValues);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    try {
        const eventData = {
            ...data,
            startDate: data.startDate.toISOString(),
            endDate: data.endDate.toISOString(),
        };

        if (isEditing) {
            const { error } = await supabase
                .from('events')
                .update(eventData)
                .eq('id', event.id);
            if (error) throw error;
        } else {
            const { error } = await supabase.from('events').insert([eventData]);
            if (error) throw error;
        }
        
        toast({
            title: isEditing ? 'Event Updated' : 'Event Added',
            description: `"${data.title}" has been saved successfully.`,
        });
        onClose();

    } catch (error: any) {
        console.error('Save failed:', error);
        toast({
            variant: 'destructive',
            title: 'Save Failed',
            description: error.message || 'An unexpected error occurred.',
        });
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Event' : 'Add New Event'}</DialogTitle>
          <DialogDescription>
            {isEditing ? `Update the details for "${event.title}".` : 'Enter the details for the new event.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., General Membership Meeting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Provide a brief description of the event..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Zoom, TFOE-PE National Headquarters" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isVirtualEvent && (
                 <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="meetingId"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Meeting ID</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., 575 287 6257" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="passcode"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Passcode</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., 787283" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                </div>
            )}
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                date < new Date("1900-01-01")
                                }
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                date < new Date("1900-01-01")
                                }
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Save Changes' : 'Add Event'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
