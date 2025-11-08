import { Card } from "@/components/ui/card";
import React from "react";

interface ArticleCardProps {
  icon: React.ReactNode;
  title: string;
  time: string;
}

export function ArticleCard({ icon, title, time }: ArticleCardProps) {
  const styledIcon = React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
        className: "w-12 h-12 text-primary/50",
      })
    : icon;
  return (
    <Card className="flex gap-4 p-4 hover:shadow-lg transition-all cursor-pointer group">
      <div
        className={`relative w-32 h-24 flex-shrink-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-md flex items-center justify-center`}
      >
        {styledIcon}
      </div>
      <div className="flex-1">
        <h3
          className={`text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:underline`}
        >
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{time}</p>
      </div>
    </Card>
  );
}
