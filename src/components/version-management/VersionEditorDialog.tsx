"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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

interface VersionEditorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  version: ApplicationVersion | null;
  editingResumeContent: string;
  setEditingResumeContent: React.Dispatch<React.SetStateAction<string>>;
  editingCoverLetterContent: string;
  setEditingCoverLetterContent: React.Dispatch<React.SetStateAction<string>>;
  onSaveEdits: () => void;
}

const VersionEditorDialog: React.FC<VersionEditorDialogProps> = ({
  isOpen,
  onOpenChange,
  version,
  editingResumeContent,
  setEditingResumeContent,
  editingCoverLetterContent,
  setEditingCoverLetterContent,
  onSaveEdits,
}) => {
  if (!version) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-6">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-primary">Edit Application Version: "{version.name}"</DialogTitle>
          <DialogDescription className="text-md mt-2">
            Modify the resume and cover letter content for this specific version.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto p-4 space-y-6 border rounded-md bg-muted/50 mt-4">
          <div>
            <Label htmlFor="edit-resume-content" className="text-xl font-semibold mb-3 block text-foreground">Resume Content</Label>
            <Textarea
              id="edit-resume-content"
              value={editingResumeContent}
              onChange={(e) => setEditingResumeContent(e.target.value)}
              rows={15}
              className="font-mono text-sm resize-y h-auto min-h-[200px] border-border p-3 rounded-md bg-background"
            />
          </div>
          <div>
            <Label htmlFor="edit-cover-letter-content" className="text-xl font-semibold mb-3 block text-foreground">Cover Letter Content</Label>
            <Textarea
              id="edit-cover-letter-content"
              value={editingCoverLetterContent}
              onChange={(e) => setEditingCoverLetterContent(e.target.value)}
              rows={15}
              className="font-mono text-sm resize-y h-auto min-h-[200px] border-border p-3 rounded-md bg-background"
            />
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="py-2 px-5 text-base">Cancel</Button>
          <Button onClick={onSaveEdits} className="py-2 px-5 text-base bg-primary text-primary-foreground hover:bg-primary/90">
            <Save className="h-5 w-5 mr-2" /> Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VersionEditorDialog;