
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { toast } from '@/components/ui/use-toast';
import { intelligentFormCompletion } from '@/ai/flows/intelligent-form-completion';
import { Loader2, Sparkles, Trash2 } from 'lucide-react';
import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { createApplicationAction } from '@/app/applications/actions';

const formSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  contactNumber: z.string().min(10, 'Contact number is too short.'),
  address: z.string().min(5, 'Address is too short.'),
  occupation: z.string().min(2, 'Occupation is required.'),
  sponsoringEagle: z.string().min(2, 'Sponsor name is required.'),
  region: z.string({ required_error: 'Please select a region.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function MembershipForm() {
  const [isAutofilling, setIsAutofilling] = React.useState(false);
  const { profile } = useAuth();
  const [files, setFiles] = React.useState<File[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      contactNumber: '',
      address: '',
      occupation: '',
      sponsoringEagle: '',
    },
  });

  async function onSubmit(data: FormValues) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
    });

    const documents = files.map(file => ({ type: file.type, url: '' /* Placeholder */, uploaded_at: new Date(), uploaded_by: profile?.id || '' }));
    formData.append('documents', JSON.stringify(documents));

    try {
        await createApplicationAction(formData);
        toast({ title: 'Application Submitted', description: 'Your application has been successfully submitted.' });
        form.reset();
        setFiles([]);
    } catch (error) {
        toast({ variant: 'destructive', title: 'Submission Failed', description: 'There was an error submitting your application.' });
    }
  }

  async function handleAiAutofill() {
    setIsAutofilling(true);
    try {
      const fieldLabels: Record<keyof FormValues, string> = {
        fullName: "Full Name",
        email: "Email Address",
        contactNumber: "Contact Number",
        address: "Home Address",
        occupation: "Occupation",
        sponsoringEagle: "Sponsoring Eagle's Name",
        region: "Eagle Region",
      };

      const suggestions = await intelligentFormCompletion({
        userRole: profile?.roleId || 'Member',
        formType: 'Membership application',
        currentFormFields: fieldLabels,
        previousFormData: {
            fullName: `${profile?.firstName} ${profile?.lastName}`,
            email: profile?.email,
            contactNumber: profile?.contactInfo,
        },
        organizationData: {
            defaultRegion: "ncr"
        }
      });
      
      for (const [key, value] of Object.entries(suggestions as any)) {
        if (value && key in form.getValues()) {
            form.setValue(key as keyof FormValues, value);
        }
      }

      toast({
        title: 'AI Autofill Complete',
        description: 'Suggested values have been filled in.',
      });

    } catch (error) {
      console.error('AI Autofill failed:', error);
      toast({
        variant: 'destructive',
        title: 'AI Autofill Failed',
        description: 'Could not fetch AI suggestions. Please fill the form manually.',
      });
    } finally {
      setIsAutofilling(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex justify-end">
            <Button type="button" variant="outline" onClick={handleAiAutofill} disabled={isAutofilling}>
                {isAutofilling ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-4 w-4 text-accent" />
                )}
                AI Autofill
            </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Juan Dela Cruz" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="juan.d.cruz@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <Input placeholder="0917-XXX-XXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Home Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Rizal St, Metro Manila" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="occupation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Occupation</FormLabel>
                <FormControl>
                  <Input placeholder="Software Engineer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sponsoringEagle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sponsoring Eagle</FormLabel>
                <FormControl>
                  <Input placeholder="Eagle John Smith" {...field} />
                </FormControl>
                <FormDescription>
                  The name of the eagle who is sponsoring your application.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Eagle Region</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your region" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ncr">National Capital Region (NCR)</SelectItem>
                    <SelectItem value="car">Cordillera Administrative Region (CAR)</SelectItem>
                    <SelectItem value="region1">Ilocos Region (Region I)</SelectItem>
                    <SelectItem value="region2">Cagayan Valley (Region II)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormItem>
            <FormLabel>Supporting Documents</FormLabel>
            <FormControl>
                <Input type="file" multiple onChange={e => setFiles(Array.from(e.target.files || []))} />
            </FormControl>
            <FormDescription>Upload any required documents (e.g., birth certificate, NBI clearance).</FormDescription>
        </FormItem>
        {files.length > 0 && (
            <div>
                <p className="font-medium">Uploaded Files:</p>
                <ul className="list-disc list-inside">
                    {files.map((file, i) => (
                        <li key={i} className="text-sm flex items-center justify-between">
                            <span>{file.name}</span>
                            <Button variant="ghost" size="sm" onClick={() => setFiles(files.filter((_, index) => index !== i))}><Trash2 className="h-4 w-4" /></Button>
                        </li>
                    ))}
                </ul>
            </div>
        )}
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => { form.reset(); setFiles([]); }}>Cancel</Button>
            <Button type="submit">Submit Application</Button>
        </div>
      </form>
    </Form>
  );
}
