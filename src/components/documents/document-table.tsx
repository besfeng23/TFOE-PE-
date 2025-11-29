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

const documents = [
  {
    name: 'Resolution No. 2024-01',
    category: 'Resolution',
    date: '2024-07-15',
    content: 'A resolution for the approval of the new regional budget for the fiscal year 2025. It details the allocation of funds across various committees and projects, including community service initiatives, infrastructure development, and administrative costs. The budget proposal was prepared by the finance committee and reviewed by the executive board.'
  },
  {
    name: 'Minutes of GMM - June 2024',
    category: 'Meeting Minutes',
    date: '2024-06-30',
    content: 'The General Membership Meeting held in June 2024 discussed several key topics. The meeting started with an opening prayer, followed by the reading and approval of the previous meeting\'s minutes. The treasurer presented the financial report, showing a healthy balance. A major point of discussion was the upcoming national convention, including travel arrangements and delegate responsibilities. Several new members were also inducted during the meeting.'
  },
  {
    name: 'Project Proposal: Community Pantry',
    category: 'Form',
    date: '2024-06-20',
    content: 'This document outlines a proposal for establishing a community pantry to serve underprivileged families in the local area. The proposal includes the project rationale, objectives, budget requirements, and implementation timeline. It requests a seed fund of PHP 50,000 to cover initial supplies and logistics. The project will be managed by the social services committee.'
  },
  {
    name: 'Financial Report - Q2 2024',
    category: 'Financials',
    date: '2024-07-05',
    content: 'The second quarter financial report for 2024 presents a comprehensive overview of the organization\'s financial performance from April to June. It includes a balance sheet, income statement, and cash flow statement. Total revenues were up by 15% compared to the previous quarter, primarily due to successful fundraising events. Expenses were managed within the approved budget.'
  },
];

export default function DocumentTable() {
    const [selectedDocument, setSelectedDocument] = React.useState<{name: string, content: string} | null>(null);

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
            {documents.map((doc) => (
              <TableRow key={doc.name}>
                <TableCell className="font-medium">{doc.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{doc.category}</Badge>
                </TableCell>
                <TableCell>{doc.date}</TableCell>
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
      </div>
      {selectedDocument && (
        <SummarizeDialog
            isOpen={!!selectedDocument}
            onClose={() => setSelectedDocument(null)}
            documentName={selectedDocument.name}
            documentText={selectedDocument.content}
        />
      )}
    </>
  );
}
