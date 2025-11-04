"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { UserPlus } from "lucide-react";

const RegisterPage = () => {
  const [username, setUsername] = useState<string>("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      const success = register(username.trim());
      if (success) {
        navigate("/"); // Redirect to home or dashboard after registration
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-4xl font-bold text-primary flex items-center justify-center gap-3">
              <UserPlus className="h-8 w-8" /> Register
            </CardTitle>
            <CardDescription className="text-md mt-2">Create a new account to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-base">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="choose_a_username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-10 text-base"
                />
              </div>
              <Button type="submit" className="w-full py-2 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow">
                Register
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default RegisterPage;