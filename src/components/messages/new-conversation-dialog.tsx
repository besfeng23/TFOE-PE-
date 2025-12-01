'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useAuthUser, useFirestore, addDocumentNonBlocking } from "@/firebase";
import { collection, query, where, getDocs, serverTimestamp, doc } from 'firebase/firestore';
import type { UserProfile, Conversation } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface NewConversationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    profiles: UserProfile[];
    isLoading: boolean;
    onConversationStarted: (conversation: Conversation) => void;
}

export default function NewConversationDialog({ isOpen, onClose, profiles, isLoading, onConversationStarted }: NewConversationDialogProps) {
    const { user, profile: currentUserProfile } = useAuthUser();
    const firestore = useFirestore();
    const [isCreating, setIsCreating] = useState(false);

    const handleSelectUser = async (selectedProfile: UserProfile) => {
        if (!user || !firestore || !currentUserProfile) return;

        setIsCreating(true);

        try {
            // Check if a conversation already exists
            const conversationsRef = collection(firestore, 'conversations');
            const q = query(conversationsRef, where('participants', '==', [user.uid, selectedProfile.id].sort()));
            
            const existingConvos = await getDocs(q);

            if (!existingConvos.empty) {
                // Conversation already exists, just navigate to it
                const existingConvo = { ...existingConvos.docs[0].data(), id: existingConvos.docs[0].id } as Conversation;
                toast({ title: "Conversation already exists." });
                onConversationStarted(existingConvo);
            } else {
                // Create a new conversation
                const newConversationRef = doc(collection(firestore, 'conversations'));
                const newConversationData: Conversation = {
                    id: newConversationRef.id,
                    participants: [user.uid, selectedProfile.id].sort(),
                    participantDetails: [
                        { userId: user.uid, name: `${currentUserProfile.firstName} ${currentUserProfile.lastName}`, photoUrl: currentUserProfile.idPhotoUrl || '' },
                        { userId: selectedProfile.id, name: `${selectedProfile.firstName} ${selectedProfile.lastName}`, photoUrl: selectedProfile.idPhotoUrl || '' }
                    ],
                    lastMessage: {
                        text: 'Conversation started.',
                        senderId: user.uid,
                        timestamp: serverTimestamp() as any
                    }
                };

                await addDocumentNonBlocking(conversationsRef, newConversationData);
                onConversationStarted(newConversationData);
                toast({ title: `Started conversation with ${selectedProfile.firstName}.` });
            }
        } catch (error: any) {
            console.error("Failed to start conversation", error);
            toast({ variant: 'destructive', title: "Error", description: error.message });
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
                        {isLoading || isCreating ? (
                            <div className="flex items-center justify-center p-4">
                                <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                        ) : (
                            <>
                                <CommandEmpty>No members found.</CommandEmpty>
                                <CommandGroup>
                                    {profiles
                                        .filter(p => p.id !== user?.uid) // Exclude current user
                                        .map(p => (
                                        <CommandItem key={p.id} onSelect={() => handleSelectUser(p)} value={`${p.firstName} ${p.lastName} ${p.email}`}>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    {p.idPhotoUrl && <AvatarImage src={p.idPhotoUrl} />}
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
