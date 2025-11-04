"use client";

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, LogOut, UserCircle2, DollarSign, BriefcaseBusiness, GitMerge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const { isAuthenticated, user, logout, upgradeTier } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleUpgrade = () => {
    upgradeTier('pro');
    navigate("/pricing");
  };

  return (
    <nav className="bg-primary text-primary-foreground p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <Link to={isAuthenticated ? "/" : "/master-resume"} className="flex items-center space-x-2 group">
          <FileText className="h-7 w-7 group-hover:scale-110 transition-transform duration-200" />
          <span className="text-2xl font-bold tracking-tight group-hover:text-accent transition-colors duration-200">ResumePivot</span>
        </Link>
        <div className="flex space-x-2 items-center">
          {isAuthenticated && (
            <>
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/master-resume" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" /> Master Resume
                </Link>
              </Button>
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/version-management" className="flex items-center gap-1">
                  <GitMerge className="h-4 w-4" /> Versions
                </Link>
              </Button>
            </>
          )}
          <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10" asChild>
            <Link to="/pricing" className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" /> Pricing
            </Link>
          </Button>
          <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10" asChild>
            <Link to="/coaching" className="flex items-center gap-1">
              <BriefcaseBusiness className="h-4 w-4" /> Coaching
            </Link>
          </Button>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary-foreground text-primary">
                      {user?.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      Plan: <Badge variant="secondary" className="ml-1">{user?.subscriptionTier.toUpperCase()}</Badge>
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/")}>
                  <UserCircle2 className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                {user?.subscriptionTier === 'free' && (
                  <DropdownMenuItem onClick={handleUpgrade} className="text-primary font-medium">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Upgrade to Pro
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="secondary" className="shadow-sm hover:shadow-md transition-shadow" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;