"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

interface FileUploadAreaProps {
  fileInputId: string;
  multiple?: boolean;
  acceptedTypes: string[];
  maxSize: number;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FileUploadArea({
  fileInputId,
  multiple = false,
  acceptedTypes,
  maxSize,
  onFileSelect,
}: FileUploadAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    // Create a synthetic change event to reuse existing file selection logic
    const fileInput = document.getElementById(fileInputId) as HTMLInputElement;
    if (fileInput) {
      // Create a new FileList-like object
      const dataTransfer = new DataTransfer();

      // Add files to the data transfer object
      const filesToAdd = multiple ? Array.from(files) : [files[0]];
      filesToAdd.forEach(file => dataTransfer.items.add(file));

      // Update the input's files
      fileInput.files = dataTransfer.files;

      // Trigger the change event on the input element directly
      // This will create a proper React synthetic event
      const changeEvent = new Event("change", { bubbles: true });
      fileInput.dispatchEvent(changeEvent);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        isDragOver
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id={fileInputId}
        className="hidden"
        onChange={onFileSelect}
        multiple={multiple}
        accept={acceptedTypes.join(",")}
      />
      <label
        htmlFor={fileInputId}
        className="cursor-pointer flex flex-col items-center gap-2"
      >
        <Upload
          className={`h-8 w-8 transition-colors ${
            isDragOver ? "text-primary" : "text-muted-foreground"
          }`}
        />
        <span className="text-sm text-foreground">
          {isDragOver ? "Drop files here" : "Click to upload or drag and drop"}
        </span>
        <span className="text-xs text-muted-foreground">
          Max file size: {maxSize}MB
        </span>
      </label>
    </div>
  );
}
