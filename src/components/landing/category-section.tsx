import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import React from "react";

interface CategorySectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  viewAllLink?: string;
  children: React.ReactNode;
}

export function CategorySection({
  icon,
  title,
  description,
  viewAllLink,
  children,
}: CategorySectionProps) {
  const styledIcon = React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
        className: "w-8 h-8 text-primary",
      })
    : icon;
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            {styledIcon}
            <div>
              <h2 className="text-3xl font-bold text-foreground">{title}</h2>
              <p className="text-muted-foreground">{description}</p>
            </div>
          </div>
          {viewAllLink && (
            <Button
              variant="link"
              className={`gap-2 text-primary hover:text-primary/80`}
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
