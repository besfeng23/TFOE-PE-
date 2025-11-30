'use client';

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ConversationList from "@/components/messages/conversation-list";
import ChatWindow from "@/components/messages/chat-window";
import { MessageCircle, Pencil } from "lucide-react";
import type { Conversation, UserProfile } from "@/lib/types";
import { useAuthUser, useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import NewConversationDialog from "@/components/messages/new-conversation-dialog";
import { Button } from "@/components/ui/button";

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isNewConvoDialogOpen, setIsNewConvoDialogOpen] = useState(false);
  const firestore = useFirestore();
  const { user } = useAuthUser();

  const usersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'userProfiles'));
  }, [firestore, user]);

  const { data: profiles, isLoading: profilesLoading } = useCollection<UserProfile>(usersQuery);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleStartConversation = (newConversation: Conversation) => {
    setSelectedConversation(newConversation);
    setIsNewConvoDialogOpen(false);
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-[calc(100vh-10rem)]">
        <Card className="md:col-span-1 lg:col-span-1 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-headline">Conversations</CardTitle>
            <Button size="icon" variant="ghost" onClick={() => setIsNewConvoDialogOpen(true)}>
              <Pencil className="h-4 w-4"/>
              <span className="sr-only">New Message</span>
            </Button>
          </CardHeader>
          <CardContent className="p-2 flex-1 overflow-y-auto">
            <ConversationList 
              onSelectConversation={handleSelectConversation}
              selectedConversationId={selectedConversation?.id}
            />
          </CardContent>
        </Card>
        <Card className="md:col-span-2 lg:col-span-3 flex flex-col">
          {selectedConversation ? (
            <ChatWindow 
              conversation={selectedConversation} 
              key={selectedConversation.id} 
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
              <MessageCircle className="h-16 w-16 mb-4" />
              <h3 className="text-xl font-semibold">Select a conversation</h3>
              <p>Choose a conversation from the list to start chatting, or start a new one.</p>
            </div>
          )}
        </Card>
      </div>
      <NewConversationDialog 
        isOpen={isNewConvoDialogOpen}
        onClose={() => setIsNewConvoDialogOpen(false)}
        profiles={profiles || []}
        isLoading={profilesLoading}
        onConversationStarted={handleStartConversation}
      />
    </>
  );
}

    