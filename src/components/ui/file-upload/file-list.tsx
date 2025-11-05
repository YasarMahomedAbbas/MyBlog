"use client";

import { X, File, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileItem {
  file: File;
  index: number;
}

interface FileListProps {
  files: FileItem[];
  onRemoveFile: (index: number) => void;
  title: string;
  variant?: "selected" | "uploaded";
}

export default function FileList({
  files,
  onRemoveFile,
  title,
  variant = "selected",
}: FileListProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isImage = (type: string) => type.startsWith("image/");

  if (files.length === 0) return null;

  const bgClass = variant === "uploaded" ? "bg-success/10" : "bg-muted";
  const iconColor =
    variant === "uploaded" ? "text-success" : "text-muted-foreground";
  const titleColor = variant === "uploaded" ? "text-success" : "";

  return (
    <div className="space-y-2">
      <h4 className={`font-medium text-sm ${titleColor}`}>{title}</h4>
      {files.map(({ file, index }) => (
        <div
          key={index}
          className={`flex items-center justify-between ${bgClass} p-3 rounded-lg`}
        >
          <div className="flex items-center gap-2">
            {isImage(file.type) ? (
              <Image
                className={`h-4 w-4 ${variant === "uploaded" ? "text-success" : "text-primary"}`}
                aria-label={`Image icon for ${file.name}`}
              />
            ) : (
              <File className={`h-4 w-4 ${iconColor}`} />
            )}
            <span className="text-sm font-medium">{file.name}</span>
            <span className="text-xs text-muted-foreground">
              ({formatFileSize(file.size)})
            </span>
          </div>
          {variant === "selected" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveFile(index)}
              className="text-destructive hover:text-destructive/80"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {variant === "uploaded" && (
            <a href="#" className="text-xs text-primary hover:underline">
              View
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
