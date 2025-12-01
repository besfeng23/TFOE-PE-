'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthUser } from '@/firebase';
import { format } from 'date-fns';
import { Calendar, MoveRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function DashboardHero() {
  const { profile } = useAuthUser();

  return (
    <Card className="relative overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1541410965328-3f921a43c518?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Philippine Eagle"
        fill
        className="object-cover object-center"
        data-ai-hint="philippine eagle"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/80 to-transparent" />
      <div className="relative p-6 md:p-8 space-y-4">
        <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg max-w-2xl">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Calendar className="size-4" />
            {format(new Date(), 'eeee, MMMM dd, yyyy')}
            </p>
            <h1 className="text-3xl sm:text-4xl font-headline font-bold text-foreground mt-2">
            Welcome back, {profile?.firstName || 'User'}!
            </h1>
            <p className="text-muted-foreground mt-2">
            Here’s a quick overview of your nest. Ready to fly?
            </p>
            <Link href="/events">
                <Button className="mt-4">
                View Events
                <MoveRight className="ml-2" />
                </Button>
            </Link>
        </div>
      </div>
    </Card>
  );
}
