"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface User {
  username: string;
  subscriptionTier: 'free' | 'pro' | 'proplus';
  resumesGeneratedThisMonth: number;
  lastResumeGenerationDate: string | null; // ISO string date
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean; // Added isLoading state
  login: (username: string) => void;
  register: (username: string) => boolean;
  logout: () => void;
  upgradeTier: (newTier: 'pro' | 'proplus') => void;
  canGenerateResume: () => boolean;
  recordResumeGeneration: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const FREE_TIER_RESUME_LIMIT = 2;

export const AuthProvider = ({ children }: { ReactNode: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Initialize isLoading to true

  useEffect(() => {
    const storedUser = localStorage.getItem('resumePivotUser');
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      // Check if a new month has started and reset count if necessary
      if (parsedUser.lastResumeGenerationDate) {
        const lastGenDate = new Date(parsedUser.lastResumeGenerationDate);
        const now = new Date();
        if (now.getMonth() !== lastGenDate.getMonth() || now.getFullYear() !== lastGenDate.getFullYear()) {
          parsedUser.resumesGeneratedThisMonth = 0;
          parsedUser.lastResumeGenerationDate = null; // Reset date as well
          localStorage.setItem('resumePivotUser', JSON.stringify(parsedUser));
          const storedUsers = JSON.parse(localStorage.getItem('resumePivotUsers') || '{}');
          storedUsers[parsedUser.username] = parsedUser;
          localStorage.setItem('resumePivotUsers', JSON.stringify(storedUsers));
        }
      }
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
    setIsLoading(false); // Set loading to false after checking localStorage
  }, []);

  const login = (username: string) => {
    const storedUsers = JSON.parse(localStorage.getItem('resumePivotUsers') || '{}');
    if (storedUsers[username]) {
      const loggedInUser: User = storedUsers[username];
      // Check if a new month has started and reset count if necessary
      if (loggedInUser.lastResumeGenerationDate) {
        const lastGenDate = new Date(loggedInUser.lastResumeGenerationDate);
        const now = new Date();
        if (now.getMonth() !== lastGenDate.getMonth() || now.getFullYear() !== lastGenDate.getFullYear()) {
          loggedInUser.resumesGeneratedThisMonth = 0;
          loggedInUser.lastResumeGenerationDate = null;
        }
      }
      localStorage.setItem('resumePivotUser', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      setIsAuthenticated(true);
      toast.success(`Welcome back, ${username}! You are on the ${loggedInUser.subscriptionTier} tier.`);
    } else {
      toast.error('Invalid username. Please register or try again.');
    }
  };

  const register = (username: string): boolean => {
    const storedUsers = JSON.parse(localStorage.getItem('resumePivotUsers') || '{}');
    if (storedUsers[username]) {
      toast.error('Username already exists. Please choose a different one or log in.');
      return false;
    } else {
      const newUser: User = {
        username,
        subscriptionTier: 'free',
        resumesGeneratedThisMonth: 0,
        lastResumeGenerationDate: null,
      }; // Default to free tier
      storedUsers[username] = newUser;
      localStorage.setItem('resumePivotUsers', JSON.stringify(storedUsers));
      localStorage.setItem('resumePivotUser', JSON.stringify(newUser));
      setUser(newUser);
      setIsAuthenticated(true);
      toast.success(`Account created for ${username}! You are now logged in on the free tier.`);
      return true;
    }
  };

  const logout = () => {
    localStorage.removeItem('resumePivotUser');
    localStorage.removeItem('processedExperience'); // Clear processed experience
    localStorage.removeItem('jobDescriptionInfo'); // Clear job description info
    setUser(null);
    setIsAuthenticated(false);
    toast.info('You have been logged out.');
  };

  const upgradeTier = (newTier: 'pro' | 'proplus') => {
    if (user) {
      const updatedUser = { ...user, subscriptionTier: newTier };
      localStorage.setItem('resumePivotUser', JSON.stringify(updatedUser));
      const storedUsers = JSON.parse(localStorage.getItem('resumePivotUsers') || '{}');
      storedUsers[user.username] = updatedUser;
      localStorage.setItem('resumePivotUsers', JSON.stringify(storedUsers));
      setUser(updatedUser);
      toast.success(`Your subscription has been upgraded to ${newTier} tier!`);
    } else {
      toast.error("Please log in to upgrade your tier.");
    }
  };

  const canGenerateResume = (): boolean => {
    if (!user) return false; // Not logged in
    if (user.subscriptionTier === 'pro' || user.subscriptionTier === 'proplus') {
      return true; // Pro and Pro+ users have unlimited generation
    }

    // For free tier users, check the limit
    if (user.resumesGeneratedThisMonth < FREE_TIER_RESUME_LIMIT) {
      return true;
    } else {
      toast.error(`Free tier limit reached (${FREE_TIER_RESUME_LIMIT} resumes/month). Upgrade to Pro for unlimited generation!`);
      return false;
    }
  };

  const recordResumeGeneration = () => {
    if (user && user.subscriptionTier === 'free') {
      const updatedUser = {
        ...user,
        resumesGeneratedThisMonth: user.resumesGeneratedThisMonth + 1,
        lastResumeGenerationDate: new Date().toISOString(),
      };
      localStorage.setItem('resumePivotUser', JSON.stringify(updatedUser));
      const storedUsers = JSON.parse(localStorage.getItem('resumePivotUsers') || '{}');
      storedUsers[user.username] = updatedUser;
      localStorage.setItem('resumePivotUsers', JSON.stringify(storedUsers));
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, register, logout, upgradeTier, canGenerateResume, recordResumeGeneration }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};