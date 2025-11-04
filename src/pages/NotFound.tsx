"use client";

import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="text-center bg-card p-8 rounded-lg shadow-xl max-w-md w-full">
        <h1 className="text-6xl font-extrabold text-primary mb-4 animate-pulse">404</h1>
        <p className="text-2xl text-foreground mb-6 font-semibold">Oops! Page not found</p>
        <p className="text-muted-foreground mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-shadow">
          <a href="/" className="flex items-center justify-center gap-2">
            <Home className="h-5 w-5" /> Return to Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;