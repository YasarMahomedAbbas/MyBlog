import { Card } from "@/components/ui/card";
import React from "react";

interface TechCardProps {
  icon: React.ReactNode;
  title: string;
}

export function TechCard({ icon, title }: TechCardProps) {
  const styledIcon = React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement, {
        className: "w-16 h-16 text-primary/30",
      })
    : icon;

  return (
    <Card className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
      <div
        className={`relative h-48 bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center`}
      >
        {styledIcon}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
      </div>
    </Card>
  );
}
