'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { summarizeDocument } from '@/ai/flows/summarize-document-submissions';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface SummarizeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  documentText: string;
}

export function SummarizeDialog({
  isOpen,
  onClose,
  documentName,
  documentText,
}: SummarizeDialogProps) {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setError('');
    setSummary('');
    try {
      const result = await summarizeDocument({ documentText });
      setSummary(result.summary);
    } catch (e) {
      console.error(e);
      setError('Failed to generate summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      // Reset state on close
      setTimeout(() => {
        setSummary('');
        setError('');
        setIsLoading(false);
      }, 300);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline">
            <Sparkles className="h-5 w-5 text-accent" />
            AI Document Summary
          </DialogTitle>
          <DialogDescription>
            Generate a concise summary for: <strong>{documentName}</strong>
          </DialogDescription>
        </DialogHeader>

        {summary ? (
          <div className="prose prose-sm max-w-none rounded-md border p-4 text-foreground">
            <p>{summary}</p>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-md border border-dashed">
            Click &quot;Generate Summary&quot; to get an AI-powered overview of the document content.
          </div>
        )}

        {error && (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleGenerateSummary} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Summary'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
