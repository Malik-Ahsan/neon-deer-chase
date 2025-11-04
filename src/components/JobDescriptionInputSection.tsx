"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PlusCircle, XCircle, Lightbulb, CheckCircle } from "lucide-react"; // Import Lightbulb and CheckCircle icons
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext"; // Import useAuth
import { mockJobDescriptionInfo } from "@/data/mockData"; // Import mock data

const JobDescriptionInputSection = () => {
  const [jobDescription, setJobDescription] = useState<string>("");
  const [extractedRoles, setExtractedRoles] = useState<string[]>([]);
  const [extractedDomains, setExtractedDomains] = useState<string[]>([]);
  const [newRoleInput, setNewRoleInput] = useState<string>("");
  const [newDomainInput, setNewDomainInput] = useState<string>("");
  const [keywordSuggestions, setKeywordSuggestions] = useState<string[]>([]); // New state for keyword suggestions
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]); // New state for selected keywords
  const navigate = useNavigate();
  const { user } = useAuth();
  const isProOrProPlus = user?.subscriptionTier === 'pro' || user?.subscriptionTier === 'proplus';

  useEffect(() => {
    // Load existing job description info from localStorage if available
    const storedJobDescriptionInfo = localStorage.getItem('jobDescriptionInfo');
    if (storedJobDescriptionInfo) {
      const parsedInfo = JSON.parse(storedJobDescriptionInfo);
      setExtractedRoles(parsedInfo.roles || []);
      setExtractedDomains(parsedInfo.domains || []);
      setSelectedKeywords(parsedInfo.keywords || []);
      // Note: We don't store the raw job description or keyword suggestions,
      // so those won't be pre-populated from a previous session.
      toast.info("Loaded previous job description details.");
    }
  }, []);

  const handleExtractInfo = () => {
    if (jobDescription.trim().length === 0) {
      toast.error("Please enter a job description.");
      return;
    }
    // Simulate extraction based on job description content
    // In a real app, this would involve an AI/NLP service
    const lowerCaseDesc = jobDescription.toLowerCase();
    const roles: string[] = [];
    const domains: string[] = [];
    const keywords: string[] = []; // New array for keywords

    if (lowerCaseDesc.includes("product manager") || lowerCaseDesc.includes("product management")) {
      roles.push("Product Management");
      keywords.push("product strategy", "roadmap development", "user stories", "agile methodologies");
    }
    if (lowerCaseDesc.includes("program manager") || lowerCaseDesc.includes("program management")) {
      roles.push("Program Management");
      keywords.push("project planning", "stakeholder management", "risk mitigation", "cross-functional collaboration");
    }
    if (lowerCaseDesc.includes("partnerships") || lowerCaseDesc.includes("business development")) {
      roles.push("Partnerships");
      keywords.push("strategic alliances", "negotiation", "client relations", "market expansion");
    }
    if (lowerCaseDesc.includes("fintech") || lowerCaseDesc.includes("payments")) {
      domains.push("Fintech");
      keywords.push("financial technology", "payment processing", "regulatory compliance", "blockchain");
    }
    if (lowerCaseDesc.includes("education") || lowerCaseDesc.includes("edtech")) {
      domains.push("Education");
      keywords.push("e-learning", "curriculum development", "student success", "educational platforms");
    }
    if (lowerCaseDesc.includes("saas")) {
      domains.push("SaaS");
      keywords.push("software as a service", "subscription models", "cloud solutions", "customer lifecycle");
    }

    // Add some default mock tags if none are "extracted"
    if (roles.length === 0) roles.push("General Management");
    if (domains.length === 0) domains.push("General Business");
    if (keywords.length === 0) keywords.push("communication", "problem-solving", "leadership", "innovation");


    setExtractedRoles([...new Set(roles)]); // Remove duplicates
    setExtractedDomains([...new Set(domains)]); // Remove duplicates
    setKeywordSuggestions([...new Set(keywords)]); // Set keyword suggestions
    setSelectedKeywords([]); // Clear previously selected keywords
    toast.success("Job description processed! Review extracted roles, domains, and keywords.");
  };

  const handleAddTag = (type: "roles" | "domains") => {
    const input = type === "roles" ? newRoleInput : newDomainInput;
    const tag = input.trim();
    if (tag && tag.length > 0) {
      if (type === "roles") {
        if (!extractedRoles.includes(tag)) {
          setExtractedRoles(prev => [...prev, tag]);
          setNewRoleInput("");
          toast.success(`Role "${tag}" added.`);
        } else {
          toast.warning(`Role "${tag}" already exists.`);
        }
      } else {
        if (!extractedDomains.includes(tag)) {
          setExtractedDomains(prev => [...prev, tag]);
          setNewDomainInput("");
          toast.success(`Domain "${tag}" added.`);
        } else {
          toast.warning(`Domain "${tag}" already exists.`);
        }
      }
    }
  };

  const handleRemoveTag = (type: "roles" | "domains", tagToRemove: string) => {
    if (type === "roles") {
      setExtractedRoles(prev => prev.filter(tag => tag !== tagToRemove));
      toast.info(`Role "${tagToRemove}" removed.`);
    } else {
      setExtractedDomains(prev => prev.filter(tag => tag !== tagToRemove));
      toast.info(`Domain "${tagToRemove}" removed.`);
    }
  };

  const handleAddKeyword = (keyword: string) => {
    if (!isProOrProPlus) {
      toast.error("Upgrade to Pro or Pro+ to use Keyword Alignment Suggestions.");
      navigate("/pricing");
      return;
    }
    if (!selectedKeywords.includes(keyword)) {
      setSelectedKeywords(prev => [...prev, keyword]);
      toast.info(`Keyword "${keyword}" added to your selection.`);
    } else {
      toast.warning(`Keyword "${keyword}" is already selected.`);
    }
  };

  const handleRemoveSelectedKeyword = (keywordToRemove: string) => {
    setSelectedKeywords(prev => prev.filter(keyword => keyword !== keywordToRemove));
    toast.info(`Selected keyword "${keywordToRemove}" removed.`);
  };

  const handleGenerateMaterials = () => {
    if (extractedRoles.length === 0 && extractedDomains.length === 0) {
      toast.error("Please extract or add at least one functional role or industry domain.");
      return;
    }
    // Save the extracted info and selected keywords to localStorage
    localStorage.setItem('jobDescriptionInfo', JSON.stringify({
      roles: extractedRoles,
      domains: extractedDomains,
      keywords: selectedKeywords,
    }));

    toast.success("Job description info saved! Proceeding to generate application materials.");
    navigate("/application-material-generation"); // Navigate to the next step
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">Job Description Input</CardTitle>
        <CardDescription className="text-center mt-2">
          Paste the job description below. We'll extract key functional roles and industry domains to tailor your application materials.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <Label htmlFor="job-description" className="text-sm font-medium mb-2 block">Job Description</Label>
          <Textarea
            id="job-description"
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={10}
            className="resize-y"
          />
          <Button className="w-full mt-4" onClick={handleExtractInfo}>
            Extract Roles & Domains
          </Button>
        </div>

        {extractedRoles.length > 0 || extractedDomains.length > 0 || keywordSuggestions.length > 0 ? (
          <>
            <div>
              <Label className="text-sm font-medium mb-2 block">Extracted Functional Roles:</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {extractedRoles.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <XCircle className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag("roles", tag)} />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add functional role"
                  value={newRoleInput}
                  onChange={(e) => setNewRoleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTag("roles");
                    }
                  }}
                />
                <Button variant="outline" size="icon" onClick={() => handleAddTag("roles")}>
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Extracted Industry Domains:</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {extractedDomains.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <XCircle className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag("domains", tag)} />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add industry domain"
                  value={newDomainInput}
                  onChange={(e) => setNewDomainInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTag("domains");
                    }
                  }}
                />
                <Button variant="outline" size="icon" onClick={() => handleAddTag("domains")}>
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {mockJobDescriptionInfo.keywords.length > 0 && ( // Use mockJobDescriptionInfo.keywords for initial suggestions
              <div className="space-y-4 border p-4 rounded-lg bg-muted/20">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" /> Keyword Alignment Suggestions <Badge variant="outline" className="ml-2">Pro Feature</Badge>
                </h3>
                {!isProOrProPlus && (
                  <p className="text-sm text-red-500">
                    Upgrade to Pro or Pro+ to use Keyword Alignment Suggestions.
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  These keywords are frequently found in similar job descriptions. Consider incorporating them into your resume.
                </p>
                <div className="flex flex-wrap gap-2">
                  {mockJobDescriptionInfo.keywords.map(keyword => ( // Use mockJobDescriptionInfo.keywords here
                    <Button
                      key={keyword}
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddKeyword(keyword)}
                      disabled={selectedKeywords.includes(keyword) || !isProOrProPlus}
                    >
                      {keyword} {selectedKeywords.includes(keyword) && <CheckCircle className="h-3 w-3 ml-1 text-green-500" />}
                    </Button>
                  ))}
                </div>
                {selectedKeywords.length > 0 && (
                  <div className="mt-4">
                    <Label className="text-sm font-medium mb-2 block">Selected Keywords:</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedKeywords.map(keyword => (
                        <Badge key={`selected-${keyword}`} className="flex items-center gap-1">
                          {keyword}
                          <XCircle className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveSelectedKeyword(keyword)} />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button className="w-full" onClick={handleGenerateMaterials}>
              Generate Application Materials
            </Button>
          </>
        ) : (
          <p className="text-center text-muted-foreground">Enter a job description and click "Extract Roles & Domains" to see suggestions.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default JobDescriptionInputSection;