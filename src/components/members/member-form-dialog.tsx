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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { useFirestore, setDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import type { UserProfile } from '@/lib/types';

interface MemberFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  member?: UserProfile | null;
}

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  email: z.string().email('Please enter a valid email.'),
  roleId: z.string({ required_error: 'Please select a role.' }),
});

type FormValues = z.infer<typeof formSchema>;

export function MemberFormDialog({ isOpen, onClose, member }: MemberFormDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const firestore = useFirestore();
  const isEditing = !!member;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      roleId: 'Member',
    },
  });
  
  useEffect(() => {
      if (member) {
          form.reset(member);
      } else {
          form.reset({
              firstName: '',
              lastName: '',
              email: '',
              roleId: 'Member',
          });
      }
  }, [member, form])

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      form.reset();
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!firestore) return;
    
    setIsSaving(true);
    try {
        const docRef = isEditing
            ? doc(firestore, 'userProfiles', member.id)
            : doc(collection(firestore, 'userProfiles')); // Create a new doc reference for new members

        const profileData: Partial<UserProfile> = {
            ...data,
            id: isEditing ? member.id : docRef.id,
        };
        
        // For new members, we need to create the user in Firebase Auth as well.
        // This is a complex operation that should ideally be handled by a server-side function
        // for security reasons (e.g., to prevent abuse). 
        // For this client-side demo, we are only creating/updating the Firestore profile document.
        if (!isEditing) {
            // Note: In a real app, you would likely call a serverless function here
            // to create the Firebase Auth user and then create the profile.
            // e.g., `await createUser({ email: data.email, password: 'defaultPassword' })`
            // For now, we only create the profile doc. The user won't be able to log in.
        }

        await setDocumentNonBlocking(docRef, profileData, { merge: true });
        
        toast({
            title: isEditing ? 'Member Updated' : 'Member Added',
            description: `${data.firstName} ${data.lastName}'s profile has been saved.`,
        });
        onClose();
        form.reset();

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Member' : 'Add New Member'}</DialogTitle>
          <DialogDescription>
            {isEditing ? `Update the details for ${member.firstName} ${member.lastName}.` : 'Enter the details for the new member.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Juan" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Dela Cruz" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., juan.d.cruz@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Member">Member</SelectItem>
                      <SelectItem value="Secretary">Secretary</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Save Changes' : 'Add Member'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
