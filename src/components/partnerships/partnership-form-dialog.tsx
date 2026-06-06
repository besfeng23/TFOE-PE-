
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
import { Loader2 } from 'lucide-react';
import type { Partnership } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

interface PartnershipFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  partner?: Partnership | null;
}

const formSchema = z.object({
  name: z.string().min(2, 'Partner name is required.'),
  contactPerson: z.string().min(2, 'Contact person is required.'),
  email: z.string().email('Please enter a valid email.'),
  phone: z.string().optional(),
  address: z.string().optional(),
  partnershipType: z.enum(['Corporate', 'NGO', 'Private'], { required_error: 'Please select a type.' }),
  status: z.enum(['Active', 'Inactive'], { required_error: 'Please select a status.' }),
});

type FormValues = z.infer<typeof formSchema>;

export function PartnershipFormDialog({ isOpen, onClose, partner }: PartnershipFormDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();
  const isEditing = !!partner;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      partnershipType: 'Corporate',
      status: 'Active',
    },
  });
  
  useEffect(() => {
      if (partner) {
          form.reset(partner);
      } else {
          form.reset({
            name: '',
            contactPerson: '',
            email: '',
            phone: '',
            address: '',
            partnershipType: 'Corporate',
            status: 'Active',
          });
      }
  }, [partner, form])

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      form.reset();
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    try {
        if (isEditing) {
            const { error } = await supabase
                .from('partnerships')
                .update(data)
                .eq('id', partner.id);
            if (error) throw error;
        } else {
            const { error } = await supabase.from('partnerships').insert([data]);
            if (error) throw error;
        }
        
        toast({
            title: isEditing ? 'Partner Updated' : 'Partner Added',
            description: `${data.name}'s information has been saved.`,
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Partner' : 'Add New Partner'}</DialogTitle>
          <DialogDescription>
            {isEditing ? `Update the details for ${partner.name}.` : 'Enter the details for the new partner.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Partner Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., ACME Corporation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="contactPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                        <Input placeholder="contact@acme.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., +63 917 123 4567" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                        <Input placeholder="123 Business Park, Makati City" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="partnershipType"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Partnership Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Corporate">Corporate</SelectItem>
                        <SelectItem value="NGO">NGO</SelectItem>
                        <SelectItem value="Private">Private</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Save Changes' : 'Add Partner'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
