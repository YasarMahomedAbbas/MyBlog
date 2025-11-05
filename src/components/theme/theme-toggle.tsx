"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createLogger } from "@/lib/logging";

interface ThemeToggleProps {
  variant?: "dropdown" | "simple";
  size?: "sm" | "lg";
  excludeSystem?: boolean;
}

export function ThemeToggle({
  variant = "dropdown",
  size = "sm",
  excludeSystem = false,
}: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const updateUserTheme = async (newTheme: string) => {
    setTheme(newTheme);

    // If user is authenticated, sync to database
    if (session?.user) {
      try {
        await fetch("/api/user/theme", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ theme: newTheme.toUpperCase() }),
        });
      } catch (error) {
        const logger = createLogger({ context: "theme-toggle" });
        logger.error("Failed to sync theme to database", { err: error });
      }
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "dark":
        return <Moon className={size === "lg" ? "w-5 h-5" : "w-4 h-4"} />;
      case "light":
        return <Sun className={size === "lg" ? "w-5 h-5" : "w-4 h-4"} />;
      default:
        return <Monitor className={size === "lg" ? "w-5 h-5" : "w-4 h-4"} />;
    }
  };

  if (variant === "simple") {
    const nextTheme = excludeSystem
      ? theme === "light"
        ? "dark"
        : "light"
      : theme === "light"
        ? "dark"
        : theme === "dark"
          ? "system"
          : "light";

    return (
      <Button
        variant="ghost"
        size={size === "lg" ? "default" : "sm"}
        onClick={() => updateUserTheme(nextTheme)}
        className="gap-2"
      >
        {getThemeIcon()}
        {size === "lg" && (
          <span className="capitalize">
            {theme === "system" ? "Auto" : theme}
          </span>
        )}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={size === "lg" ? "default" : "sm"}
          className="gap-2"
        >
          {getThemeIcon()}
          {size === "lg" && (
            <span className="capitalize">
              {theme === "system" ? "Auto" : theme}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => updateUserTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateUserTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateUserTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
