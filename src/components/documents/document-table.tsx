'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, Sparkles } from 'lucide-react';
import { SummarizeDialog } from './summarize-dialog';
import type { Document } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { getDocuments } from '@/lib/repositories/client-only/documents';

const documentCategories: { [key: string]: string } = {
    'resolution': 'Resolution',
    'minutes': 'Meeting Minutes',
    'form': 'Form',
    'financials': 'Financials',
    'default': 'Document'
}


export default function DocumentTable() {
  const [selectedDocument, setSelectedDocument] = React.useState<Document | null>(null);

  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const data = await getDocuments();
        setDocuments(data || []);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocuments();
  }, []);


  const getCategoryName = (categoryId: string) => {
    return documentCategories[categoryId] || documentCategories.default;
  }
  
  const handleDownload = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  if (isLoading) {
    return (
        <div className="rounded-lg border overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
  }

  if (error) {
    return <div className='text-red-500'>Error loading documents: {error.message}</div>
  }


  return (
    <>
      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents && documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">
                  <div className='flex flex-col'>
                    <span>{doc.title}</span>
                    <Badge variant="secondary" className="sm:hidden mt-1 w-fit">{getCategoryName(doc.categoryId)}</Badge>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="secondary">{getCategoryName(doc.categoryId)}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setSelectedDocument(doc)}>
                      <Sparkles className="h-4 w-4 text-accent" />
                       <span className="sr-only">Summarize</span>
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleDownload(doc.fileUrl)}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Preview</span>
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleDownload(doc.fileUrl)}>
                      <Download className="h-4 w-4" />
                       <span className="sr-only">Download</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {documents && documents.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">No documents found.</div>
        )}
      </div>
      {selectedDocument && (
        <SummarizeDialog
            isOpen={!!selectedDocument}
            onClose={() => setSelectedDocument(null)}
            documentName={selectedDocument.title}
            documentText={selectedDocument.content || 'This document has no text content available for summary.'}
        />
      )}
    </>
  );
}
