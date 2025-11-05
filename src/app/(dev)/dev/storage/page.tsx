"use client";

import { useState, useEffect } from "react";
import FileUpload from "@/components/file-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash2 } from "lucide-react";
import { createLogger } from "@/lib/logging";
import Image from "next/image";

interface UploadedFile {
  path: string;
  fullPath: string;
  publicUrl: string;
  bucket: string;
  size: number;
  type: string;
  name: string;
}

export default function StorageDemo() {
  const [recentUploads, setRecentUploads] = useState<UploadedFile[]>([]);
  const [currentAvatar, setCurrentAvatar] = useState<UploadedFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const logger = createLogger({ context: "storage-demo-page" });

  const handleAvatarUpload = (files: UploadedFile[]) => {
    if (files.length > 0) {
      setCurrentAvatar(files[0]);
    }
  };

  const handleRegularUpload = (files: UploadedFile[]) => {
    setRecentUploads(prev => [...files, ...prev]);
  };

  const fetchRecentFiles = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/storage");
      if (response.ok) {
        const result = await response.json();
        const files = result.data || [];

        // Separate avatars from other files
        const avatars = files.filter(
          (f: UploadedFile) => f.bucket === "avatars"
        );
        const otherFiles = files.filter(
          (f: UploadedFile) => f.bucket !== "avatars"
        );

        // Set most recent avatar
        if (avatars.length > 0) {
          setCurrentAvatar(avatars[0]);
        }

        // Set other files as recent uploads
        setRecentUploads(otherFiles);
      }
    } catch (error) {
      logger.error("Failed to fetch recent files", { err: error });
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (file: UploadedFile) => {
    setDeleting(file.path);
    try {
      const response = await fetch(
        `/api/storage?path=${encodeURIComponent(file.path)}&bucket=${encodeURIComponent(file.bucket)}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Remove from local state
        setRecentUploads(prev => prev.filter(f => f.path !== file.path));

        // If it's the current avatar, clear it
        if (currentAvatar && currentAvatar.path === file.path) {
          setCurrentAvatar(null);
        }
      } else {
        logger.error("Failed to delete file", {
          filePath: file.path,
          bucket: file.bucket,
          fileName: file.name,
        });
      }
    } catch (error) {
      logger.error("Error deleting file", {
        err: error,
        filePath: file.path,
        bucket: file.bucket,
        fileName: file.name,
      });
    } finally {
      setDeleting(null);
    }
  };

  // Load existing files on mount
  useEffect(() => {
    fetchRecentFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Storage Demo</h1>
        <p className="text-muted-foreground mt-2">
          Test file upload and delete functionality with local storage services
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* File Upload Component */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Upload Files</h2>
          <FileUpload
            bucket="uploads"
            maxSize={50}
            multiple={true}
            onUploadComplete={handleRegularUpload}
          />
        </div>

        {/* Avatar Upload Example */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Avatar Upload</h2>

          {/* Current Avatar Display */}
          {currentAvatar && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Current Avatar</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
                  <Image
                    src={currentAvatar.publicUrl}
                    alt={`Avatar image for ${currentAvatar.name}`}
                    className="w-full h-full object-cover"
                    width={64}
                    height={64}
                    onError={e => {
                      // Fallback to initials if image fails to load
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <div>
                  <div className="font-medium text-sm">
                    {currentAvatar.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(currentAvatar.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteFile(currentAvatar)}
                  disabled={deleting === currentAvatar.path}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          <FileUpload
            bucket="avatars"
            maxSize={5}
            acceptedTypes={["image/png", "image/jpeg", "image/webp"]}
            multiple={false}
            onUploadComplete={handleAvatarUpload}
          />
        </div>

        {/* Document Upload Example */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Document Upload</h2>
          <FileUpload
            bucket="documents"
            maxSize={100}
            acceptedTypes={[
              "application/pdf",
              "application/msword",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ]}
            multiple={true}
            onUploadComplete={handleRegularUpload}
          />
        </div>

        {/* Recent Uploads */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Uploads</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchRecentFiles}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upload History</CardTitle>
            </CardHeader>
            <CardContent>
              {recentUploads.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No files uploaded yet. Try uploading some files!
                </p>
              ) : (
                <div className="space-y-2">
                  {recentUploads.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-sm">{file.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {file.bucket} • {(file.size / 1024 / 1024).toFixed(2)}{" "}
                          MB
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={file.publicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          View File
                        </a>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteFile(file)}
                          disabled={deleting === file.path}
                        >
                          {deleting === file.path ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">🐳 Start Storage Services</h3>
              <code className="block bg-muted p-2 rounded text-xs">
                npm run storage:start
              </code>
            </div>
            <div>
              <h3 className="font-semibold mb-2">📊 View Storage Studio</h3>
              <p>
                Open{" "}
                <a
                  href="http://127.0.0.1:54323"
                  target="_blank"
                  className="text-primary hover:underline"
                >
                  http://127.0.0.1:54323
                </a>
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🗂️ Storage Buckets</h3>
              <ul className="text-xs space-y-1">
                <li>
                  • <strong>uploads</strong> - General file uploads
                </li>
                <li>
                  • <strong>avatars</strong> - User profile pictures
                </li>
                <li>
                  • <strong>documents</strong> - PDF and document files
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">⚙️ Local Development</h3>
              <p className="text-xs">
                All files are stored locally in Docker containers. Perfect for
                development!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
