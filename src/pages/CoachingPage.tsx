"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import CoachingServicesSection from "@/components/CoachingServicesSection";

const CoachingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 flex items-center justify-center">
        <CoachingServicesSection />
      </main>
    </div>
  );
};

export default CoachingPage;