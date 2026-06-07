
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

interface ChatWindowProps {
    conversation: Conversation;
    currentUser: UserProfile;
}

export default function ChatWindow({ conversation, currentUser }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherParticipant = conversation.participantDetails.find(p => p.userId !== currentUser?.id);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const handleSendMessage = () => {
    // TODO: Connect to Supabase
  };

  const getSenderInitial = (senderId: string) => {
    const participant = conversation.participantDetails.find(p => p.userId === senderId);
    return participant?.name?.charAt(0) || 'U';
  }

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
