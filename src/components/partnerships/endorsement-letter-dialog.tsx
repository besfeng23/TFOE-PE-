'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Clipboard, Check } from 'lucide-react';
import { generateEndorsementLetter } from '@/ai/flows/generate-endorsement-letter';
import { addDocumentNonBlocking, useAuthUser, useFirestore } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import type { Partnership } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface EndorsementLetterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  partner: Partnership;
}

export function EndorsementLetterDialog({
  isOpen,
  onClose,
  partner,
}: EndorsementLetterDialogProps) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [copiedField, setCopiedField] = useState<'subject' | 'body' | null>(null);
  
  const firestore = useFirestore();
  const { user } = useAuthUser();

  const handleGenerateLetter = async () => {
    setIsLoading(true);
    setError('');
    setSubject('');
    setBody('');
    setIsGenerated(false);

    try {
      const result = await generateEndorsementLetter({ 
          partnerName: partner.name,
          contactPerson: partner.contactPerson,
          partnershipType: partner.partnershipType,
      });

      setSubject(result.subject);
      setBody(result.body);
      setIsGenerated(true);
      toast({
        title: "Letter Generated",
        description: "The endorsement letter has been created successfully.",
      });
      
      // Save the endorsement to Firestore
      if (firestore && user) {
        const endorsementData = {
          partnershipId: partner.id,
          subject: result.subject,
          body: result.body,
          generatedDate: new Date(),
          generatedByUserId: user.uid,
        };
        const docRef = doc(collection(firestore, 'endorsements'));
        addDocumentNonBlocking(collection(firestore, 'endorsements'), {...endorsementData, id: docRef.id});
      }

    } catch (e) {
      console.error(e);
      setError('Failed to generate the endorsement letter. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopyToClipboard = (field: 'subject' | 'body') => {
    const textToCopy = field === 'subject' ? subject : body;
    navigator.clipboard.writeText(textToCopy);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }

  const handleClose = () => {
    onClose();
    // Reset state after a short delay to allow dialog to close smoothly
    setTimeout(() => {
      setSubject('');
      setBody('');
      setError('');
      setIsLoading(false);
      setIsGenerated(false);
    }, 300);
  };
  
  useEffect(() => {
    if (isOpen) {
        handleGenerateLetter();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline">
            <Sparkles className="h-5 w-5 text-accent" />
            AI Endorsement Letter Generator
          </DialogTitle>
          <DialogDescription>
            Generated endorsement for: <strong>{partner.name}</strong>
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                <p>Generating letter...</p>
            </div>
        ) : error ? (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        ) : isGenerated ? (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="space-y-2 relative">
              <label className="text-sm font-medium">Subject</label>
              <Input value={subject} readOnly className="pr-10"/>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-6 h-8 w-8"
                onClick={() => handleCopyToClipboard('subject')}
              >
                {copiedField === 'subject' ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
              </Button>
            </div>
             <div className="space-y-2 relative">
              <label className="text-sm font-medium">Body</label>
              <Textarea value={body} readOnly rows={15} className="pr-10"/>
               <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-6 h-8 w-8"
                onClick={() => handleCopyToClipboard('body')}
              >
                 {copiedField === 'body' ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
          <Button onClick={handleGenerateLetter} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Regenerating...
              </>
            ) : (
              'Regenerate'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
