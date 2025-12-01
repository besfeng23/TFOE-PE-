'use client';

import React from 'react';
import { useAuthUser, useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy } from 'firebase/firestore';
import type { Conversation } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { formatDistanceToNow } from 'date-fns';
import { cn } from "@/lib/utils";

interface ConversationListProps {
    onSelectConversation: (conversation: Conversation) => void;
    selectedConversationId?: string | null;
}

export default function ConversationList({ onSelectConversation, selectedConversationId }: ConversationListProps) {
    const { user } = useAuthUser();
    const firestore = useFirestore();

    const conversationsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(
            collection(firestore, 'conversations'),
            where('participants', 'array-contains', user.uid)
        );
    }, [firestore, user]);

    const { data: conversations, isLoading, error } = useCollection<Conversation>(conversationsQuery);
    
    // Sort conversations on the client-side after fetching
    const sortedConversations = React.useMemo(() => {
        if (!conversations) return [];
        return [...conversations].sort((a, b) => {
            const aTimestamp = a.lastMessage?.timestamp?.toDate() || new Date(0);
            const bTimestamp = b.lastMessage?.timestamp?.toDate() || new Date(0);
            return bTimestamp.getTime() - aTimestamp.getTime();
        });
    }, [conversations]);


    if (isLoading) {
        return (
            <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }
    
    if (error) {
        return <div className="text-destructive text-sm p-4">Error: {error.message}</div>
    }

    if (!sortedConversations || sortedConversations.length === 0) {
        return <div className="text-center text-muted-foreground p-4 text-sm">No conversations yet. Start a new one!</div>
    }

    return (
        <div className="space-y-1">
            {sortedConversations.map(convo => {
                const otherParticipant = convo.participantDetails.find(p => p.userId !== user?.uid);
                if (!otherParticipant) return null; // Should not happen in 1-on-1 chats

                return (
                    <div 
                        key={convo.id} 
                        className={cn(
                            "flex items-start gap-3 cursor-pointer p-2 rounded-md",
                             selectedConversationId === convo.id ? 'bg-muted' : 'hover:bg-muted/50'
                        )}
                        onClick={() => onSelectConversation(convo)}
                    >
                        <Avatar>
                            {otherParticipant.photoUrl && <AvatarImage src={otherParticipant.photoUrl} />}
                            <AvatarFallback>{otherParticipant.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                            <div className="flex justify-between items-center">
                                <p className="font-medium truncate">{otherParticipant.name}</p>
                                {convo.lastMessage?.timestamp && (
                                     <p className="text-xs text-muted-foreground whitespace-nowrap">
                                        {formatDistanceToNow(convo.lastMessage.timestamp.toDate(), { addSuffix: true })}
                                     </p>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{convo.lastMessage?.text || 'No messages yet'}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
