"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Star, Briefcase, GraduationCap, MessageSquareText } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const CoachingServicesSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isProOrProPlus = user?.subscriptionTier === 'pro' || user?.subscriptionTier === 'proplus';

  const coachingAddOns = [
    {
      name: "Resume Review Session",
      price: "$75-$100/session",
      description: "Get personalized feedback on your resume from a professional career coach.",
      features: [
        "30-minute 1:1 session",
        "Detailed resume critique",
        "Actionable improvement suggestions",
        "Tailoring advice for specific roles",
      ],
      icon: <MessageSquareText className="h-7 w-7 text-green-500" />,
    },
    {
      name: "Interview Preparation Session",
      price: "$125-$200/session",
      description: "Practice mock interviews with sector experts and receive targeted feedback.",
      features: [
        "60-minute 1:1 mock interview",
        "Role/industry-specific questions",
        "Behavioral and technical feedback",
        "Strategies for common interview challenges",
      ],
      icon: <Star className="h-7 w-7 text-yellow-500" />,
    },
  ];

  const executivePackage = {
    name: "Executive Career Package",
    price: "$399-$699 (one-time)",
    description: "Comprehensive support for senior-level professionals seeking strategic career moves.",
    features: [
      "Master resume via voice-to-text capture (guided)",
      "2 Resume coaching sessions",
      "1 Sector-specific interview prep session",
      "Portfolio pack (resume + cover letter + LinkedIn profile review)",
      "Priority support",
    ],
    icon: <Briefcase className="h-7 w-7 text-blue-500" />,
  };

  const handleBookCoaching = () => {
    if (!isProOrProPlus) {
      toast.error("Upgrade to Pro or Pro+ to access coaching services.");
      navigate("/pricing");
      return;
    }
    toast.info("Coaching booking not implemented in MVP.");
  };

  const handleInquireExecutivePackage = () => {
    if (!isProOrProPlus) {
      toast.error("Upgrade to Pro or Pro+ to inquire about the Executive Package.");
      navigate("/pricing");
      return;
    }
    toast.info("Executive package enrollment is a future release.");
  };

  return (
    <Card className="w-full max-w-5xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-4xl font-bold text-primary flex items-center justify-center gap-3">
          <GraduationCap className="h-9 w-9" /> Premium Coaching & Executive Services
        </CardTitle>
        <CardDescription className="text-md mt-2">
          Unlock personalized expert guidance to accelerate your job search and career growth.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-10 p-6">
        {!isProOrProPlus && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md dark:bg-red-900/20 dark:text-red-300" role="alert">
            <p className="font-bold text-lg">Pro Feature Required</p>
            <p className="text-sm mt-2">Upgrade to Pro or Pro+ to access premium coaching and executive services.</p>
            <Button variant="link" className="p-0 h-auto text-red-700 dark:text-red-300 underline mt-2" onClick={() => navigate("/pricing")}>
              View Pricing Plans
            </Button>
          </div>
        )}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-foreground">1:1 Coaching Add-Ons (Pay-per-Session)</h2>
          <p className="text-center text-muted-foreground text-md">
            Targeted support to refine your application materials and interview skills.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coachingAddOns.map((addon, index) => (
              <Card key={index} className={isProOrProPlus ? "flex flex-col justify-between p-6 shadow-md hover:shadow-lg transition-shadow duration-300 bg-card" : "flex flex-col justify-between p-6 shadow-md opacity-60 pointer-events-none bg-muted/30"}>
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    {addon.icon}
                    <CardTitle className="text-2xl font-bold text-foreground">{addon.name}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">{addon.description}</CardDescription>
                  <p className="text-4xl font-extrabold mt-4 text-primary">{addon.price}</p>
                </CardHeader>
                <CardContent className="flex-grow py-4">
                  <ul className="space-y-2">
                    {addon.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" /> {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-6">
                  <Button className="w-full py-2 text-lg font-semibold shadow-sm hover:shadow-md transition-shadow" onClick={handleBookCoaching} disabled={!isProOrProPlus}>
                    Learn More & Book
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-foreground">Executive Package</h2>
          <p className="text-center text-muted-foreground text-md">
            A premium, all-inclusive service for high-impact career transitions.
          </p>
          <Card className={isProOrProPlus ? "flex flex-col justify-between border-2 border-primary/50 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card p-6" : "flex flex-col justify-between border-2 border-primary/50 shadow-lg opacity-60 pointer-events-none bg-muted/30 p-6"}>
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3 mb-2">
                {executivePackage.icon}
                <CardTitle className="text-2xl font-bold text-foreground">{executivePackage.name}</CardTitle>
              </div>
              <CardDescription className="text-sm">{executivePackage.description}</CardDescription>
              <p className="text-4xl font-extrabold mt-4 text-primary">{executivePackage.price}</p>
            </CardHeader>
            <CardContent className="flex-grow py-4">
              <ul className="space-y-2">
                {executivePackage.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" /> {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-6">
              <Button className="w-full py-2 text-lg font-semibold shadow-sm hover:shadow-md transition-shadow" onClick={handleInquireExecutivePackage} disabled={!isProOrProPlus}>
                Inquire Now
              </Button>
            </CardFooter>
          </Card>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-8">
          (Scheduling and payment integrations for these services are part of future releases.)
        </p>
      </CardContent>
    </Card>
  );
};

export default CoachingServicesSection;