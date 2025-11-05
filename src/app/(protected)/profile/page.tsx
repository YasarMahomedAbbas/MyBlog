"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FullPageLoader } from "@/components/ui/loader";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import AvatarUpload from "@/components/ui/avatar-upload";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <FullPageLoader size="lg" text="Loading profile..." />;
  }

  if (!session) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  const handleAvatarUploadComplete = async () => {
    // Trigger session refresh to get updated avatar from database
    await update();
    // Force a re-render
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen gradient-hero py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <AvatarUpload
            key={refreshKey}
            size={120}
            onUploadComplete={handleAvatarUploadComplete}
          />
          <h1 className="text-3xl font-bold text-foreground mb-2 mt-4">
            {session.user.name || "User Profile"}
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Manage your account information below.
          </p>
        </div>

        {/* Profile Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Full Name
                </label>
                <p className="text-foreground bg-muted/50 p-3 rounded-md border">
                  {session.user.name || "Not provided"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Email Address
                </label>
                <p className="text-foreground bg-muted/50 p-3 rounded-md border">
                  {session.user.email}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent"></div>
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  User ID
                </label>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md border font-mono">
                  {session.user.id}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Role
                </label>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                    {session.user.role}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Theme Preferences */}
        <Card className="mb-6 border-2 border-accent/10">
          <CardHeader>
            <CardTitle className="text-xl">Theme Preferences</CardTitle>
            <CardDescription>Customize your visual experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="space-y-1">
                <h3 className="font-medium text-foreground">Color Theme</h3>
                <p className="text-sm text-muted-foreground">
                  Choose between light, dark, or system preference
                </p>
              </div>
              <ThemeToggle variant="dropdown" size="lg" />
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="mb-6 border-2 border-primary/10">
          <CardHeader>
            <CardTitle className="text-xl">Account Management</CardTitle>
            <CardDescription>
              Manage your account settings and security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="space-y-1">
                <h3 className="font-medium text-foreground">
                  Session & Security
                </h3>
                <p className="text-sm text-muted-foreground">
                  Sign out to secure your account when finished
                </p>
              </div>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="gradient-cta text-primary-foreground border-0 hover:opacity-90 transition-opacity"
              >
                Sign Out Securely
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Session Debug Information */}
        <Card className="border-warning/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-warning"></div>
              Session Debug
            </CardTitle>
            <CardDescription>
              Technical session information for development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted/50 text-muted-foreground p-4 rounded-md overflow-x-auto border">
              {JSON.stringify(session, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
