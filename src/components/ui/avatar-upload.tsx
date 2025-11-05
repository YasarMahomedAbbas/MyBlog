"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { createLogger } from "@/lib/logging";

interface AvatarUploadProps {
  size?: number;
  showUpload?: boolean;
  userId?: string;
  userAvatar?: string | null;
  userName?: string | null;
  className?: string;
  onUploadComplete?: (avatarPath: string) => void;
}

export default function AvatarUpload({
  size = 150,
  showUpload = true,
  userId,
  userAvatar,
  userName,
  className = "",
  onUploadComplete,
}: AvatarUploadProps) {
  const { data: session } = useSession();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine which user data to use (props override session)
  const currentUserId = userId || session?.user?.id;
  const currentUserAvatar =
    userAvatar !== undefined ? userAvatar : session?.user?.avatar;
  const currentUserName =
    userName !== undefined ? userName : session?.user?.name;

  // Get user initials for fallback
  const userInitials = currentUserName
    ? currentUserName
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
    : session?.user?.email?.[0]?.toUpperCase() || "U";

  // Download and display avatar image
  useEffect(() => {
    if (currentUserAvatar) {
      downloadImage(currentUserAvatar);
    } else {
      setAvatarUrl(null);
    }
  }, [currentUserAvatar]);

  const downloadImage = async (path: string) => {
    try {
      // Get public URL from s3 storage
      const response = await fetch(`/api/storage/avatars/${path}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setAvatarUrl(url);
      } else {
        const logger = createLogger({ context: "avatar-upload" });
        logger.warn("Failed to download avatar image", { path });
        setAvatarUrl(null);
      }
    } catch (error) {
      const logger = createLogger({ context: "avatar-upload" });
      logger.error("Error downloading image", { err: error, path });
      setAvatarUrl(null);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadAvatar(file);
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      setUploading(true);
      setError(null);

      // Validate file type
      if (!file.type.startsWith("image/")) {
        throw new Error("Please select an image file");
      }

      // Validate file size (5MB limit for avatars)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File too large. Maximum size is 5MB");
      }

      // Upload file to storage
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "avatars");

      const uploadResponse = await fetch("/api/storage", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const uploadResult = await uploadResponse.json();
      const avatarPath = uploadResult.data.path;

      // Update user avatar in database
      const updateResponse = await fetch("/api/user/avatar", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ avatarPath }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      // Update the displayed avatar
      downloadImage(avatarPath);

      // Call callback if provided
      onUploadComplete?.(avatarPath);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      setError(errorMessage);
      const logger = createLogger({ context: "avatar-upload" });
      logger.error("Avatar upload error", {
        err: error,
        userId: currentUserId,
      });
    } finally {
      setUploading(false);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="relative">
        <Avatar
          className="border-4 border-border shadow-lg"
          style={{ width: size, height: size }}
        >
          <AvatarImage
            src={avatarUrl || undefined}
            alt={`${currentUserName || "User"}'s avatar`}
          />
          <AvatarFallback
            className="text-xl font-semibold bg-gradient-to-br from-primary to-accent text-primary-foreground"
            style={{ fontSize: Math.max(size / 6, 14) }}
          >
            {userInitials}
          </AvatarFallback>
        </Avatar>

        {uploading && (
          <div
            className="absolute inset-0 bg-background/80 rounded-full flex items-center justify-center"
            style={{ width: size, height: size }}
          >
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
      </div>

      {showUpload && currentUserId === session?.user?.id && (
        <div className="flex flex-col items-center gap-2">
          <Button
            onClick={handleUploadClick}
            disabled={uploading}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading..." : "Upload Avatar"}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive text-center max-w-xs">{error}</p>
      )}
    </div>
  );
}
