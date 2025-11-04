"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, StopCircle, PlayCircle, FileText, ArrowRight, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";

interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  description: string;
  functionalRoles: string[];
  industryDomains: string[];
}

const prompts = [
  "Tell me about your most impactful project. What was your role, what challenges did you face, and what metrics demonstrate your success?",
  "Describe a time you led a team or initiative. What was the team size, what was the objective, and what was the outcome?",
  "Share an experience where you had to adapt to a significant change or overcome a major obstacle. How did you handle it?",
  "What specific skills did you utilize in your previous role that are relevant to a Product Manager position?",
];

const VoiceCaptureSection = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState<number>(0);
  const [transcribedText, setTranscribedText] = useState<string>("");
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isProOrProPlus = user?.subscriptionTier === 'pro' || user?.subscriptionTier === 'proplus';

  const handleStartRecording = () => {
    if (!isProOrProPlus) {
      toast.error("Upgrade to Pro or Pro+ to use Guided Voice Capture.");
      navigate("/pricing");
      return;
    }
    setIsRecording(true);
    setTranscribedText("");
    setShowSummary(false);
    toast.info("Recording started... (Simulated)");
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    toast.success("Recording stopped. Processing audio... (Simulated)");
    setTimeout(() => {
      const mockTranscription = `In my role as a Product Manager at InnovateX, I led a cross-functional team of 5 engineers and 2 designers to launch a new mobile payment solution. We faced challenges with integrating legacy banking systems, but by implementing a microservices architecture, we reduced transaction processing time by 30% and increased user adoption by 20% in the first quarter. This project directly contributed to a 15% revenue growth for the fintech division.`;
      setTranscribedText(mockTranscription);
      setShowSummary(true);
      toast.success("Transcription complete! Review and refine.");
    }, 2000);
  };

  const handleNextPrompt = () => {
    if (currentPromptIndex < prompts.length - 1) {
      setCurrentPromptIndex(prev => prev + 1);
      setTranscribedText("");
      setShowSummary(false);
      setIsRecording(false);
      toast.info("Next prompt loaded. Ready to record.");
    } else {
      toast.warning("You've gone through all the mock prompts!");
    }
  };

  const handleSaveAndContinue = () => {
    if (transcribedText.trim().length === 0) {
      toast.error("Please record and transcribe some experience first.");
      return;
    }

    const storedExperience = localStorage.getItem('processedExperience');
    let existingEntries: ExperienceEntry[] = [];
    if (storedExperience) {
      existingEntries = JSON.parse(storedExperience);
    }

    const newExperienceEntry: ExperienceEntry = {
      id: crypto.randomUUID(),
      title: "Narrated Experience",
      company: "Self-Reported",
      description: transcribedText.trim(),
      functionalRoles: ["General"],
      industryDomains: ["General"],
    };

    const updatedEntries = [...existingEntries, newExperienceEntry];
    localStorage.setItem('processedExperience', JSON.stringify(updatedEntries));

    toast.success("Narrated experience saved to master resume! You can now tag it.");
    console.log("Saved narrated experience:", newExperienceEntry);
    navigate("/tagging");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 flex items-center justify-center">
        <Card className="w-full max-w-4xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-4xl font-bold text-primary flex items-center justify-center gap-3">
              <Volume2 className="h-9 w-9" /> Guided Voice-to-Text Capture
            </CardTitle>
            <CardDescription className="text-md mt-2">
              Narrate your work history in response to prompts, and we'll transcribe and structure it for your master resume.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-6">
            {!isProOrProPlus && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md dark:bg-red-900/20 dark:text-red-300" role="alert">
                <p className="font-bold text-lg">Pro+ Feature Required</p>
                <p className="text-sm mt-2">Upgrade to Pro+ to unlock Guided Voice-to-Text Capture.</p>
                <Button variant="link" className="p-0 h-auto text-red-700 dark:text-red-300 underline mt-2" onClick={() => navigate("/pricing")}>
                  View Pricing Plans
                </Button>
              </div>
            )}
            <div className={isProOrProPlus ? "p-8 border-2 border-dashed border-primary/30 rounded-lg text-center space-y-5 bg-primary/5 hover:bg-primary/10 transition-colors duration-200" : "p-8 border-2 border-dashed border-muted-foreground/20 rounded-lg text-center space-y-5 opacity-50 pointer-events-none bg-muted/10"}>
              <Label className="text-lg font-semibold block text-foreground">Current Prompt:</Label>
              <p className="text-muted-foreground text-xl italic font-medium">"{prompts[currentPromptIndex]}"</p>
              <div className="flex justify-center gap-4 mt-5">
                {!isRecording ? (
                  <Button onClick={handleStartRecording} className="flex items-center gap-2 py-2 px-5 text-base font-semibold shadow-md hover:shadow-lg transition-shadow" disabled={!isProOrProPlus}>
                    <Mic className="h-5 w-5" /> Start Recording
                  </Button>
                ) : (
                  <Button onClick={handleStopRecording} variant="destructive" className="flex items-center gap-2 py-2 px-5 text-base font-semibold shadow-md hover:shadow-lg transition-shadow" disabled={!isProOrProPlus}>
                    <StopCircle className="h-5 w-5" /> Stop Recording
                  </Button>
                )}
                <Button variant="outline" onClick={handleNextPrompt} disabled={isRecording || !isProOrProPlus} className="py-2 px-5 text-base font-semibold shadow-sm hover:shadow-md transition-shadow">
                  Next Prompt
                </Button>
              </div>
            </div>

            {showSummary && (
              <div className="space-y-4 mt-8">
                <Label htmlFor="transcribed-text" className="text-base font-medium block text-foreground">Transcribed Text (Review & Edit)</Label>
                <Textarea
                  id="transcribed-text"
                  value={transcribedText}
                  onChange={(e) => setTranscribedText(e.target.value)}
                  rows={8}
                  className="resize-y text-base border-border focus-visible:ring-primary p-3 rounded-md"
                  placeholder="Your transcribed experience will appear here..."
                  disabled={!isProOrProPlus}
                />
                <Button className="w-full py-2 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow" onClick={handleSaveAndContinue} disabled={!isProOrProPlus}>
                  <FileText className="h-5 w-5 mr-2" /> Save Narrated Experience <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center mt-8">
              (This is a simulated feature. Actual voice-to-text capture and advanced structuring are part of future premium releases.)
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default VoiceCaptureSection;