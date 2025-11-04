"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, DollarSign, Crown, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";

const PricingSection = () => {
  const { user, upgradeTier } = useAuth();
  const currentTier = user?.subscriptionTier;

  const pricingTiers = [
    {
      name: "Free Tier",
      price: "Free",
      description: "Get started with basic resume generation.",
      features: [
        "Create one master resume",
        "Generate up to 2 job-specific resumes/month",
        "Limited templates",
        "Basic version management",
      ],
      buttonText: "Current Plan",
      variant: "outline",
      tierId: "free",
      icon: null,
    },
    {
      name: "Pro",
      price: "$15/month",
      description: "Unlock unlimited tailored applications.",
      features: [
        "Unlimited resumes + cover letters",
        "Full template gallery",
        "Version naming + syncing",
        "Keyword alignment suggestions",
        "Access to coaching add-ons",
      ],
      buttonText: "Go Pro",
      variant: "default",
      tierId: "pro",
      icon: Crown,
    },
    {
      name: "Pro+",
      price: "$25-30/month",
      description: "Enhance your applications with AI guidance.",
      features: [
        "All Pro features",
        "Guided voice-to-text capture (Future)",
        "AI resume enhancement suggestions",
        "Basic interview prep prompts",
        "Access to executive package",
      ],
      buttonText: "Upgrade to Pro+",
      variant: "secondary",
      tierId: "proplus",
      icon: Sparkles,
    },
  ];

  const coachingAddOns = [
    {
      name: "Resume Review",
      price: "$75-$100/session",
      description: "1:1 professional review sessions to refine your resume.",
    },
    {
      name: "Interview Prep",
      price: "$125-$200/session",
      description: "1:1 mock interviews with role/industry professionals.",
    },
  ];

  const handleUpgradeClick = (tierId: 'free' | 'pro' | 'proplus') => {
    if (!user) {
      toast.error("Please log in to manage your subscription.");
      return;
    }

    if (tierId === 'free') {
      toast.info("You are already on the Free Tier or cannot downgrade via this button.");
      return;
    }

    if (currentTier === tierId) {
      toast.info(`You are already subscribed to the ${tierId} tier.`);
      return;
    }

    upgradeTier(tierId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 flex items-center justify-center">
        <Card className="w-full max-w-6xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-4xl font-bold text-primary flex items-center justify-center gap-3">
              <DollarSign className="h-9 w-9" /> Flexible Pricing for Every Candidate
            </CardTitle>
            <CardDescription className="text-md mt-2">
              Choose the plan that best fits your job search needs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-10 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricingTiers.map((tier, index) => (
                <Card key={index} className={`flex flex-col justify-between p-6 shadow-md hover:shadow-lg transition-shadow duration-300 ${currentTier === tier.tierId ? "border-2 border-primary ring-2 ring-primary bg-primary/5" : "border-border bg-card"}`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                        {tier.icon && <tier.icon className="h-6 w-6 text-primary" />} {tier.name}
                      </CardTitle>
                      {currentTier === tier.tierId && <Badge className="ml-2 bg-primary text-primary-foreground px-3 py-1 text-sm">Current Plan</Badge>}
                    </div>
                    <CardDescription className="text-sm">{tier.description}</CardDescription>
                    <p className="text-5xl font-extrabold mt-4 text-foreground">{tier.price}</p>
                  </CardHeader>
                  <CardContent className="flex-grow py-4">
                    <ul className="space-y-2">
                      {tier.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" /> {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pt-6">
                    <Button
                      className="w-full py-2 text-lg font-semibold shadow-sm hover:shadow-md transition-shadow"
                      variant={tier.variant as "default" | "secondary" | "outline"}
                      onClick={() => handleUpgradeClick(tier.tierId as 'free' | 'pro' | 'proplus')}
                      disabled={currentTier === tier.tierId || (tier.tierId === 'free' && currentTier !== 'free')}
                    >
                      {currentTier === tier.tierId ? "Current Plan" : tier.buttonText}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-center text-foreground">Coaching Add-Ons (Pay-per-Session)</h2>
              <p className="text-center text-muted-foreground text-md">
                Personalized expert guidance to boost your application.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coachingAddOns.map((addon, index) => (
                  <Card key={index} className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300 bg-card">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-bold text-foreground">{addon.name}</CardTitle>
                      <CardDescription className="text-sm">{addon.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="py-4">
                      <p className="text-3xl font-extrabold text-primary">{addon.price}</p>
                    </CardContent>
                    <CardFooter className="pt-6">
                      <Button variant="outline" className="w-full py-2 text-base shadow-sm hover:shadow-md transition-shadow" onClick={() => toast.info("Coaching booking not implemented in MVP.")}>
                        Learn More
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PricingSection;