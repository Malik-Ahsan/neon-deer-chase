"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { UploadCloud, FileText, Mic, Loader2, CheckCircle, Eye, Save, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { mockExperienceEntries, ExperienceEntry } from "@/data/mockData";

const MasterResumePage = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [masterResumeSummary, setMasterResumeSummary] = useState<string | null>(null);
  const [processedExperience, setProcessedExperience] = useState<ExperienceEntry[]>([]);
  const [showMasterResumeDetails, setShowMasterResumeDetails] = useState<boolean>(false);
  const [manualResumeText, setManualResumeText] = useState<string>("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const isProOrProPlus = user?.subscriptionTier === 'pro' || user?.subscriptionTier === 'proplus';

  useEffect(() => {
    const storedExperience = localStorage.getItem('processedExperience');
    if (storedExperience) {
      const parsedExperience: ExperienceEntry[] = JSON.parse(storedExperience);
      if (parsedExperience.length > 0) {
        setProcessedExperience(parsedExperience);
        const summary = parsedExperience.map(entry => `- **${entry.title}** at ${entry.company}`).join('\n');
        setMasterResumeSummary(`**Existing Master Resume Loaded:**\n${summary}\n\n(Details available via "View Master Resume Details")`);
        setManualResumeText(parsedExperience.map(entry => `${entry.title} at ${entry.company}: ${entry.description}`).join('\n\n'));
        toast.info("Existing master resume loaded from your profile.");
      }
    } else {
      setProcessedExperience(mockExperienceEntries);
      const summary = mockExperienceEntries.map(entry => `- **${entry.title}** at ${entry.company}`).join('\n');
      setMasterResumeSummary(`**Mock Master Resume Loaded:**\n${summary}\n\n(Details available via "View Master Resume Details")`);
      setManualResumeText(mockExperienceEntries.map(entry => `${entry.title} at ${entry.company}: ${entry.description}`).join('\n\n'));
      toast.info("No existing master resume found. Loaded mock data for demonstration.");
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setMasterResumeSummary(null);
      setProcessedExperience([]);
      setManualResumeText("");
      toast.success(`File "${file.name}" selected.`);
    } else {
      setFileName(null);
      setMasterResumeSummary(null);
      setProcessedExperience([]);
      setManualResumeText("");
      toast.error("No file selected.");
    }
  };

  const simulateResumeParsing = (text: string): ExperienceEntry[] => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const newEntries: ExperienceEntry[] = [];
    let currentEntry: Partial<ExperienceEntry> = {};
    let currentDescriptionLines: string[] = [];

    const inferTags = (description: string) => {
      const lowerCaseDesc = description.toLowerCase();
      const functionalRoles: string[] = [];
      const industryDomains: string[] = [];

      if (lowerCaseDesc.includes("product manager") || lowerCaseDesc.includes("product management")) {
        functionalRoles.push("Product Management");
      }
      if (lowerCaseDesc.includes("program manager") || lowerCaseDesc.includes("program management")) {
        functionalRoles.push("Program Management");
      }
      if (lowerCaseDesc.includes("partnerships") || lowerCaseDesc.includes("business development")) {
        functionalRoles.push("Partnerships");
      }
      if (lowerCaseDesc.includes("project manager") || lowerCaseDesc.includes("project management")) {
        functionalRoles.push("Project Management");
      }
      if (lowerCaseDesc.includes("software engineer") || lowerCaseDesc.includes("developer") || lowerCaseDesc.includes("engineering")) {
        functionalRoles.push("Software Development");
      }
      if (lowerCaseDesc.includes("marketing") || lowerCaseDesc.includes("growth")) {
        functionalRoles.push("Marketing & Growth");
      }
      if (lowerCaseDesc.includes("sales") || lowerCaseDesc.includes("account management")) {
        functionalRoles.push("Sales & Account Management");
      }
      if (lowerCaseDesc.includes("operations") || lowerCaseDesc.includes("supply chain")) {
        functionalRoles.push("Operations");
      }
      if (lowerCaseDesc.includes("data analyst") || lowerCaseDesc.includes("data science") || lowerCaseDesc.includes("analytics")) {
        functionalRoles.push("Data & Analytics");
      }
      if (lowerCaseDesc.includes("ux designer") || lowerCaseDesc.includes("ui designer") || lowerCaseDesc.includes("design")) {
        functionalRoles.push("UX/UI Design");
      }

      if (lowerCaseDesc.includes("fintech") || lowerCaseDesc.includes("payments") || lowerCaseDesc.includes("financial services")) {
        industryDomains.push("Fintech");
      }
      if (lowerCaseDesc.includes("education") || lowerCaseDesc.includes("edtech")) {
        industryDomains.push("Education");
      }
      if (lowerCaseDesc.includes("saas") || lowerCaseDesc.includes("software as a service")) {
        industryDomains.push("SaaS");
      }
      if (lowerCaseDesc.includes("healthcare") || lowerCaseDesc.includes("medical") || lowerCaseDesc.includes("pharma")) {
        industryDomains.push("Healthcare");
      }
      if (lowerCaseDesc.includes("e-commerce") || lowerCaseDesc.includes("retail")) {
        industryDomains.push("E-commerce");
      }
      if (lowerCaseDesc.includes("manufacturing") || lowerCaseDesc.includes("industrial")) {
        industryDomains.push("Manufacturing");
      }
      if (lowerCaseDesc.includes("consulting") || lowerCaseDesc.includes("strategy")) {
        industryDomains.push("Consulting");
      }
      if (lowerCaseDesc.includes("media") || lowerCaseDesc.includes("entertainment")) {
        industryDomains.push("Media & Entertainment");
      }
      if (lowerCaseDesc.includes("telecom") || lowerCaseDesc.includes("communications")) {
        industryDomains.push("Telecommunications");
      }
      if (lowerCaseDesc.includes("automotive")) {
        industryDomains.push("Automotive");
      }

      if (functionalRoles.length === 0) functionalRoles.push("General Management");
      if (industryDomains.length === 0) industryDomains.push("General Business");

      return { functionalRoles: [...new Set(functionalRoles)], industryDomains: [...new Set(industryDomains)] };
    };

    lines.forEach(line => {
      const trimmedLine = line.trim();
      const isNewEntryStart = /^[A-Z][a-zA-Z\s]* (at|@) [A-Z][a-zA-Z\s]*/.test(trimmedLine) ||
                              /^[A-Z][a-zA-Z\s]*:/.test(trimmedLine);

      if (isNewEntryStart && currentEntry.title) {
        const description = currentDescriptionLines.join(' ').trim();
        const { functionalRoles, industryDomains } = inferTags(description);
        newEntries.push({
          id: crypto.randomUUID(),
          title: currentEntry.title,
          company: currentEntry.company || "Unknown Company",
          description: description,
          functionalRoles: functionalRoles,
          industryDomains: industryDomains,
        });
        currentEntry = {};
        currentDescriptionLines = [];
      }

      if (isNewEntryStart) {
        const parts = trimmedLine.split(/ (at|@) /);
        if (parts.length >= 3) {
          currentEntry.title = parts[0].trim();
          currentEntry.company = parts[2].split(':')[0].trim();
          currentDescriptionLines.push(parts[2].split(':').slice(1).join(':').trim());
        } else if (trimmedLine.includes(':')) {
          const [titlePart, descPart] = trimmedLine.split(':', 2);
          currentEntry.title = titlePart.trim();
          currentEntry.company = "Self-Reported";
          currentDescriptionLines.push(descPart.trim());
        } else {
          currentEntry.title = trimmedLine;
          currentEntry.company = "Self-Reported";
        }
      } else if (trimmedLine.length > 0) {
        currentDescriptionLines.push(trimmedLine);
      }
    });

    if (currentEntry.title) {
      const description = currentDescriptionLines.join(' ').trim();
      const { functionalRoles, industryDomains } = inferTags(description);
      newEntries.push({
        id: crypto.randomUUID(),
        title: currentEntry.title,
        company: currentEntry.company || "Unknown Company",
        description: description,
        functionalRoles: functionalRoles,
        industryDomains: industryDomains,
      });
    }
    return newEntries;
  };

  const handleProcessResume = () => {
    if (fileName) {
      setIsProcessing(true);
      toast.info("Processing resume from file... This may take a moment. (Simulated)");
      setTimeout(() => {
        const mockProcessedExperience: ExperienceEntry[] = mockExperienceEntries;
        setProcessedExperience(mockProcessedExperience);
        localStorage.setItem('processedExperience', JSON.stringify(mockProcessedExperience));

        const summary = mockProcessedExperience.map(entry => `- **${entry.title}** at ${entry.company}`).join('\n');
        setMasterResumeSummary(`**Master Resume Processed from File:**\n${summary}\n\n(Details available via "View Master Resume Details")`);
        setManualResumeText(mockProcessedExperience.map(entry => `${entry.title} at ${entry.company}: ${entry.description}`).join('\n\n'));

        setIsProcessing(false);
        toast.success("Resume processed and structured from file! Review the summary below.");
      }, 3000);
    } else {
      toast.error("Please upload a resume file or enter text manually.");
    }
  };

  const handleSaveManualResume = () => {
    if (manualResumeText.trim().length === 0) {
      toast.error("Please enter some text for your master resume.");
      return;
    }

    setIsProcessing(true);
    toast.info("Processing manual resume text... (Simulated)");
    setTimeout(() => {
      const newProcessedExperience = simulateResumeParsing(manualResumeText);
      setProcessedExperience(newProcessedExperience);
      localStorage.setItem('processedExperience', JSON.stringify(newProcessedExperience));

      const summary = newProcessedExperience.map(entry => `- **${entry.title}** at ${entry.company}`).join('\n');
      setMasterResumeSummary(`**Master Resume Processed from Manual Input:**\n${summary}\n\n(Details available via "View Master Resume Details")`);
      setFileName(null);

      setIsProcessing(false);
      toast.success("Master resume saved and structured from manual input! Review the summary below.");
    }, 2000);
  };

  const handleContinueToTagging = () => {
    if (processedExperience.length === 0) {
      toast.error("Please upload, process, or manually save a master resume first.");
      return;
    }
    navigate("/tagging");
  };

  const handleVoiceCaptureClick = () => {
    if (!isProOrProPlus) {
      toast.error("Upgrade to Pro or Pro+ to use Guided Voice Capture.");
      navigate("/pricing");
    } else {
      navigate("/voice-capture");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 flex items-center justify-center">
        <Card className="w-full max-w-3xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-4xl font-bold text-primary flex items-center justify-center gap-3">
              <FileText className="h-9 w-9" /> Master Resume Creation
            </CardTitle>
            <CardDescription className="text-md mt-2">
              Your central hub for all your career experiences. Start by creating your master resume.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {!masterResumeSummary && (
              <p className="text-center text-muted-foreground text-sm mb-4">
                Upload an existing resume, type your experience manually, or use our guided voice capture to begin.
              </p>
            )}
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-primary/30 rounded-lg text-center bg-primary/5 hover:bg-primary/10 transition-colors duration-200">
              <UploadCloud className="h-16 w-16 text-primary mb-4" />
              <p className="text-primary-foreground mb-4 text-lg font-medium">Drag and drop your resume here, or click to upload.</p>
              <Input
                id="master-resume-upload"
                type="file"
                accept=".doc,.docx,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="master-resume-upload" className="cursor-pointer">
                <Button asChild className="shadow-md hover:shadow-lg transition-shadow">
                  <span>Browse Files</span>
                </Button>
              </label>
            </div>
            {fileName && (
              <div className="flex items-center justify-between p-4 bg-muted rounded-md border border-border shadow-sm">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">{fileName}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => { setFileName(null); setMasterResumeSummary(null); setProcessedExperience([]); setManualResumeText(""); }}>
                  Remove
                </Button>
              </div>
            )}
            {!masterResumeSummary && fileName && (
              <Button className="w-full py-2 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow" disabled={isProcessing} onClick={handleProcessResume}>
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Processing...
                  </>
                ) : (
                  "Process Resume from File"
                )}
              </Button>
            )}

            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground font-semibold">Or</span>
            </div>

            <div className="space-y-4">
              <Label htmlFor="manual-resume-text" className="text-base font-medium block">Enter/Edit Master Resume Text</Label>
              <Textarea
                id="manual-resume-text"
                placeholder="Enter your work experience, education, and skills here. E.g., 'Product Manager at InnovateX: Led SaaS product launches...'"
                value={manualResumeText}
                onChange={(e) => {
                  setManualResumeText(e.target.value);
                  setFileName(null);
                  setMasterResumeSummary(null);
                  setProcessedExperience([]);
                }}
                rows={10}
                className="resize-y text-base border-border focus-visible:ring-primary"
              />
              <Button className="w-full py-2 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow" disabled={isProcessing || manualResumeText.trim().length === 0} onClick={handleSaveManualResume}>
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" /> Save Master Resume
                  </>
                )}
              </Button>
            </div>

            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground font-semibold">Or</span>
            </div>

            <Button className="w-full py-2 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow" variant="outline" onClick={handleVoiceCaptureClick} disabled={!isProOrProPlus}>
              <div className="flex items-center justify-center gap-2">
                <Mic className="h-5 w-5" /> Use Guided Voice Capture
                <Badge variant="secondary" className="ml-2 text-xs px-2 py-1">Pro+ Feature</Badge>
              </div>
            </Button>

            {masterResumeSummary && (
              <div className="space-y-4 mt-8">
                <div className="p-5 border border-green-500 rounded-lg bg-green-50/50 dark:bg-green-900/20 shadow-md">
                  <h3 className="text-xl font-semibold flex items-center gap-3 text-green-700 dark:text-green-300">
                    <CheckCircle className="h-6 w-6" /> Master Resume Ready!
                  </h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-3" dangerouslySetInnerHTML={{ __html: masterResumeSummary }}></p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <Button className="flex-1 py-2 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow" variant="outline" onClick={() => setShowMasterResumeDetails(true)}>
                    <Eye className="h-5 w-5 mr-2" /> View Master Resume Details
                  </Button>
                  <Button className="flex-1 py-2 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow" onClick={handleContinueToTagging}>
                    Continue to Tagging <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={showMasterResumeDetails} onOpenChange={setShowMasterResumeDetails}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-6">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-primary">Master Resume Structured Details</DialogTitle>
            <DialogDescription className="text-md mt-2">
              Review the parsed and structured work experience entries from your master resume.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto p-4 space-y-5 border rounded-md bg-muted/50 mt-4">
            {processedExperience.length > 0 ? (
              processedExperience.map((entry) => (
                <div key={entry.id} className="border p-4 rounded-lg bg-background shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-lg text-foreground">{entry.title} at {entry.company}</h4>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{entry.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="secondary" className="px-3 py-1 text-xs">Roles: {entry.functionalRoles.join(", ")}</Badge>
                    <Badge variant="secondary" className="px-3 py-1 text-xs">Domains: {entry.industryDomains.join(", ")}</Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground text-lg p-8">No structured experience data available.</p>
            )}
          </div>
          <DialogFooter className="mt-6">
            <Button onClick={() => setShowMasterResumeDetails(false)} className="py-2 px-5 text-base">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MasterResumePage;