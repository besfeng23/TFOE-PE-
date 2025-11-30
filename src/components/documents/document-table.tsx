'use client';

import React from 'react';
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
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Document } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

const documentCategories: { [key: string]: string } = {
    'Resolution': 'Resolution',
    'Meeting Minutes': 'Meeting Minutes',
    'Form': 'Form',
    'Financials': 'Financials',
    'default': 'Document'
}


export default function DocumentTable() {
  const [selectedDocument, setSelectedDocument] = React.useState<Document | null>(null);
  const firestore = useFirestore();

  const documentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'documents'), orderBy('uploadDate', 'desc'));
  }, [firestore]);

  const { data: documents, isLoading, error } = useCollection<Document>(documentsQuery);

  const getCategoryName = (categoryId: string) => {
    return documentCategories[categoryId] || documentCategories.default;
  }

  if (isLoading) {
    return (
        <div className="rounded-lg border">
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
      <div className="rounded-lg border">
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
            {documents && documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{getCategoryName(doc.categoryId)}</Badge>
                </TableCell>
                <TableCell>{doc.uploadDate.toDate().toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setSelectedDocument(doc)}>
                      <Sparkles className="h-4 w-4 text-accent" />
                       <span className="sr-only">Summarize</span>
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Preview</span>
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
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
