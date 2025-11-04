"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, LayoutTemplate } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { mockTemplates } from "@/data/mockData";

interface Template {
  id: string;
  name: string;
  description: string;
  isPro: boolean;
}

interface TemplateSelectorProps {
  templates: Template[];
  selectedTemplate: string;
  setSelectedTemplate: (templateId: string) => void;
  isProOrProPlus: boolean;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  setSelectedTemplate,
  isProOrProPlus,
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium block text-foreground flex items-center gap-2">
        <LayoutTemplate className="h-5 w-5 text-primary" /> Template Options
      </Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockTemplates.map((template) => (
          <div
            key={template.id}
            className={cn(
              "relative p-4 border rounded-lg cursor-pointer transition-all duration-200 ease-in-out",
              "hover:border-primary hover:shadow-md",
              selectedTemplate === template.id ? "border-primary ring-2 ring-primary shadow-lg bg-primary/5" : "border-border bg-card",
              template.isPro && !isProOrProPlus && "opacity-60 cursor-not-allowed bg-muted/30"
            )}
            onClick={() => {
              if (template.isPro && !isProOrProPlus) {
                toast.error("This is a Pro template. Upgrade your plan to unlock!");
                navigate("/pricing");
                return;
              }
              setSelectedTemplate(template.id);
            }}
          >
            <h4 className="font-semibold text-lg text-foreground">{template.name}</h4>
            <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
            {template.isPro && (
              <Badge variant="secondary" className="absolute top-3 left-3 text-xs px-2 py-1">Pro</Badge>
            )}
            {selectedTemplate === template.id && (
              <CheckCircle className="absolute top-3 right-3 h-6 w-6 text-primary" />
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Advanced template gallery with live previews is out of scope for MVP.</p>
    </div>
  );
};

export default TemplateSelector;