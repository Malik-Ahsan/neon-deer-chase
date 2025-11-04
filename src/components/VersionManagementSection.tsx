"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, GitMerge, PlusCircle, Search } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

// Import new modular components
import VersionCard from "@/components/version-management/VersionCard";
import ReviewMasterUpdateDialog from "@/components/version-management/ReviewMasterUpdateDialog";
import UpdateMasterPromptDialog from "@/components/version-management/UpdateMasterPromptDialog";
import ContentViewerDialog from "@/components/version-management/ContentViewerDialog";
import VersionEditorDialog from "@/components/version-management/VersionEditorDialog";

// Import mock data
import {
  mockApplicationVersions,
  simulatedMasterChanges,
  simulatedVersionChanges,
  ApplicationVersion,
  SimulatedChange,
} from "@/data/mockData";

const VersionManagementSection = () => {
  const [versions, setVersions] = useState<ApplicationVersion[]>([]);
  const [masterResumeLastUpdated, setMasterResumeLastUpdated] = useState<string>(new Date().toLocaleString());
  const [showReviewDialog, setShowReviewDialog] = useState<boolean>(false);
  const [currentVersionToUpdate, setCurrentVersionToUpdate] = useState<ApplicationVersion | null>(null);
  const [showEditPromptDialog, setShowEditPromptDialog] = useState<boolean>(false);
  const [currentVersionBeingEdited, setCurrentVersionBeingEdited] = useState<ApplicationVersion | null>(null);
  const [selectedMasterChanges, setSelectedMasterChanges] = useState<string[]>([]);
  const [showContentViewer, setShowContentViewer] = useState<boolean>(false);
  const [contentToView, setContentToView] = useState<{ resume: string; coverLetter: string; name: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // State for the version editor dialog
  const [showVersionEditor, setShowVersionEditor] = useState<boolean>(false);
  const [editingResumeContent, setEditingResumeContent] = useState<string>("");
  const [editingCoverLetterContent, setEditingCoverLetterContent] = useState<string>("");

  const navigate = useNavigate();
  const { canGenerateResume, recordResumeGeneration } = useAuth();

  useEffect(() => {
    const storedVersions = localStorage.getItem("resumePivotVersions");
    if (storedVersions) {
      setVersions(JSON.parse(storedVersions));
    } else {
      setVersions(mockApplicationVersions); // Use mock data if no stored versions
    }
    const storedMasterUpdate = localStorage.getItem("masterResumeLastUpdated");
    if (storedMasterUpdate) {
      setMasterResumeLastUpdated(storedMasterUpdate);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("resumePivotVersions", JSON.stringify(versions));
  }, [versions]);

  useEffect(() => {
    localStorage.setItem("masterResumeLastUpdated", masterResumeLastUpdated);
  }, [masterResumeLastUpdated]);

  const handleDeleteVersion = (id: string) => {
    setVersions(prevVersions => prevVersions.filter(version => version.id !== id));
    toast.success("Application version deleted successfully.");
  };

  const handleDownloadVersion = (versionName: string) => {
    if (!canGenerateResume()) {
      navigate("/pricing");
      return;
    }
    toast.success(`"${versionName}" downloaded as PDF! (Simulated)`);
    recordResumeGeneration();
  };

  const handleSimulateMasterUpdate = () => {
    const newTimestamp = new Date().toLocaleString();
    setMasterResumeLastUpdated(newTimestamp);
    toast.info("A new master resume update is available! Review your versions to apply changes.");
  };

  const handleOpenReviewDialog = (version: ApplicationVersion) => {
    setCurrentVersionToUpdate(version);
    setSelectedMasterChanges(simulatedMasterChanges.map(change => change.id));
    setShowReviewDialog(true);
  };

  const handleApplyMasterUpdate = () => {
    if (currentVersionToUpdate) {
      let updatedResumeContent = currentVersionToUpdate.simulatedResumeContent;
      let updatedCoverLetterContent = currentVersionToUpdate.simulatedCoverLetterContent;

      selectedMasterChanges.forEach(changeId => {
        switch (changeId) {
          case "exp_update":
            updatedResumeContent = updatedResumeContent.replace(
              "Led cross-functional teams to develop and launch new SaaS products in the fintech space.",
              "Spearheaded cross-functional teams to develop and launch new SaaS products, achieving 15% market share growth."
            );
            updatedCoverLetterContent = updatedCoverLetterContent.replace(
              "With a proven track record in Led cross-functional teams to develop and launch new SaaS products in the fintech space.",
              "With a proven track record in spearheading SaaS product launches and achieving significant market share growth."
            );
            break;
          case "skills_update":
            updatedResumeContent = updatedResumeContent.replace(
              "**Skills:** Product Management, Team Leadership, Fintech, SaaS, product strategy, roadmap development, user stories, agile methodologies.",
              "**Skills:** Product Management, Team Leadership, Fintech, SaaS, AI Prompt Engineering, product strategy, roadmap development, user stories, agile methodologies."
            );
            updatedCoverLetterContent += "\n\n*Master Update: Added 'AI Prompt Engineering' to skills.*";
            break;
          case "contact_update":
            updatedResumeContent = updatedResumeContent.replace(
              "[Your Contact Info]",
              "new.email@example.com | (555) 123-4567 | LinkedIn.com/in/yourname"
            );
            updatedCoverLetterContent = updatedCoverLetterContent.replace(
              "[Your Contact Info]",
              "new.email@example.com | (555) 123-4567 | LinkedIn.com/in/yourname"
            );
            break;
          case "edu_update":
            updatedResumeContent += "\n\n*Master Update: Updated MBA graduation date to 2025.*";
            updatedCoverLetterContent += "\n\n*Master Update: Education section updated.*";
            break;
          default:
            break;
        }
      });

      setVersions(prevVersions =>
        prevVersions.map(version =>
          version.id === currentVersionToUpdate.id
            ? {
                ...version,
                lastModified: new Date().toLocaleString(),
                masterLastSynced: masterResumeLastUpdated,
                contentHash: `updated-${Math.random().toFixed(4)}`,
                hasUnsyncedChanges: false,
                simulatedResumeContent: updatedResumeContent,
                simulatedCoverLetterContent: updatedCoverLetterContent,
              }
            : version
        )
      );
      toast.success(`Master update applied to version "${currentVersionToUpdate.name}".`);
      setShowReviewDialog(false);
      setCurrentVersionToUpdate(null);
      setSelectedMasterChanges([]);
    }
  };

  const handleEditVersion = (version: ApplicationVersion) => {
    setCurrentVersionBeingEdited(version);
    setEditingResumeContent(version.simulatedResumeContent);
    setEditingCoverLetterContent(version.simulatedCoverLetterContent);
    setShowVersionEditor(true);
  };

  const handleSaveVersionEdits = () => {
    if (currentVersionBeingEdited) {
      setVersions(prevVersions =>
        prevVersions.map(v =>
          v.id === currentVersionBeingEdited.id
            ? {
                ...v,
                simulatedResumeContent: editingResumeContent,
                simulatedCoverLetterContent: editingCoverLetterContent,
                hasUnsyncedChanges: true, // Mark as having local edits
                lastModified: new Date().toLocaleString(),
              }
            : v
        )
      );
      toast.success(`Changes saved for "${currentVersionBeingEdited.name}".`);
      setShowVersionEditor(false);
      // Now, prompt the user to update the master
      setShowEditPromptDialog(true);
    }
  };

  const handleUpdateMasterFromVersion = () => {
    if (currentVersionBeingEdited) {
      const newMasterTimestamp = new Date().toLocaleString();
      setMasterResumeLastUpdated(newMasterTimestamp);
      setVersions(prevVersions =>
        prevVersions.map(version =>
          version.id === currentVersionBeingEdited.id
            ? { ...version, masterLastSynced: newMasterTimestamp, hasUnsyncedChanges: false }
            : version
        )
      );
      toast.success(`Master resume updated with changes from "${currentVersionBeingEdited.name}".`);
      setShowEditPromptDialog(false);
      setCurrentVersionBeingEdited(null);
    }
  };

  const handleDismissEditPrompt = () => {
    toast.info("Changes were not applied to the master resume.");
    setShowEditPromptDialog(false);
    setCurrentVersionBeingEdited(null);
  };

  const isVersionOutOfSync = (version: ApplicationVersion) => {
    return !version.masterLastSynced || new Date(version.masterLastSynced) < new Date(masterResumeLastUpdated);
  };

  const handleViewContent = (version: ApplicationVersion) => {
    setContentToView({
      name: version.name,
      resume: version.simulatedResumeContent,
      coverLetter: version.simulatedCoverLetterContent,
    });
    setShowContentViewer(true);
  };

  const filteredVersions = versions.filter(version =>
    version.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">Version Management</CardTitle>
        <CardDescription className="text-center mt-2">
          Manage all your tailored resume and cover letter versions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Master Resume Last Updated: <span className="font-semibold">{masterResumeLastUpdated}</span>
          </div>
          <Button onClick={handleSimulateMasterUpdate} variant="outline">
            <GitMerge className="h-4 w-4 mr-2" /> Simulate Master Update
          </Button>
          <Link to="/application-material-generation">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" /> Create New Version
            </Button>
          </Link>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search versions by name..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {versions.some(v => isVersionOutOfSync(v) || v.hasUnsyncedChanges) && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md" role="alert">
            <p className="font-bold">Version Status Alert!</p>
            <p className="text-sm">Some versions have pending updates from the master resume or local unsynced changes.</p>
          </div>
        )}

        {filteredVersions.length === 0 ? (
          <div className="text-center text-muted-foreground p-8 border rounded-lg">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
            <p className="text-lg font-semibold">
              {searchQuery ? "No matching versions found." : "No application versions saved yet."}
            </p>
            {!searchQuery && (
              <>
                <p className="text-sm">Start by generating your first tailored resume and cover letter.</p>
                <Link to="/application-material-generation">
                  <Button className="mt-4">Generate First Version</Button>
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVersions.map(version => (
              <VersionCard
                key={version.id}
                version={version}
                isVersionOutOfSync={isVersionOutOfSync}
                onDelete={handleDeleteVersion}
                onDownload={handleDownloadVersion}
                onEdit={handleEditVersion}
                onReviewUpdate={handleOpenReviewDialog}
                onViewContent={handleViewContent}
              />
            ))}
          </div>
        )}
      </CardContent>

      <ReviewMasterUpdateDialog
        isOpen={showReviewDialog}
        onOpenChange={setShowReviewDialog}
        version={currentVersionToUpdate}
        masterResumeLastUpdated={masterResumeLastUpdated}
        simulatedMasterChanges={simulatedMasterChanges}
        selectedMasterChanges={selectedMasterChanges}
        setSelectedMasterChanges={setSelectedMasterChanges}
        onApplyUpdate={handleApplyMasterUpdate}
      />

      <UpdateMasterPromptDialog
        isOpen={showEditPromptDialog}
        onOpenChange={setShowEditPromptDialog}
        version={currentVersionBeingEdited}
        simulatedVersionChanges={simulatedVersionChanges}
        onUpdateMaster={handleUpdateMasterFromVersion}
        onDismiss={handleDismissEditPrompt}
      />

      <ContentViewerDialog
        isOpen={showContentViewer}
        onOpenChange={setShowContentViewer}
        content={contentToView}
      />

      <VersionEditorDialog
        isOpen={showVersionEditor}
        onOpenChange={setShowVersionEditor}
        version={currentVersionBeingEdited}
        editingResumeContent={editingResumeContent}
        setEditingResumeContent={setEditingResumeContent}
        editingCoverLetterContent={editingCoverLetterContent}
        setEditingCoverLetterContent={setEditingCoverLetterContent}
        onSaveEdits={handleSaveVersionEdits}
      />
    </Card>
  );
};

export default VersionManagementSection;