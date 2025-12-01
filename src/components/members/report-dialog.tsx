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
import { Loader2, FileText, Download } from 'lucide-react';
import { generateMemberReport } from '@/ai/flows/generate-member-report';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import type { UserProfile } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: UserProfile[];
}

export function ReportDialog({
  isOpen,
  onClose,
  profiles,
}: ReportDialogProps) {
  const [csvContent, setCsvContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleGenerateReport = async () => {
    setIsLoading(true);
    setError('');
    setCsvContent('');

    if (!profiles || profiles.length === 0) {
      setError('No member data available to generate a report.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await generateMemberReport({ profiles });
      if (!result || !result.csv) {
        throw new Error("AI failed to return CSV content.");
      }
      setCsvContent(result.csv);
      toast({
        title: "Report Generated",
        description: "Your member report is ready for download.",
      });

    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to generate the report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (!csvContent) return;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `tfoe-pe-member-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setCsvContent('');
      setError('');
      setIsLoading(false);
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline">
            <FileText className="h-5 w-5 text-primary" />
            Generate Member Report
          </DialogTitle>
          <DialogDescription>
            Create a CSV export of the member directory.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Generating your report...</p>
            </div>
        ) : error ? (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        ) : csvContent ? (
           <div className="flex flex-col items-center justify-center h-48 gap-4">
               <FileText className="h-12 w-12 text-green-500"/>
                <h3 className="text-lg font-medium">Report Ready!</h3>
                <p className="text-sm text-center text-muted-foreground">Your member report has been generated successfully.<br/> Click the button below to download it.</p>
                <Button onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV
                </Button>
           </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-48 gap-4">
                <p className="text-center text-muted-foreground">Click the button below to start generating a CSV report for all {profiles.length} members.</p>
            </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
           {!csvContent && (
             <Button onClick={handleGenerateReport} disabled={isLoading}>
                {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                </>
                ) : (
                'Generate Report'
                )}
            </Button>
           )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}