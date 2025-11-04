"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PlusCircle, XCircle, Lightbulb, CheckCircle, Briefcase, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { mockJobDescriptionInfo } from "@/data/mockData";
import Navbar from "@/components/Navbar"; // Added import

const JobDescriptionInputSection = () => {
  const [jobDescription, setJobDescription] = useState<string>("");
  const [extractedRoles, setExtractedRoles] = useState<string[]>([]);
  const [extractedDomains, setExtractedDomains] = useState<string[]>([]);
  const [newRoleInput, setNewRoleInput] = useState<string>("");
  const [newDomainInput, setNewDomainInput] = useState<string>("");
  const [keywordSuggestions, setKeywordSuggestions] = useState<string[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isProOrProPlus = user?.subscriptionTier === 'pro' || user?.subscriptionTier === 'proplus';

  useEffect(() => {
    const storedJobDescriptionInfo = localStorage.getItem('jobDescriptionInfo');
    if (storedJobDescriptionInfo) {
      const parsedInfo = JSON.parse(storedJobDescriptionInfo);
      setExtractedRoles(parsedInfo.roles || []);
      setExtractedDomains(parsedInfo.domains || []);
      setSelectedKeywords(parsedInfo.keywords || []);
      toast.info("Loaded previous job description details.");
    }
  }, []);

  const handleExtractInfo = () => {
    if (jobDescription.trim().length === 0) {
      toast.error("Please enter a job description.");
      return;
    }
    const lowerCaseDesc = jobDescription.toLowerCase();
    const roles: string[] = [];
    const domains: string[] = [];
    const keywords: string[] = [];

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

    if (roles.length === 0) roles.push("General Management");
    if (domains.length === 0) domains.push("General Business");
    if (keywords.length === 0) keywords.push("communication", "problem-solving", "leadership", "innovation");

    setExtractedRoles([...new Set(roles)]);
    setExtractedDomains([...new Set(domains)]);
    setKeywordSuggestions([...new Set(keywords)]);
    setSelectedKeywords([]);
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
    localStorage.setItem('jobDescriptionInfo', JSON.stringify({
      roles: extractedRoles,
      domains: extractedDomains,
      keywords: selectedKeywords,
    }));

    toast.success("Job description info saved! Proceeding to generate application materials.");
    navigate("/application-material-generation");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 flex items-center justify-center">
        <Card className="w-full max-w-4xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-4xl font-bold text-primary flex items-center justify-center gap-3">
              <Briefcase className="h-9 w-9" /> Job Description Input
            </CardTitle>
            <CardDescription className="text-md mt-2">
              Paste the job description below. We'll extract key functional roles and industry domains to tailor your application materials.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-6">
            <div>
              <Label htmlFor="job-description" className="text-base font-medium mb-2 block text-foreground">Job Description</Label>
              <Textarea
                id="job-description"
                placeholder="Paste the full job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={10}
                className="resize-y text-base border-border focus-visible:ring-primary"
              />
              <Button className="w-full mt-4 py-2 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow" onClick={handleExtractInfo}>
                Extract Roles & Domains
              </Button>
            </div>

            {(extractedRoles.length > 0 || extractedDomains.length > 0 || keywordSuggestions.length > 0) && (
              <>
                <div>
                  <Label className="text-base font-medium mb-2 block text-foreground">Extracted Functional Roles:</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {extractedRoles.map(tag => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1 px-3 py-1 text-sm">
                        {tag}
                        <XCircle className="h-3 w-3 cursor-pointer ml-1 text-muted-foreground hover:text-foreground transition-colors" onClick={() => handleRemoveTag("roles", tag)} />
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
                      className="h-10 text-base border-border focus-visible:ring-primary"
                    />
                    <Button variant="outline" size="icon" onClick={() => handleAddTag("roles")} className="h-10 w-10">
                      <PlusCircle className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-2 block text-foreground">Extracted Industry Domains:</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {extractedDomains.map(tag => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1 px-3 py-1 text-sm">
                        {tag}
                        <XCircle className="h-3 w-3 cursor-pointer ml-1 text-muted-foreground hover:text-foreground transition-colors" onClick={() => handleRemoveTag("domains", tag)} />
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
                      className="h-10 text-base border-border focus-visible:ring-primary"
                    />
                    <Button variant="outline" size="icon" onClick={() => handleAddTag("domains")} className="h-10 w-10">
                      <PlusCircle className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {mockJobDescriptionInfo.keywords.length > 0 && (
                  <div className="space-y-4 p-5 rounded-lg bg-muted/20 border border-border shadow-sm">
                    <h3 className="text-xl font-semibold flex items-center gap-3 text-foreground">
                      <Lightbulb className="h-6 w-6 text-yellow-500" /> Keyword Alignment Suggestions <Badge variant="outline" className="ml-2 text-xs px-2 py-1">Pro Feature</Badge>
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
                      {mockJobDescriptionInfo.keywords.map(keyword => (
                        <Button
                          key={keyword}
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddKeyword(keyword)}
                          disabled={selectedKeywords.includes(keyword) || !isProOrProPlus}
                          className="text-sm px-3 py-1 h-auto"
                        >
                          {keyword} {selectedKeywords.includes(keyword) && <CheckCircle className="h-3 w-3 ml-1 text-green-500" />}
                        </Button>
                      ))}
                    </div>
                    {selectedKeywords.length > 0 && (
                      <div className="mt-4">
                        <Label className="text-sm font-medium mb-2 block text-foreground">Selected Keywords:</Label>
                        <div className="flex flex-wrap gap-2">
                          {selectedKeywords.map(keyword => (
                            <Badge key={`selected-${keyword}`} className="flex items-center gap-1 px-3 py-1 text-sm">
                              {keyword}
                              <XCircle className="h-3 w-3 cursor-pointer ml-1 text-muted-foreground hover:text-foreground transition-colors" onClick={() => handleRemoveSelectedKeyword(keyword)} />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <Button className="w-full py-2 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow" onClick={handleGenerateMaterials}>
                  Generate Application Materials <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </>
            )}
            {!(extractedRoles.length > 0 || extractedDomains.length > 0 || keywordSuggestions.length > 0) && (
              <p className="text-center text-muted-foreground text-lg p-8">Enter a job description and click "Extract Roles & Domains" to see suggestions.</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default JobDescriptionInputSection;