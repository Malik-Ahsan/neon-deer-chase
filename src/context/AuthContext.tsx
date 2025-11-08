"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import * as authService from '@/services/authService';

interface User {
  username: string;
  email: string;
  subscriptionTier: string;
  generationsLeft: number;
  access_token?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (userData: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  upgradeTier: (tier: string) => void;
  canGenerateResume: () => boolean;
  recordResumeGeneration: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = authService.getToken();
    const currentUser = authService.getCurrentUser();
    if (token && currentUser) {
      setUser({
        ...currentUser,
        access_token: token,
        generationsLeft: currentUser.generationsLeft ?? 5,
      });
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (userData: any) => {
    try {
      const data = await authService.login(userData);
      const { user } = data;
      const token = authService.getToken();
      if (token) {
        const userWithToken = { ...user, access_token: token, subscriptionTier: user.subscriptionTier, generationsLeft: user.generationsLeft ?? 5 };
        setUser(userWithToken);
        authService.setCurrentUser(userWithToken);
      }
      setIsAuthenticated(true);
      toast.success(`Welcome back, ${user.username}!`);
    } catch (error) {
      toast.error('Invalid username or password.');
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      await authService.register(userData);
      toast.success(`Account created for ${userData.username}!`);
    } catch (error) {
      toast.error('Username already exists.');
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    toast.info('You have been logged out.');
  };

  const upgradeTier = (tier: string) => {
    if (user) {
      const upgradedUser = { ...user, subscriptionTier: tier };
      setUser(upgradedUser);
      authService.setCurrentUser(upgradedUser);
      toast.success(`Upgraded to ${tier.toUpperCase()}!`);
    }
  };

  const canGenerateResume = () => {
    if (!user) return false;
    if (user.subscriptionTier === 'pro' || user.subscriptionTier === 'proplus') {
      return true;
    }
    return user.generationsLeft > 0;
  };

  const recordResumeGeneration = () => {
    if (user && user.subscriptionTier === 'free') {
      const newGenerationsLeft = user.generationsLeft - 1;
      const updatedUser = { ...user, generationsLeft: newGenerationsLeft };
      setUser(updatedUser);
      authService.setCurrentUser(updatedUser);
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