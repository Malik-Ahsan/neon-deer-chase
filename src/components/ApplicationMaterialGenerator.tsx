"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Save, FileText } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import TemplateSelector from "@/components/application-generator/TemplateSelector";
import AiEnhancementSection from "@/components/application-generator/AiEnhancementSection";
import ResumePreview from "@/components/application-generator/ResumePreview";
import CoverLetterPreview from "@/components/application-generator/CoverLetterPreview";

import { generateResumeVersion } from "@/services/resumeService";
import {
  mockTemplates,
  mockAiSuggestions,
  ExperienceEntry,
  JobDescriptionInfo,
} from "@/data/mockData";

const ApplicationMaterialGenerator = () => {
  const [versionName, setVersionName] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("simple");
  const [resumeContent, setResumeContent] = useState<string>("");
  const [coverLetterContent, setCoverLetterContent] = useState<string>("");
  const [coverLetterLength, setCoverLetterLength] = useState<string>("medium");
  const [customJobQuestions, setCustomJobQuestions] = useState<string>("");
  const [aiSuggestions, setAiSuggestions] = useState<string[]>(mockAiSuggestions.map(s => s.description));
  const [appliedSuggestions, setAppliedSuggestions] = useState<string[]>([]);
  const [jobDescription, setJobDescription] = useState<string>("");

  const navigate = useNavigate();
  const { user, canGenerateResume, recordResumeGeneration } = useAuth();
  const isProOrProPlus = user?.subscriptionTier === 'pro' || user?.subscriptionTier === 'proplus';
  const isProPlus = user?.subscriptionTier === 'proplus';

  useEffect(() => {
    const storedJobDescription = localStorage.getItem("jobDescription");
    if (storedJobDescription) {
      setJobDescription(storedJobDescription);
    }
  }, []);

  const handleDownload = async () => {
    if (!versionName.trim()) {
      toast.error("Please name your application version before downloading.");
      return;
    }

    if (!canGenerateResume()) {
      navigate("/pricing");
      return;
    }

    toast.info("Generating PDF... This may take a moment.");

    const contentDiv = document.createElement("div");
    contentDiv.style.padding = "40px";
    contentDiv.style.fontFamily = "'Arial', sans-serif";
    contentDiv.style.fontSize = "11px";
    contentDiv.style.lineHeight = "1.4";
    contentDiv.style.color = "#333";
    contentDiv.style.backgroundColor = "#fff";

    const formatContentToHtml = (text: string) => {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^- (.*)/gm, '<li>$1</li>')
        .replace(/\n/g, '<br/>');
    };

    contentDiv.innerHTML = `
      <div style="margin-bottom: 30px; text-align: center; border-bottom: 1px solid #eee; padding-bottom: 15px;">
        <h1 style="font-size: 22px; margin: 0; color: #222;">ResumePivot Application Materials</h1>
        <p style="font-size: 12px; color: #666; margin-top: 5px;">Version: ${versionName} | Template: ${selectedTemplate}</p>
      </div>
      
      <div style="margin-bottom: 40px;">
        <h2 style="font-size: 18px; margin-bottom: 15px; color: #444; border-bottom: 1px solid #ddd; padding-bottom: 5px;">--- RESUME ---</h2>
        <div style="white-space: pre-wrap; word-wrap: break-word; background-color: #fdfdfd; padding: 15px; border-radius: 4px; border: 1px solid #eee; line-height: 1.6;">
          ${formatContentToHtml(resumeContent)}
        </div>
      </div>

      <div>
        <h2 style="font-size: 18px; margin-bottom: 15px; color: #444; border-bottom: 1px solid #ddd; padding-bottom: 5px;">--- COVER LETTER ---</h2>
        <div style="white-space: pre-wrap; word-wrap: break-word; background-color: #fdfdfd; padding: 15px; border-radius: 4px; border: 1px solid #eee; line-height: 1.6;">
          ${formatContentToHtml(coverLetterContent)}
        </div>
      </div>
    `;

    document.body.appendChild(contentDiv);

    try {
      const canvas = await html2canvas(contentDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: contentDiv.scrollWidth,
        windowHeight: contentDiv.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });

      const imgWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${versionName.replace(/\s+/g, '-')}-application.pdf`);
      toast.success(`"${versionName}" application materials downloaded as PDF!`);
      recordResumeGeneration();
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      document.body.removeChild(contentDiv);
    }
  };

  const handleSaveAndContinue = async () => {
    if (!versionName.trim()) {
      toast.error("Please name your application version before continuing.");
      return;
    }

    if (!canGenerateResume()) {
      navigate("/pricing");
      return;
    }

    try {
      const newVersion = await generateResumeVersion(jobDescription, versionName.trim());
      setResumeContent(newVersion.resume_content);
      setCoverLetterContent(newVersion.cover_letter_content);
      toast.success(`Application version "${versionName}" saved!`);
      recordResumeGeneration();
      navigate("/version-management");
    } catch (error) {
      toast.error("Failed to save application version.");
      console.error("Failed to save version:", error);
    }
  };

  return (
    <Card className="w-full max-w-5xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-4xl font-bold text-primary flex items-center justify-center gap-3">
          <FileText className="h-9 w-9" /> Application Material Generation
        </CardTitle>
        <CardDescription className="text-md mt-2">
          Your tailored resume and cover letter are ready! Name this version and download your documents.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        <div className="space-y-4">
          <Label htmlFor="version-name" className="text-base font-medium block text-foreground">Version Name</Label>
          <Input
            id="version-name"
            placeholder="e.g., Product Manager - Google"
            value={versionName}
            onChange={(e) => setVersionName(e.target.value)}
            className="h-10 text-base border-border focus-visible:ring-primary"
          />
        </div>

        <TemplateSelector
          templates={mockTemplates}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          isProOrProPlus={isProOrProPlus}
        />

        <AiEnhancementSection
          aiSuggestions={aiSuggestions}
          setAiSuggestions={setAiSuggestions}
          appliedSuggestions={appliedSuggestions}
          setAppliedSuggestions={setAppliedSuggestions}
          isProPlus={isProPlus}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResumePreview resumeContent={resumeContent} />
          <CoverLetterPreview
            coverLetterContent={coverLetterContent}
            coverLetterLength={coverLetterLength}
            setCoverLetterLength={setCoverLetterLength}
            customJobQuestions={customJobQuestions}
            setCustomJobQuestions={setCustomJobQuestions}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button className="flex-1 py-2 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow" onClick={handleDownload} disabled={!versionName.trim()}>
            <Download className="h-5 w-5 mr-2" /> Download as PDF
          </Button>
          <Button variant="secondary" className="flex-1 py-2 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow" onClick={handleSaveAndContinue} disabled={!versionName.trim()}>
            <Save className="h-5 w-5 mr-2" /> Save Version and Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationMaterialGenerator;