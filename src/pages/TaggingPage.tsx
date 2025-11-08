"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, XCircle, Tag, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getExperienceEntries, updateExperienceTags } from "@/services/resumeService";
import Navbar from "@/components/Navbar";

export interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  description: string;
  functionalRoles: string[];
  industryDomains: string[];
}

const TaggingSection = () => {
  const [experienceEntries, setExperienceEntries] = useState<ExperienceEntry[]>([]);
  const [newTagInput, setNewTagInput] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExperienceEntries = async () => {
      try {
        const data = await getExperienceEntries();
        const sanitizedData = data.map((entry: any) => ({
          ...entry,
          functionalRoles: entry.functionalRoles || [],
          industryDomains: entry.industryDomains || [],
        }));
        setExperienceEntries(sanitizedData);
        toast.success("Successfully loaded experience entries.");
      } catch (error) {
        console.error("Failed to fetch experience entries:", error);
        toast.error("Failed to load experience entries. Please try again later.");
      }
    };

    fetchExperienceEntries();
  }, []);

  const handleAddTag = (entryId: string, type: "functionalRoles" | "industryDomains") => {
    const tag = newTagInput[entryId]?.trim();
    if (tag && tag.length > 0 && !experienceEntries.find(e => e.id === entryId)?.[type].includes(tag)) {
      setExperienceEntries(prevEntries =>
        prevEntries.map(entry =>
          entry.id === entryId
            ? { ...entry, [type]: [...entry[type], tag] }
            : entry
        )
      );
      setNewTagInput(prev => ({ ...prev, [entryId]: "" }));
      toast.success(`Tag "${tag}" added.`);
    } else if (tag && experienceEntries.find(e => e.id === entryId)?.[type].includes(tag)) {
      toast.warning(`Tag "${tag}" already exists.`);
    }
  };

  const handleRemoveTag = (entryId: string, type: "functionalRoles" | "industryDomains", tagToRemove: string) => {
    setExperienceEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === entryId
          ? { ...entry, [type]: entry[type].filter(tag => tag !== tagToRemove) }
          : entry
      )
    );
    toast.info(`Tag "${tagToRemove}" removed.`);
  };

  const handleSaveTags = async () => {
    try {
      await updateExperienceTags(experienceEntries);
      toast.success("Tags saved successfully!");
      console.log("Saved Tags:", experienceEntries);
      navigate("/job-description-input");
    } catch (error) {
      console.error("Failed to save tags:", error);
      toast.error("Failed to save tags. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 flex items-center justify-center">
        <Card className="w-full max-w-4xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-4xl font-bold text-primary flex items-center justify-center gap-3">
              <Tag className="h-9 w-9" /> Review and Tag Your Work Experience
            </CardTitle>
            <CardDescription className="text-md mt-2">
              Review the automatically generated tags for functional roles and industry domains. You can add or remove them as needed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-6">
            {experienceEntries.length === 0 && (
              <div className="text-center text-muted-foreground p-8 border rounded-lg bg-muted/50">
                <p className="text-lg font-semibold mb-2">No experience entries to tag.</p>
                <p className="text-sm">Please go back to the Master Resume page to upload or enter your experience.</p>
                <Button onClick={() => navigate("/master-resume")} className="mt-4">Go to Master Resume</Button>
              </div>
            )}
            {experienceEntries.map(entry => (
              <div key={entry.id} className="border p-5 rounded-lg shadow-sm space-y-4 bg-card hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-foreground">{entry.title} at {entry.company}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{entry.description}</p>

                <div>
                  <Label className="text-sm font-medium mb-2 block text-foreground">Functional Roles:</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {entry.functionalRoles.map(tag => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1 px-3 py-1 text-sm">
                        {tag}
                        <XCircle className="h-3 w-3 cursor-pointer ml-1 text-muted-foreground hover:text-foreground transition-colors" onClick={() => handleRemoveTag(entry.id, "functionalRoles", tag)} />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add functional role"
                      value={newTagInput[entry.id] || ""}
                      onChange={(e) => setNewTagInput(prev => ({ ...prev, [entry.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddTag(entry.id, "functionalRoles");
                        }
                      }}
                      className="h-10 text-base border-border focus-visible:ring-primary"
                    />
                    <Button variant="outline" size="icon" onClick={() => handleAddTag(entry.id, "functionalRoles")} className="h-10 w-10">
                      <PlusCircle className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block text-foreground">Industry Domains:</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {entry.industryDomains.map(tag => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1 px-3 py-1 text-sm">
                        {tag}
                        <XCircle className="h-3 w-3 cursor-pointer ml-1 text-muted-foreground hover:text-foreground transition-colors" onClick={() => handleRemoveTag(entry.id, "industryDomains", tag)} />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add industry domain"
                      value={newTagInput[entry.id] || ""}
                      onChange={(e) => setNewTagInput(prev => ({ ...prev, [entry.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddTag(entry.id, "industryDomains");
                        }
                      }}
                      className="h-10 text-base border-border focus-visible:ring-primary"
                    />
                    <Button variant="outline" size="icon" onClick={() => handleAddTag(entry.id, "industryDomains")} className="h-10 w-10">
                      <PlusCircle className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {experienceEntries.length > 0 && (
              <Button className="w-full py-2 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow" onClick={handleSaveTags}>
                Save Tags and Continue <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TaggingSection;