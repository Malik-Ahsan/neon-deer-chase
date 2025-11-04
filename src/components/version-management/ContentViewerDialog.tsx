"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface ContentToView {
  resume: string;
  coverLetter: string;
  name: string;
}

interface ContentViewerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  content: ContentToView | null;
}

const ContentViewerDialog: React.FC<ContentViewerDialogProps> = ({
  isOpen,
  onOpenChange,
  content,
}) => {
  if (!content) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-6">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-primary">Content for "{content.name}"</DialogTitle>
          <DialogDescription className="text-md mt-2">Review the generated resume and cover letter content.</DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto p-4 space-y-6 border rounded-md bg-muted/50 mt-4">
          <div>
            <h4 className="text-xl font-semibold mb-3 text-foreground">Resume Content:</h4>
            <Textarea
              value={content.resume}
              readOnly
              rows={15}
              className="font-mono text-sm bg-background resize-none h-auto min-h-[200px] border-border p-3 rounded-md"
            />
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-3 text-foreground">Cover Letter Content:</h4>
            <Textarea
              value={content.coverLetter}
              readOnly
              rows={15}
              className="font-mono text-sm bg-background resize-none h-auto min-h-[200px] border-border p-3 rounded-md"
            />
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button onClick={() => onOpenChange(false)} className="py-2 px-5 text-base">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContentViewerDialog;