import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

const contacts = [
    { name: "Juan Dela Cruz", lastMessage: "Okay, will check on that.", initial: "JD", status: "online" },
    { name: "Admin", lastMessage: "Your report has been approved.", initial: "A", status: "offline" },
    { name: "Finance Committee", lastMessage: "Reminder: Q3 budget due soon.", initial: "FC", status: "online" },
]

export default function MessagesPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-[calc(100vh-10rem)]">
        <Card className="md:col-span-1 lg:col-span-1">
            <CardHeader>
                <CardTitle className="font-headline">Contacts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {contacts.map(contact => (
                    <div key={contact.name} className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-muted">
                        <Avatar>
                            <AvatarFallback>{contact.initial}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="font-medium">{contact.name}</p>
                            <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                        </div>
                         {contact.status === 'online' && <div className="h-2 w-2 rounded-full bg-green-500"></div>}
                    </div>
                ))}
            </CardContent>
        </Card>
        <Card className="md:col-span-2 lg:col-span-3 flex flex-col">
            <CardHeader className="flex-row items-center gap-3 space-y-0">
                <Avatar>
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="font-headline text-lg">Juan Dela Cruz</CardTitle>
                  <CardDescription>Online</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-start">
                        <div className="bg-muted p-3 rounded-lg max-w-xs">
                            <p>Good morning! Can you please send me the minutes of the last meeting?</p>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-xs">
                            <p>Sure, I'll send it over in a bit. Just finalizing the attendance.</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Input placeholder="Type a message..." />
                    <Button size="icon"><Send className="h-4 w-4"/></Button>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}
