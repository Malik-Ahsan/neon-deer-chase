"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import ApplicationMaterialGenerator from "@/components/ApplicationMaterialGenerator";

const ApplicationMaterialGenerationPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 flex items-center justify-center">
        <ApplicationMaterialGenerator />
      </main>
    </div>
  );
};

export default ApplicationMaterialGenerationPage;