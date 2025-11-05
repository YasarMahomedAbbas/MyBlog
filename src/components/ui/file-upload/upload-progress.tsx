"use client";

import { Button } from "@/components/ui/button";

interface UploadProgressProps {
  files: File[];
  uploading: boolean;
  onUpload: () => void;
}

export default function UploadProgress({
  files,
  uploading,
  onUpload,
}: UploadProgressProps) {
  if (files.length === 0) return null;

  return (
    <Button onClick={onUpload} disabled={uploading} className="w-full">
      {uploading ? "Uploading..." : `Upload ${files.length} file(s)`}
    </Button>
  );
}
