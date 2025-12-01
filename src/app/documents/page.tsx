'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UploadCloud } from "lucide-react";
import DocumentTable from "@/components/documents/document-table";
import { UploadDocumentDialog } from "@/components/documents/upload-document-dialog";
import { useState } from "react";

export default function DocumentsPage() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documents..."
              className="pl-8"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <UploadCloud className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </div>
        </div>
        <DocumentTable />
      