"use client";

interface ErrorDisplayProps {
  error: string | null;
}

export default function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) return null;

  return (
    <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded">
      {error}
    </div>
  );
}
