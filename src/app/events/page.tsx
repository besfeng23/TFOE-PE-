import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const upcomingEvents = [
  {
    date: 'July 25, 2024',
    title: 'NEXECOM Meeting',
    type: 'Meeting',
    variant: 'secondary'
  },
  {
    date: 'July 30, 2024',
    title: 'General Membership Meeting (GMM)',
    type: 'GMM',
    variant: 'default'
  },
  {
    date: 'August 10, 2024',
    title: 'Community Outreach Program',
    type: 'Event',
    variant: 'outline'
  },
  {
    date: 'August 15, 2024',
    title: 'Regional Assembly',
    type: 'Assembly',
    variant: 'destructive'
  },
]


export default function EventsPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
                <CardContent className="p-0">
                    <Calendar
                        mode="single"
                        selected={new Date()}
                        className="p-3 w-full"
                    />
                </CardContent>
            </Card>
        </div>
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {upcomingEvents.map(event => (
                        <div key={event.title} className="flex items-start gap-4">
                            <div className="flex-1">
                                <p className="font-semibold">{event.title}</p>
                                <p className="text-sm text-muted-foreground">{event.date}</p>
                            </div>
                            <Badge variant={event.variant as any}>{event.type}</Badge>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
