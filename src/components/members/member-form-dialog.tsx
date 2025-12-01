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
  FormDescription,
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
import { Separator } from '../ui/separator';

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
  membershipNumber: z.string().optional(),
  membershipStatus: z.enum(['Active', 'Inactive', 'Leadership']).optional(),
  assignedGovernmentPosition: z.string().optional(),
  governmentBranch: z.string().optional(),
  positionType: z.enum(['Elected', 'Appointed', 'Volunteer', 'None']).optional(),
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
      membershipNumber: '',
      membershipStatus: 'Active',
      assignedGovernmentPosition: '',
      governmentBranch: '',
      positionType: 'None',
    },
  });
  
  useEffect(() => {
      if (member) {
          form.reset({
            ...member,
            membershipStatus: member.membershipStatus || 'Active',
            positionType: member.positionType || 'None',
          });
      } else {
          form.reset({
              firstName: '',
              lastName: '',
              email: '',
              roleId: 'Member',
              membershipNumber: '',
              membershipStatus: 'Active',
              assignedGovernmentPosition: '',
              governmentBranch: '',
              positionType: 'None',
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
            : doc(collection(firestore, 'userProfiles'));

        const profileData: Partial<UserProfile> = {
            ...data,
            id: isEditing ? member.id : docRef.id,
        };
        
        if (!isEditing) {
            // Note: In a real app, you would likely call a serverless function here
            // to create the Firebase Auth user and then create the profile.
        }

        setDocumentNonBlocking(docRef, profileData, { merge: true });
        
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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Member' : 'Add New Member'}</DialogTitle>
          <DialogDescription>
            {isEditing ? `Update the details for ${member.firstName} ${member.lastName}.` : 'Enter the details for the new member.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Input placeholder="e.g., juan.d.cruz@example.com" {...field} disabled={isEditing}/>
                  </FormControl>
                  {isEditing && <FormDescription>Email cannot be changed after creation.</FormDescription>}
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="membershipNumber"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Membership Number</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., NCR-12345" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="membershipStatus"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Membership Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Leadership">Leadership</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Organizational Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Member">Member</SelectItem>
                        <SelectItem value="Leader">Leader</SelectItem>
                        <SelectItem value="Secretary">Secretary</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />


            <div className="space-y-2 pt-4">
                <h4 className="font-medium">Government Position</h4>
                <Separator />
            </div>

            <FormField
              control={form.control}
              name="assignedGovernmentPosition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position / Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Barangay Captain, City Councilor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="governmentBranch"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Gov. Branch / Affiliation</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Barangay XYZ, Quezon City Hall" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="positionType"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Position Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Elected">Elected Official</SelectItem>
                        <SelectItem value="Appointed">Appointed Position</SelectItem>
                        <SelectItem value="Volunteer">Volunteer Role</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            
            
            <DialogFooter className="pt-4 sticky bottom-0 bg-background pb-0 -mb-4">
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
