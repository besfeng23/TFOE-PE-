
'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
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
    currentUser: UserProfile | null;
}

export default function NewConversationDialog({ isOpen, onClose, profiles, isLoading, onConversationStarted, currentUser }: NewConversationDialogProps) {
    const [isCreating, setIsCreating] = useState(false);

    const handleSelectUser = async (selectedProfile: UserProfile) => {
        if (!currentUser) return;
        // TODO: Connect to Supabase to check for existing conversation and create a new one if needed.
        console.log({selectedProfile, currentUser})
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
                                        .filter(p => p.id !== currentUser?.id) // Exclude current user
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
