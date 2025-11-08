"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, GitMerge, PlusCircle, Search, History } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar"; // Added import

import VersionCard from "@/components/version-management/VersionCard";
import ReviewMasterUpdateDialog from "@/components/version-management/ReviewMasterUpdateDialog";
import UpdateMasterPromptDialog from "@/components/version-management/UpdateMasterPromptDialog";
import ContentViewerDialog from "@/components/version-management/ContentViewerDialog";
import VersionEditorDialog from "@/components/version-management/VersionEditorDialog";

import { getResumeVersions, updateResumeVersion, syncResumeVersion } from "@/services/resumeService";
import {
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

  const [showVersionEditor, setShowVersionEditor] = useState<boolean>(false);
  const [editingResumeContent, setEditingResumeContent] = useState<string>("");

  const navigate = useNavigate();
  const { canGenerateResume, recordResumeGeneration } = useAuth();

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const fetchedVersions = await getResumeVersions();
        setVersions(fetchedVersions);
      } catch (error) {
        toast.error("Failed to fetch resume versions.");
        console.error(error);
      }
    };

    fetchVersions();
  }, []);

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

  const handleApplyMasterUpdate = async () => {
    if (currentVersionToUpdate) {
      try {
        await syncResumeVersion(currentVersionToUpdate.id);
        const fetchedVersions = await getResumeVersions();
        setVersions(fetchedVersions);
        toast.success(`Master update applied to version "${currentVersionToUpdate.name}".`);
        setShowReviewDialog(false);
        setCurrentVersionToUpdate(null);
        setSelectedMasterChanges([]);
      } catch (error) {
        toast.error("Failed to apply master update.");
        console.error(error);
      }
    }
  };

  const handleEditVersion = (version: ApplicationVersion) => {
    setCurrentVersionBeingEdited(version);
    setEditingResumeContent(version.content.raw);
    setShowVersionEditor(true);
  };

  const handleSaveVersionEdits = async () => {
    if (currentVersionBeingEdited) {
      try {
        await updateResumeVersion(currentVersionBeingEdited.id, editingResumeContent);
        setVersions(prevVersions =>
          prevVersions.map(v =>
            v.id === currentVersionBeingEdited.id
              ? {
                  ...v,
                  content: { raw: editingResumeContent },
                  hasUnsyncedChanges: true,
                  lastModified: new Date().toLocaleString(),
                }
              : v
          )
        );
        toast.success(`Changes saved for "${currentVersionBeingEdited.name}".`);
        setShowVersionEditor(false);
        setShowEditPromptDialog(true);
      } catch (error) {
        toast.error("Failed to save changes.");
        console.error(error);
      }
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
      resume: version.content.raw,
      coverLetter: "Cover letter viewing is not implemented for backend versions yet.",
    });
    setShowContentViewer(true);
  };

  const filteredVersions = versions.filter(version =>
    version.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 flex items-center justify-center">
        <Card className="w-full max-w-5xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-4xl font-bold text-primary flex items-center justify-center gap-3">
              <GitMerge className="h-9 w-9" /> Version Management
            </CardTitle>
            <CardDescription className="text-md mt-2">
              Manage all your tailored resume and cover letter versions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row justify-between items-center flex-wrap gap-4">
              <div className="flex items-center gap-2 text-base text-muted-foreground">
                <History className="h-5 w-5 text-primary" /> Master Resume Last Updated: <span className="font-semibold text-foreground">{masterResumeLastUpdated}</span>
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                <Button onClick={handleSimulateMasterUpdate} variant="outline" className="py-2 px-4 text-base shadow-sm hover:shadow-md transition-shadow">
                  <GitMerge className="h-5 w-5 mr-2" /> Simulate Master Update
                </Button>
                <Link to="/application-material-generation">
                  <Button className="py-2 px-4 text-base shadow-md hover:shadow-lg transition-shadow">
                    <PlusCircle className="h-5 w-5 mr-2" /> Create New Version
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative mt-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search versions by name..."
                className="pl-10 h-11 text-base border-border focus-visible:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {versions.some(v => isVersionOutOfSync(v) || v.hasUnsyncedChanges) && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md dark:bg-yellow-900/20 dark:text-yellow-300" role="alert">
                <p className="font-bold text-lg flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6" /> Version Status Alert!
                </p>
                <p className="text-sm mt-2">Some versions have pending updates from the master resume or local unsynced changes.</p>
              </div>
            )}

            {filteredVersions.length === 0 ? (
              <div className="text-center text-muted-foreground p-10 border rounded-lg bg-muted/50 shadow-sm">
                <AlertTriangle className="h-16 w-16 mx-auto mb-6 text-yellow-500" />
                <p className="text-xl font-semibold mb-3">
                  {searchQuery ? "No matching versions found." : "No application versions saved yet."}
                </p>
                {!searchQuery && (
                  <>
                    <p className="text-md mb-6">Start by generating your first tailored resume and cover letter.</p>
                    <Link to="/application-material-generation">
                      <Button className="py-2 px-5 text-base shadow-md hover:shadow-lg transition-shadow">Generate First Version</Button>
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
            onSaveEdits={handleSaveVersionEdits}
          />
        </Card>
      </main>
    </div>
  );
};

export default VersionManagementSection;