"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Edit, Trash2, GitMerge, History, AlertTriangle, Eye } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ApplicationVersion {
  id: string;
  name: string;
  createdAt: string;
  lastModified: string;
  masterLastSynced: string;
  contentHash: string;
  templateUsed: string;
  hasUnsyncedChanges?: boolean;
  simulatedResumeContent: string;
  simulatedCoverLetterContent: string;
}

interface VersionCardProps {
  version: ApplicationVersion;
  isVersionOutOfSync: (version: ApplicationVersion) => boolean;
  onDelete: (id: string) => void;
  onDownload: (name: string) => void;
  onEdit: (version: ApplicationVersion) => void;
  onReviewUpdate: (version: ApplicationVersion) => void;
  onViewContent: (version: ApplicationVersion) => void;
}

const VersionCard: React.FC<VersionCardProps> = ({
  version,
  isVersionOutOfSync,
  onDelete,
  onDownload,
  onEdit,
  onReviewUpdate,
  onViewContent,
}) => {
  const outOfSync = isVersionOutOfSync(version);

  return (
    <div key={version.id} className="border p-5 rounded-lg shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-card hover:shadow-md transition-shadow">
      <div className="flex-grow space-y-1">
        <h3 className="text-xl font-semibold flex items-center gap-2 text-foreground">
          <FileText className="h-6 w-6 text-primary" /> {version.name}
        </h3>
        <p className="text-sm text-muted-foreground">Created: <span className="font-medium">{version.createdAt}</span></p>
        <p className="text-sm text-muted-foreground">Last Modified: <span className="font-medium">{version.lastModified}</span></p>
        <div className="flex flex-wrap gap-2 mt-3">
          {outOfSync && (
            <Badge variant="destructive" className="flex items-center gap-1 px-3 py-1 text-xs">
              <History className="h-3 w-3" /> Out of Sync
            </Badge>
          )}
          {version.hasUnsyncedChanges && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 flex items-center gap-1 px-3 py-1 text-xs">
              <AlertTriangle className="h-3 w-3" /> Local Edits
            </Badge>
          )}
          <Badge variant="outline" className="px-3 py-1 text-xs">Template: {version.templateUsed}</Badge>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 md:ml-4 justify-end">
        <Button variant="outline" size="sm" onClick={() => onViewContent(version)} className="px-3 py-1 h-auto text-sm">
          <Eye className="h-4 w-4 mr-2" /> View Content
        </Button>
        {outOfSync && (
          <Button variant="secondary" size="sm" onClick={() => onReviewUpdate(version)} className="px-3 py-1 h-auto text-sm">
            <GitMerge className="h-4 w-4 mr-2" /> Review Update
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={() => onEdit(version)} className="px-3 py-1 h-auto text-sm">
          <Edit className="h-4 w-4 mr-2" /> Edit
        </Button>
        <Button variant="outline" size="sm" onClick={() => onDownload(version.name)} className="px-3 py-1 h-auto text-sm">
          <Download className="h-4 w-4 mr-2" /> Download
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="px-3 py-1 h-auto text-sm">
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-md">
                This action cannot be undone. This will permanently delete your application version.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="py-2 px-4 text-base">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(version.id)} className="py-2 px-4 text-base bg-destructive text-destructive-foreground hover:bg-destructive/90">Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default VersionCard;