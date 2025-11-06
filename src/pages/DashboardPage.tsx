"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { FileText, GitMerge, Briefcase, DollarSign, Mic, LayoutDashboard } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DashboardPage = () => {
  const { user } = useAuth();

  const dashboardItems = [
    {
      title: "Master Resume",
      description: "Upload, view, and manage your core resume.",
      icon: FileText,
      link: "/master-resume",
      badge: null,
    },
    {
      title: "Tailor for a Job",
      description: "Input job descriptions to generate tailored materials.",
      icon: Briefcase,
      link: "/job-description-input",
      badge: null,
    },
    {
      title: "Manage Versions",
      description: "Review, edit, and sync all your application versions.",
      icon: GitMerge,
      link: "/version-management",
      badge: null,
    },
    {
      title: "Guided Voice Capture",
      description: "Narrate your experience for easy resume building.",
      icon: Mic,
      link: "/voice-capture",
      badge: "Pro+ Feature",
    },
    {
      title: "Coaching Services",
      description: "Get expert 1:1 resume reviews and interview prep.",
      icon: Briefcase,
      link: "/coaching",
      badge: null,
    },
    {
      title: "Pricing & Upgrade",
      description: "View plans and unlock premium features.",
      icon: DollarSign,
      link: "/pricing",
      badge: null,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto p-6 flex flex-col items-center justify-center">
        <Card className="w-full max-w-5xl shadow-xl border-2 border-primary/20">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-5xl font-extrabold text-primary flex items-center justify-center gap-4">
              <LayoutDashboard className="h-10 w-10" /> Welcome, {user?.username}!
            </CardTitle>
            <CardDescription className="text-xl mt-4 text-muted-foreground">
              Your personalized career hub.
            </CardDescription>
            {user && (
              <div className="mt-6 flex items-center justify-center gap-3">
                <span className="text-lg text-muted-foreground">Your current plan:</span>
                <Badge className="text-lg py-2 px-4 font-semibold bg-secondary text-secondary-foreground shadow-sm">
                  {(user.subscriptionTier || 'free').toUpperCase()}
                </Badge>
              </div>
            )}
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
            {dashboardItems.map((item, index) => (
              <Link to={item.link} key={index} className="block">
                <Card className="h-full flex flex-col items-center justify-center text-center p-8 bg-card hover:bg-accent/20 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 group">
                  <item.icon className="h-14 w-14 text-primary mb-5 group-hover:scale-110 transition-transform duration-300" />
                  <CardTitle className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="mt-2 text-muted-foreground">
                    {item.description}
                    {item.badge && (
                      <Badge variant="outline" className="ml-2 text-xs px-2 py-1 bg-primary/10 text-primary border-primary/30">
                        {item.badge}
                      </Badge>
                    )}
                  </CardDescription>
                  <Button variant="outline" className="mt-6 text-primary border-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                    Go to {item.title.split(' ')[0]}
                  </Button>
                </Card>
              </Link>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DashboardPage;