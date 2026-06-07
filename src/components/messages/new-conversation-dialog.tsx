
'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import type { UserProfile, Conversation } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { createConversation } from "@/lib/repositories/conversations.repository";
import { addParticipant } from "@/lib/repositories/conversation_participants.repository";

interface NewConversationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    profiles: UserProfile[];
    onConversationStarted: (conversation: Conversation) => void;
}

export default function NewConversationDialog({ isOpen, onClose, profiles, onConversationStarted }: NewConversationDialogProps) {
    const [isCreating, setIsCreating] = useState(false);
    const { user } = useAuth();

    const handleSelectUser = async (selectedProfile: UserProfile) => {
        if (!user) return;
        setIsCreating(true);

        try {
            const newConvo = await createConversation();
            if (!newConvo) throw new Error('Failed to create conversation');

            const participant1 = { conversationId: newConvo.id, userId: user.id };
            const participant2 = { conversationId: newConvo.id, userId: selectedProfile.id };

            await addParticipant(participant1);
            await addParticipant(participant2);

            // This is a bit of a hack. We should be returning the full conversation object from the server.
            const newConvoWithDetails: Conversation = {
                ...newConvo,
                participantDetails: [selectedProfile, user],
            };

            onConversationStarted(newConvoWithDetails);

        } catch (error) {
            console.error('Error starting new conversation:', error);
            toast({
                title: "Error",
                description: "Failed to start a new conversation. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Message</DialogTitle>
                    <DialogDescription>Select a member to start a conversation with.</DialogDescription>
                </DialogHeader>
                <Command>
                    <CommandInput placeholder="Search for a member..." />
                    <CommandList>
                        {profiles.length === 0 || isCreating ? (
                            <div className="flex items-center justify-center p-4">
                                <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                        ) : (
                            <>
                                <CommandEmpty>No members found.</CommandEmpty>
                                <CommandGroup>
                                    {profiles
                                        .filter(p => p.id !== user?.id) // Exclude current user
                                        .map(p => (
                                        <CommandItem key={p.id} onSelect={() => handleSelectUser(p)} value={`${p.firstName} ${p.lastName} ${p.email}`}>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    {p.idPhotoUrl && <AvatarImage src={p.idPhotoEtag} />}
                                                    <AvatarFallback>{p.firstName?.charAt(0)}{p.lastName?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span>{p.firstName} {p.lastName}</span>
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </DialogContent>
        </Dialog>
    );
}
