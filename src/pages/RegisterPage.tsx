"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { register } from "@/services/authService";
import Navbar from "@/components/Navbar";
import { UserPlus } from "lucide-react";

const RegisterPage = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ username, email, password });
      await login({ username, password });
      navigate("/");
    } catch (error) {
      console.error("Registration failed", error);
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
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your_email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="choose_a_password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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