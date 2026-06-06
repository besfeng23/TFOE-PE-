'use client';

import React, { useState } from 'react';
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
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface UploadDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  category: z.string({ required_error: 'Please select a category.' }),
  file: z
    .instanceof(FileList)
    .refine((files) => files?.length === 1, 'File is required.')
});

type FormValues = z.infer<typeof formSchema>;

export function UploadDocumentDialog({ isOpen, onClose }: UploadDocumentDialogProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const supabase = createClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });
  const fileRef = form.register("file");


  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      form.reset();
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Not authenticated', description: 'You must be logged in to upload documents.' });
        return;
    }
    
    setIsUploading(true);
    try {
        const file = data.file[0];
        const filePath = `documents/${user.id}/${Date.now()}_${file.name}`;

        const { error: uploadError } = await supabase.storage.from('prod').upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from('prod').getPublicUrl(filePath);

        const { error: dbError } = await supabase.from('documents').insert([{
            title: data.title,
            categoryId: data.category,
            fileUrl: publicUrlData.publicUrl,
            uploaderId: user.id,
            uploadDate: new Date().toISOString(),
        }]);
        if (dbError) throw dbError;
        
        toast({
            title: 'Upload Successful',
            description: `"${data.title}" has been uploaded.`,
        });
        onClose();
        form.reset();

    } catch (error: any) {
        console.error('Upload failed:', error);
        toast({
            variant: 'destructive',
            title: 'Upload Failed',
            description: error.message || 'An unexpected error occurred.',
        });
    } finally {
        setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Add a new document to the portal.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Q2 Financial Report" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="resolution">Resolution</SelectItem>
                      <SelectItem value="minutes">Meeting Minutes</SelectItem>
                      <SelectItem value="form">Form</SelectItem>
                      <SelectItem value="financials">Financials</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>File</FormLabel>
                        <FormControl>
                             <Input type="file" {...fileRef} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isUploading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Upload
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}