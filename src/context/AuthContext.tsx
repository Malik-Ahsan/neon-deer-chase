"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import * as authService from '@/services/authService';

interface User {
  username: string;
  email: string;
  subscriptionTier: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (userData: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  upgradeTier: (tier: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      // You might want to verify the token with the backend here
      setUser({ username: currentUser.username, email: currentUser.email, subscriptionTier: currentUser.subscriptionTier || 'free' });
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (userData: any) => {
    try {
      const data = await authService.login(userData);
      const { user } = data;
      const userWithTier = { ...user, subscriptionTier: user.subscriptionTier || 'free' };
      setUser(userWithTier);
      authService.setCurrentUser(userWithTier);
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

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, register, logout, upgradeTier }}>
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