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
import { Input } from '@/components/ui/input';
import { Loader2, FileUp } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { toast } from '@/hooks/use-toast';
import type { UserProfile } from '@/lib/types';
import { extractMemberFromFile } from '@/ai/flows/extract-member-from-file';
import { Label } from '../ui/label';

interface AiImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (data: Partial<UserProfile>) => void;
}

export function AiImportDialog({
  isOpen,
  onClose,
  onImportComplete,
}: AiImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      setError('');
    }
  };

  const handleAnalyzeFile = async () => {
    if (!file) {
      setError('Please select a file to analyze.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const fileDataUri = reader.result as string;
        
        const extractedData = await extractMemberFromFile({ fileDataUri });

        toast({
          title: "Analysis Complete",
          description: "Member data has been extracted. Please review the details.",
        });

        onImportComplete(extractedData);
      };
      reader.onerror = (error) => {
        console.error('File reading error:', error);
        throw new Error("Failed to read the selected file.");
      }

    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to analyze the file. The AI model may have been unable to process it.');
      setIsLoading(false);
    } 
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setFile(null);
      setError('');
      setIsLoading(false);
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline">
            <FileUp className="h-5 w-5 text-primary" />
            AI-Powered Member Import
          </DialogTitle>
          <DialogDescription>
            Upload an image of an ID card or a document to automatically extract and fill member information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="file-upload">Select File</Label>
            <Input id="file-upload" type="file" onChange={handleFileChange} accept="image/*,application/pdf" />
          </div>

          {error && (
              <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
              </Alert>
          )}

          {file && !isLoading && (
            <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md border border-dashed">
                Selected file: <strong>{file.name}</strong>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center h-24 gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Analyzing file...</p>
            </div>
          )}
        </div>


        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleAnalyzeFile} disabled={isLoading || !file}>
            {isLoading ? (
            <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
            </>
            ) : (
              'Analyze & Add Member'
            )}
        </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
