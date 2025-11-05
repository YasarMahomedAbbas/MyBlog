"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync user's database theme preference with next-themes
  useEffect(() => {
    if (mounted && session?.user?.theme) {
      const userTheme = session.user.theme.toLowerCase();
      if (
        userTheme === "system" ||
        userTheme === "light" ||
        userTheme === "dark"
      ) {
        // Only sync if different from current theme
        const currentTheme = localStorage.getItem("theme");
        if (currentTheme !== userTheme) {
          localStorage.setItem("theme", userTheme);
          // Force theme update
          window.dispatchEvent(
            new StorageEvent("storage", {
              key: "theme",
              newValue: userTheme,
            })
          );
        }
      }
    }
  }, [mounted, session?.user?.theme]);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
