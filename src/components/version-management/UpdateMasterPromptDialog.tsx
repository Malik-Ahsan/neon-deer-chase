"use client";

import React from "react";
import { Button } from "@/components/ui/button";
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

interface SimulatedChange {
  id: string;
  description: string;
}

interface UpdateMasterPromptDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  version: ApplicationVersion | null;
  simulatedVersionChanges: SimulatedChange[];
  onUpdateMaster: () => void;
  onDismiss: () => void;
}

const UpdateMasterPromptDialog: React.FC<UpdateMasterPromptDialogProps> = ({
  isOpen,
  onOpenChange,
  version,
  simulatedVersionChanges,
  onUpdateMaster,
  onDismiss,
}) => {
  if (!version) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">Update Master Resume?</DialogTitle>
          <DialogDescription className="text-md mt-2">
            You've made changes to "{version.name}". Would you like to apply these changes to your master resume as well?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-4">
          <p className="text-sm text-muted-foreground">
            Applying changes to the master resume will update its content and potentially affect other versions that are synced with it.
          </p>
          <div className="border p-4 rounded-md bg-muted/50 shadow-sm">
            <h4 className="font-semibold text-lg mb-3 text-foreground">Simulated Changes from Version:</h4>
            <ul className="list-disc list-inside text-sm space-y-2 text-foreground">
              {simulatedVersionChanges.map((change, index) => (
                <li key={index} className="leading-relaxed">{change.description}</li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground mt-4">
              (In a full implementation, you would see a detailed diff of changes made in this version and have options to selectively merge.)
            </p>
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onDismiss} className="py-2 px-4 text-base">Don't Update Master</Button>
          <Button onClick={onUpdateMaster} className="py-2 px-4 text-base bg-primary text-primary-foreground hover:bg-primary/90">Update Master Resume</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateMasterPromptDialog;