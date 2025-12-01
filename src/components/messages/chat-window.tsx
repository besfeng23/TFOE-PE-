'use client';

import { useState, useRef, useEffect } from 'react';
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useAuthUser, useCollection, useFirestore, useMemoFirebase, addDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase";
import type { Conversation, Message } from "@/lib/types";
import { collection, query, orderBy, serverTimestamp, doc } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

interface ChatWindowProps {
    conversation: Conversation;
}

export default function ChatWindow({ conversation }: ChatWindowProps) {
  const { user } = useAuthUser();
  const firestore = useFirestore();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherParticipant = conversation.participantDetails.find(p => p.userId !== user?.uid);

  const messagesQuery = useMemoFirebase(() => {
    if (!firestore || !conversation) return null;
    return query(collection(firestore, `conversations/${conversation.id}/messages`), orderBy('timestamp', 'asc'));
  }, [firestore, conversation]);

  const { data: messages, isLoading } = useCollection<Message>(messagesQuery);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const handleSendMessage = () => {
    if (!firestore || !user || !newMessage.trim()) return;

    const messagesCollection = collection(firestore, `conversations/${conversation.id}/messages`);
    const messageData = {
      senderId: user.uid,
      text: newMessage.trim(),
      timestamp: serverTimestamp(),
    };
    addDocumentNonBlocking(messagesCollection, messageData);
    
    // Update the last message on the conversation
    const conversationRef = doc(firestore, 'conversations', conversation.id);
    updateDocumentNonBlocking(conversationRef, {
        lastMessage: {
            text: newMessage.trim(),
            senderId: user.uid,
            timestamp: serverTimestamp(),
        }
    });

    setNewMessage("");
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
          {isLoading && (
            <>
              <div className="flex justify-start items-center gap-2"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-8 w-40 rounded-lg"/></div>
              <div className="flex justify-end items-center gap-2"><Skeleton className="h-8 w-48 rounded-lg"/><Skeleton className="h-10 w-10 rounded-full" /></div>
              <div className="flex justify-start items-center gap-2"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-8 w-32 rounded-lg"/></div>
            </>
          )}
          {messages?.map((message) => (
            <div
              key={message.id}
              className={cn('flex items-end gap-2', message.senderId === user?.uid ? 'justify-end' : 'justify-start')}
            >
              {message.senderId !== user?.uid && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getSenderInitial(message.senderId)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'p-3 rounded-lg max-w-xs md:max-w-md',
                  message.senderId === user?.uid
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <p className="text-sm">{message.text}</p>
              </div>
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
      </