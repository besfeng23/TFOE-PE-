
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const formSchema = z.object({
  newPassword: z.string().min(6, "New password must be at least 6 characters."),
});

export default function SecuritySettings() {
    const [isSaving, setIsSaving] = useState(false);
    const supabase = createClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newPassword: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSaving(true);

        try {
            const { error } = await supabase.auth.updateUser({ password: values.newPassword });

            if (error) {
                throw error;
            }

            toast({ title: "Password Updated", description: "Your password has been changed successfully." });
            form.reset();
        } catch (error: any) {
            console.error("Password update error:", error);
            toast({ variant: 'destructive', title: "Update Failed", description: error.message });
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Card>
            <CardHeader>
            <CardTitle className="font-headline">Security</CardTitle>
            <CardDescription>
                Manage your password and two-factor authentication.
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                         <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Password
                        </Button>
                    </form>
                </Form>

                <div className="flex items-center space-x-2 pt-4 border-t">
                    <Switch id="2fa" disabled/>
                    <Label htmlFor="2fa">Enable Two-Factor Authentication (GCash)</Label>
                </div>
            </CardContent>
        </Card>
    );
}
