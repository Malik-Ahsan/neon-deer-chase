"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText } from "lucide-react";

interface CoverLetterPreviewProps {
  coverLetterContent: string;
  coverLetterLength: string;
  setCoverLetterLength: (length: string) => void;
  customJobQuestions: string;
  setCustomJobQuestions: (questions: string) => void;
}

const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({
  coverLetterContent,
  coverLetterLength,
  setCoverLetterLength,
  customJobQuestions,
  setCustomJobQuestions,
}) => {
  return (
    <div className="border p-5 rounded-lg shadow-md space-y-4 bg-card">
      <h3 className="text-xl font-semibold flex items-center gap-2 text-foreground">
        <FileText className="h-6 w-6 text-primary" /> Draft Cover Letter
      </h3>
      <p className="text-sm text-muted-foreground mb-2">
        This draft is customized for the target role and company.
      </p>
      <div className="space-y-2">
        <Label htmlFor="cover-letter-length" className="text-sm font-medium text-foreground">Length</Label>
        <Select value={coverLetterLength} onValueChange={setCoverLetterLength}>
          <SelectTrigger id="cover-letter-length" className="h-10 text-base border-border focus-visible:ring-primary">
            <SelectValue placeholder="Select length" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="short">Short</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="long">Long</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="custom-questions" className="text-sm font-medium text-foreground">Custom Job Questions (Optional)</Label>
        <Textarea
          id="custom-questions"
          placeholder="e.g., 'What is your experience with agile methodologies?'"
          value={customJobQuestions}
          onChange={(e) => setCustomJobQuestions(e.target.value)}
          rows={3}
          className="resize-y text-sm border-border focus-visible:ring-primary"
        />
        <p className="text-xs text-muted-foreground">
          (In a full implementation, these questions would influence the cover letter content.)
        </p>
      </div>
      <Textarea
        value={coverLetterContent}
        readOnly
        rows={15}
        className="font-mono text-xs bg-muted/50 resize-none border-border p-3 rounded-md"
      />
    </div>
  );
};

export default CoverLetterPreview;