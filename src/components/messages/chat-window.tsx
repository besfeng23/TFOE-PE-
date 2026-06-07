
'use client';

import { useState, useRef, useEffect } from 'react';
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import type { Conversation, Message, UserProfile } from "@/lib/types";
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { getMessages, createMessage } from '@/lib/repositories/messages.repository';

interface ChatWindowProps {
    conversation: Conversation;
}

export default function ChatWindow({ conversation }: ChatWindowProps) {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherParticipant = conversation.participantDetails.find(p => p.userId !== user?.id);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    if (!conversation.id) return;

    const fetchMessages = async () => {
        try {
            setIsLoading(true);
            const data = await getMessages(conversation.id);
            setMessages(data || []);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    fetchMessages();
  }, [conversation.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    const message: Omit<Message, 'id'> = {
        conversationId: conversation.id,
        senderId: user.id,
        text: newMessage.trim(),
        createdAt: new Date().toISOString(),
    };

    try {
        const newMsg = await createMessage(message);
        if (newMsg) {
            setMessages(prev => [...prev, newMsg]);
        }
        setNewMessage("");
    } catch (error) {
        console.error("Error sending message:", error);
    }
  };

  if (!otherParticipant) return null;

  return (
    <>
      <CardHeader className="flex-row items-center gap-3 space-y-0 border-b">
        <Avatar>
          {otherParticipant.photoUrl && <AvatarImage src={otherParticipant.photoUrl} />}
          <AvatarFallback>{otherParticipant.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="font-headline text-lg">{otherParticipant.name}</CardTitle>
          {/* <CardDescription>Online</CardDescription> */}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto">
        <div className="flex-1 space-y-4">
            {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-10 w-3/4 ml-auto" />
                    <Skeleton className="h-10 w-1/2" />
                </div>
            ) : error ? (
                <div className="text-center text-destructive">Error loading messages.</div>
            ) : messages.map((msg) => (
                <div key={msg.id} className={cn("flex items-end gap-2", msg.senderId === user?.id ? "justify-end" : "justify-start")}>
                     {msg.senderId !== user?.id && (
                         <Avatar className="h-8 w-8">
                             {otherParticipant.photoUrl && <AvatarImage src={otherParticipant.photoUrl} />}
                             <AvatarFallback>{otherParticipant.name?.charAt(0)}</AvatarFallback>
                         </Avatar>
                     )}
                    <div className={cn("p-2 rounded-lg max-w-xs md:max-w-md", msg.senderId === user?.id ? "bg-primary text-primary-foreground" : "bg-muted")}>
                        <p>{msg.text}</p>
                    </div>
                    {msg.senderId === user?.id && (
                         <Avatar className="h-8 w-8">
                             {profile?.photoUrl && <AvatarImage src={profile.photoUrl} />}
                             <AvatarFallback>{profile?.firstName?.charAt(0) || 'U'}</AvatarFallback>
                         </Avatar>
                     )}
                </div>
            ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2 pt-4 border-t">
          <Input 
            placeholder="Type a message..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={!conversation}
          />
          <Button size="icon" onClick={handleSendMessage} disabled={!newMessage.trim() || !conversation}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </>
  );
}
