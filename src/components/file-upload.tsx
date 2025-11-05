"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import FileUploadArea from "@/components/ui/file-upload/file-upload-area";
import FileList from "@/components/ui/file-upload/file-list";
import UploadProgress from "@/components/ui/file-upload/upload-progress";
import ErrorDisplay from "@/components/ui/file-upload/error-display";

interface FileUploadProps {
  bucket?: string;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  multiple?: boolean;
  onUploadComplete?: (files: UploadedFile[]) => void;
}

interface UploadedFile {
  path: string;
  fullPath: string;
  publicUrl: string;
  bucket: string;
  size: number;
  type: string;
  name: string;
}

export default function FileUpload({
  bucket = "uploads",
  maxSize = 50,
  acceptedTypes = ["image/*", "application/pdf", "text/*"],
  multiple = false,
  onUploadComplete,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Generate unique ID for this component instance
  const fileInputId = `file-upload-${bucket}-${Math.random().toString(36).substr(2, 9)}`;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setError(null);

    // Validate files
    const validFiles = selectedFiles.filter(file => {
      const sizeInMB = file.size / (1024 * 1024);
      if (sizeInMB > maxSize) {
        setError(
          `File ${file.name} is too large. Maximum size is ${maxSize}MB.`
        );
        return false;
      }
      return true;
    });

    if (multiple) {
      setFiles(prev => [...prev, ...validFiles]);
    } else {
      setFiles(validFiles.slice(0, 1));
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setError(null);
    const uploadResults: UploadedFile[] = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("bucket", bucket);

        const response = await fetch("/api/storage", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Upload failed");
        }

        const result = await response.json();
        uploadResults.push(result.data);
      }

      setUploadedFiles(prev => [...prev, ...uploadResults]);
      setFiles([]);
      onUploadComplete?.(uploadResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const selectedFilesWithIndex = files.map((file, index) => ({ file, index }));
  const uploadedFilesWithIndex = uploadedFiles.map((file, index) => ({
    file: new File([], file.name, { type: file.type }),
    index,
  }));

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          File Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FileUploadArea
          fileInputId={fileInputId}
          multiple={multiple}
          acceptedTypes={acceptedTypes}
          maxSize={maxSize}
          onFileSelect={handleFileSelect}
        />

        <FileList
          files={selectedFilesWithIndex}
          onRemoveFile={removeFile}
          title="Selected Files:"
          variant="selected"
        />

        <UploadProgress
          files={files}
          uploading={uploading}
          onUpload={uploadFiles}
        />

        <ErrorDisplay error={error} />

        <FileList
          files={uploadedFilesWithIndex}
          onRemoveFile={() => {}} // No removal for uploaded files
          title="Uploaded Files:"
          variant="uploaded"
        />
      </CardContent>
    </Card>
  );
}
