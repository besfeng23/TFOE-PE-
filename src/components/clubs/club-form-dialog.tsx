
'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { createClub, updateClub } from '@/lib/repositories/clubs.repository';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(1, 'Club name is required'),
  region: z.string().min(1, 'Region is required'),
  council: z.string().min(1, 'Council is required'),
});

interface ClubFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  club: any | null;
}

export function ClubFormDialog({ isOpen, onClose, club }: ClubFormDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: club || {
      name: '',
      region: '',
      council: '',
    },
  });

  useEffect(() => {
    form.reset(club || {
      name: '',
      region: '',
      council: '',
    });
  }, [club, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (club) {
        await updateClub(club.id, values);
        toast({ title: 'Success', description: 'Club updated successfully.' });
      } else {
        await createClub(values);
        toast({ title: 'Success', description: 'Club created successfully.' });
      }
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save club. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{club ? 'Edit Club' : 'Add New Club'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Club Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Rotary Club of Manila" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Luzon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="council"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Council</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Manila Council" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
