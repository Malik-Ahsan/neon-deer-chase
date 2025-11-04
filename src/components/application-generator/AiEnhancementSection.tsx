"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, CheckCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { mockAiSuggestions, SimulatedChange } from "@/data/mockData";

interface AiEnhancementSectionProps {
  aiSuggestions: string[];
  setAiSuggestions: React.Dispatch<React.SetStateAction<string[]>>;
  appliedSuggestions: string[];
  setAppliedSuggestions: React.Dispatch<React.SetStateAction<string[]>>;
  isProPlus: boolean;
}

const AiEnhancementSection: React.FC<AiEnhancementSectionProps> = ({
  aiSuggestions,
  setAiSuggestions,
  appliedSuggestions,
  setAppliedSuggestions,
  isProPlus,
}) => {
  const navigate = useNavigate();

  const handleGenerateAISuggestions = () => {
    if (!isProPlus) {
      toast.error("Upgrade to Pro+ to unlock AI Resume Enhancement Suggestions.");
      navigate("/pricing");
      return;
    }
    setAiSuggestions(mockAiSuggestions.map(s => s.description));
    toast.success("AI suggestions generated! Review and apply them.");
  };

  const handleApplySuggestion = (suggestion: string) => {
    if (!isProPlus) {
      toast.error("Upgrade to Pro+ to apply AI Resume Enhancement Suggestions.");
      navigate("/pricing");
      return;
    }
    if (!appliedSuggestions.includes(suggestion)) {
      setAppliedSuggestions(prev => [...prev, suggestion]);
      toast.info(`Suggestion applied: "${suggestion}" (Simulated)`);
    } else {
      toast.warning("This suggestion has already been applied.");
    }
  };

  return (
    <div className="space-y-4 p-5 rounded-lg bg-muted/20 border border-border shadow-sm">
      <h3 className="text-xl font-semibold flex items-center gap-3 text-foreground">
        <Sparkles className="h-6 w-6 text-purple-500" /> AI Resume Enhancement Suggestions <Badge variant="outline" className="ml-2 text-xs px-2 py-1">Pro+ Feature</Badge>
      </h3>
      {!isProPlus && (
        <p className="text-sm text-red-500">
          Upgrade to Pro+ to unlock and use AI resume enhancement suggestions.
        </p>
      )}
      <Button
        className="w-full py-2 text-base font-semibold shadow-sm hover:shadow-md transition-shadow"
        onClick={handleGenerateAISuggestions}
        disabled={!isProPlus}
      >
        Generate AI Suggestions
      </Button>
      {aiSuggestions.length > 0 && (
        <div className="mt-4 space-y-3">
          <Label className="text-sm font-medium block text-foreground">Suggestions:</Label>
          {aiSuggestions.map((suggestion, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-md bg-background shadow-sm">
              <p className="text-sm text-foreground">{suggestion}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleApplySuggestion(suggestion)}
                disabled={appliedSuggestions.includes(suggestion) || !isProPlus}
                className="text-xs px-3 py-1 h-auto"
              >
                {appliedSuggestions.includes(suggestion) ? "Applied" : "Apply"}
              </Button>
            </div>
          ))}
        </div>
      )}
      {appliedSuggestions.length > 0 && (
        <div className="mt-4">
          <Label className="text-sm font-medium block text-foreground">Applied Enhancements:</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {appliedSuggestions.map((suggestion, index) => (
              <Badge key={index} variant="default" className="flex items-center gap-1 px-3 py-1 text-xs">
                <CheckCircle className="h-3 w-3" /> {suggestion.substring(0, 30)}...
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AiEnhancementSection;