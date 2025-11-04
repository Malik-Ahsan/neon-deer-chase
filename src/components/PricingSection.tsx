"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext"; // Import useAuth
import { Badge } from "@/components/ui/badge"; // Import Badge

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
      ],
      buttonText: "Start for Free",
      variant: "default",
      tierId: "free",
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
      ],
      buttonText: "Go Pro",
      variant: "default",
      tierId: "pro",
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
      ],
      buttonText: "Upgrade to Pro+",
      variant: "secondary",
      tierId: "proplus",
    },
  ];

  const coachingAddOns = [
    {
      name: "Resume Review",
      price: "$75-$100/session",
      description: "1:1 professional review sessions.",
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

    // Simulate upgrade
    upgradeTier(tierId);
  };

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">Flexible Pricing for Every Candidate</CardTitle>
        <CardDescription className="text-center mt-2">
          Choose the plan that best fits your job search needs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingTiers.map((tier, index) => (
            <Card key={index} className={`flex flex-col justify-between ${currentTier === tier.tierId ? "border-2 border-primary shadow-lg" : ""}`}>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center justify-between">
                  {tier.name}
                  {currentTier === tier.tierId && <Badge className="ml-2">Current Plan</Badge>}
                </CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <p className="text-4xl font-bold mt-4">{tier.price}</p>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  {tier.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={tier.variant as "default" | "secondary"}
                  onClick={() => handleUpgradeClick(tier.tierId as 'free' | 'pro' | 'proplus')}
                  disabled={currentTier === tier.tierId || (tier.tierId === 'free' && currentTier !== 'free')}
                >
                  {tier.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Coaching Add-Ons (Pay-per-Session)</h2>
          <p className="text-center text-muted-foreground">
            Personalized expert guidance to boost your application.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coachingAddOns.map((addon, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">{addon.name}</CardTitle>
                  <CardDescription>{addon.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{addon.price}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => toast.info("Coaching booking not implemented in MVP.")}>
                    Learn More
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingSection;