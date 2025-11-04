"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { mockExperienceEntries, ExperienceEntry } from "@/data/mockData"; // Import mock data

const TaggingSection = () => {
  const [experienceEntries, setExperienceEntries] = useState<ExperienceEntry[]>([]);
  const [newTagInput, setNewTagInput] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    // Attempt to load processed experience from localStorage
    const storedExperience = localStorage.getItem('processedExperience');
    if (storedExperience) {
      setExperienceEntries(JSON.parse(storedExperience));
      toast.info("Loaded processed resume data for tagging.");
    } else {
      // Fallback to mock data if no processed data is found
      setExperienceEntries(mockExperienceEntries);
      toast.info("Using mock experience data for tagging.");
    }
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

  const handleSaveTags = () => {
    // Save the current state of experience entries (with updated tags) to localStorage
    localStorage.setItem('processedExperience', JSON.stringify(experienceEntries));
    toast.success("Tags saved successfully! (Simulated)");
    console.log("Saved Tags:", experienceEntries);
    navigate("/job-description-input"); // Navigate to the next step
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">Review and Tag Your Work Experience</CardTitle>
        <CardDescription className="text-center mt-2">
          Review the automatically generated tags for functional roles and industry domains. You can add or remove them as needed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {experienceEntries.map(entry => (
          <div key={entry.id} className="border p-4 rounded-lg shadow-sm space-y-4">
            <h3 className="text-lg font-semibold">{entry.title} at {entry.company}</h3>
            <p className="text-sm text-muted-foreground">{entry.description}</p>

            <div>
              <Label className="text-sm font-medium mb-2 block">Functional Roles:</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {entry.functionalRoles.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <XCircle className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(entry.id, "functionalRoles", tag)} />
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
                />
                <Button variant="outline" size="icon" onClick={() => handleAddTag(entry.id, "functionalRoles")}>
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Industry Domains:</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {entry.industryDomains.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <XCircle className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(entry.id, "industryDomains", tag)} />
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
                />
                <Button variant="outline" size="icon" onClick={() => handleAddTag(entry.id, "industryDomains")}>
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        <Button className="w-full" onClick={handleSaveTags}>
          Save Tags and Continue
        </Button>
      </CardContent>
    </Card>
  );
};

export default TaggingSection;