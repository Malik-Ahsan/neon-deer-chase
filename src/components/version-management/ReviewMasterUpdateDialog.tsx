"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

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

interface ReviewMasterUpdateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  version: ApplicationVersion | null;
  masterResumeLastUpdated: string;
  simulatedMasterChanges: SimulatedChange[];
  selectedMasterChanges: string[];
  setSelectedMasterChanges: React.Dispatch<React.SetStateAction<string[]>>;
  onApplyUpdate: () => void;
}

const ReviewMasterUpdateDialog: React.FC<ReviewMasterUpdateDialogProps> = ({
  isOpen,
  onOpenChange,
  version,
  masterResumeLastUpdated,
  simulatedMasterChanges,
  selectedMasterChanges,
  setSelectedMasterChanges,
  onApplyUpdate,
}) => {
  if (!version) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">Review Master Resume Update for "{version.name}"</DialogTitle>
          <DialogDescription className="text-md mt-2">
            A new master resume update is available. Review the simulated changes below before applying.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-4">
          <p className="text-sm text-muted-foreground">
            Master resume was last updated on: <span className="font-semibold text-foreground">{masterResumeLastUpdated}</span>
          </p>
          <div className="border p-4 rounded-md bg-muted/50 shadow-sm">
            <h4 className="font-semibold text-lg mb-3 text-foreground">Simulated Changes Detected:</h4>
            <div className="space-y-3">
              {simulatedMasterChanges.map(change => (
                <div key={change.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={`master-change-${change.id}`}
                    checked={selectedMasterChanges.includes(change.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedMasterChanges(prev => [...prev, change.id]);
                      } else {
                        setSelectedMasterChanges(prev => prev.filter(id => id !== change.id));
                      }
                    }}
                    className="mt-1"
                  />
                  <Label
                    htmlFor={`master-change-${change.id}`}
                    className="text-sm font-medium leading-relaxed text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {change.description}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              (In a full implementation, you would see a detailed diff here and have options to selectively apply or ignore each change. For this MVP, clicking "Apply All Changes" will simulate applying all listed changes.)
            </p>
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="py-2 px-4 text-base">Dismiss</Button>
          <Button onClick={onApplyUpdate} className="py-2 px-4 text-base bg-primary text-primary-foreground hover:bg-primary/90">Apply All Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewMasterUpdateDialog;