"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, StopCircle, PlayCircle, FileText } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext"; // Import useAuth

// Define the structure for experience entries to be stored
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
    // In a real app, this would start actual audio recording
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    toast.success("Recording stopped. Processing audio... (Simulated)");
    // Simulate transcription after a short delay
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
      setIsRecording(false); // Stop recording if moving to next prompt
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

    // Retrieve existing processed experience from localStorage
    const storedExperience = localStorage.getItem('processedExperience');
    let existingEntries: ExperienceEntry[] = [];
    if (storedExperience) {
      existingEntries = JSON.parse(storedExperience);
    }

    // Simulate structuring the transcribed text into an ExperienceEntry
    const newExperienceEntry: ExperienceEntry = {
      id: crypto.randomUUID(), // Generate a unique ID
      title: "Narrated Experience", // Default title, could be parsed more intelligently
      company: "Self-Reported", // Default company
      description: transcribedText.trim(),
      functionalRoles: ["General"], // Default tags, user can refine on tagging page
      industryDomains: ["General"], // Default tags, user can refine on tagging page
    };

    const updatedEntries = [...existingEntries, newExperienceEntry];
    localStorage.setItem('processedExperience', JSON.stringify(updatedEntries));

    toast.success("Narrated experience saved to master resume! You can now tag it.");
    console.log("Saved narrated experience:", newExperienceEntry);
    navigate("/tagging"); // Navigate to tagging page after saving
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">Guided Voice-to-Text Capture</CardTitle>
        <CardDescription className="text-center mt-2">
          Narrate your work history in response to prompts, and we'll transcribe and structure it for your master resume.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isProOrProPlus && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
            <p className="font-bold">Pro Feature Required</p>
            <p className="text-sm">Upgrade to Pro or Pro+ to unlock Guided Voice-to-Text Capture.</p>
            <Button variant="link" className="p-0 h-auto text-red-700 underline" onClick={() => navigate("/pricing")}>
              View Pricing Plans
            </Button>
          </div>
        )}
        <div className={isProOrProPlus ? "p-6 border-2 border-dashed border-muted-foreground/20 rounded-lg text-center space-y-4" : "p-6 border-2 border-dashed border-muted-foreground/20 rounded-lg text-center space-y-4 opacity-50 pointer-events-none"}>
          <Label className="text-lg font-semibold block">Current Prompt:</Label>
          <p className="text-muted-foreground text-md italic">"{prompts[currentPromptIndex]}"</p>
          <div className="flex justify-center gap-4 mt-4">
            {!isRecording ? (
              <Button onClick={handleStartRecording} className="flex items-center gap-2" disabled={!isProOrProPlus}>
                <Mic className="h-5 w-5" /> Start Recording
              </Button>
            ) : (
              <Button onClick={handleStopRecording} variant="destructive" className="flex items-center gap-2" disabled={!isProOrProPlus}>
                <StopCircle className="h-5 w-5" /> Stop Recording
              </Button>
            )}
            <Button variant="outline" onClick={handleNextPrompt} disabled={isRecording || !isProOrProPlus}>
              Next Prompt
            </Button>
          </div>
        </div>

        {showSummary && (
          <div className="space-y-4">
            <Label htmlFor="transcribed-text" className="text-sm font-medium block">Transcribed Text (Review & Edit)</Label>
            <Textarea
              id="transcribed-text"
              value={transcribedText}
              onChange={(e) => setTranscribedText(e.target.value)}
              rows={8}
              className="resize-y"
              placeholder="Your transcribed experience will appear here..."
              disabled={!isProOrProPlus}
            />
            <Button className="w-full" onClick={handleSaveAndContinue} disabled={!isProOrProPlus}>
              <FileText className="h-4 w-4 mr-2" /> Save Narrated Experience
            </Button>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          (This is a simulated feature. Actual voice-to-text capture and advanced structuring are part of future premium releases.)
        </p>
      </CardContent>
    </Card>
  );
};

export default VoiceCaptureSection;