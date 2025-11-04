"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";

interface ResumePreviewProps {
  resumeContent: string;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeContent }) => {
  return (
    <div className="border p-5 rounded-lg shadow-md space-y-4 bg-card">
      <h3 className="text-xl font-semibold flex items-center gap-2 text-foreground">
        <FileText className="h-6 w-6 text-primary" /> Tailored Resume
      </h3>
      <p className="text-sm text-muted-foreground mb-2">
        This resume is curated based on the job description and your tagged experience.
      </p>
      <Textarea
        value={resumeContent}
        readOnly
        rows={15}
        className="font-mono text-xs bg-muted/50 resize-none border-border p-3 rounded-md"
      />
    </div>
  );
};

export default ResumePreview;