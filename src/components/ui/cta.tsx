/**
 * CTA Component - A flexible Call-to-Action component that spans full width
 *
 * Variants:
 * - "gradient": Uses gradient-cta background from globals.css with white text
 * - "default": Card background with normal text colors
 * - "outline": Transparent background with top/bottom borders
 *
 * Sizes: "sm" | "md" | "lg" (affects padding and text sizes)
 */

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CTAProps {
  title: string;
  description?: string;
  buttonText: string;
  href: string;
  variant?: "default" | "gradient" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  showArrow?: boolean;
}

export function CTA({
  title,
  description,
  buttonText,
  href,
  variant = "gradient",
  size = "md",
  className,
  showArrow = true,
}: CTAProps) {
  const sizeClasses = {
    sm: "py-8",
    md: "py-12",
    lg: "py-16",
  };

  const titleClasses = {
    sm: "text-xl",
    md: "text-2xl md:text-3xl",
    lg: "text-3xl md:text-4xl lg:text-5xl",
  };

  const descriptionClasses = {
    sm: "text-sm",
    md: "text-base md:text-lg",
    lg: "text-lg md:text-xl",
  };

  return (
    <div
      className={cn(
        "w-full text-center px-4",
        variant === "gradient" && "gradient-cta text-white",
        variant === "default" && "bg-card",
        variant === "outline" &&
          "border-t-2 border-b-2 border-primary/20 bg-background",
        sizeClasses[size],
        className
      )}
    >
      <div className="max-w-4xl mx-auto">
        <h2
          className={cn(
            "font-bold mb-4",
            titleClasses[size],
            variant === "gradient" ? "text-white" : "text-foreground"
          )}
        >
          {title}
        </h2>

        {description && (
          <p
            className={cn(
              "mb-6 opacity-90 max-w-2xl mx-auto",
              descriptionClasses[size],
              variant === "gradient" ? "text-white" : "text-muted-foreground"
            )}
          >
            {description}
          </p>
        )}

        <Button
          asChild
          size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
          variant={variant === "gradient" ? "secondary" : "default"}
          className={cn(
            "gap-2",
            variant === "gradient" && "bg-white text-primary hover:bg-white/90"
          )}
        >
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Link href={href as any}>
            {buttonText}
            {showArrow && <ArrowRight className="w-4 h-4" />}
          </Link>
        </Button>
      </div>
    </div>
  );
}
