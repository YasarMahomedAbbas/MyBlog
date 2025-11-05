import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ILogger, LoggerConfig } from "./types";
import { PinoLogger } from "./providers/pino-logger";
import { BrowserLogger } from "./providers/browser-logger";
import { getRootLogger } from "./providers/root-logger";

/**
 * Create a logger instance.
 * For server-side usage, prefer getLogger() for automatic session context.
 * For client-side or background jobs, use this function directly.
 *
 * @param config - Optional logger configuration
 * @returns Logger instance
 */
export function createLogger(config?: LoggerConfig): ILogger {
  // Check if we're in a browser environment
  if (typeof window !== "undefined") {
    // Use lightweight browser logger (no Pino dependency)
    return new BrowserLogger(config);
  }

  // Server-side: Use root logger with child for better performance
  const rootLogger = getRootLogger();
  const childLogger = rootLogger.child({
    service: config?.service || "nextjs-app",
    context: config?.context || "app",
    userId: config?.userId || "anonymous",
    userEmail: config?.userEmail || null,
  });

  return new PinoLogger(config, childLogger);
}

/**
 * Get a session-aware logger instance.
 * This automatically includes authenticated user information in all logs.
 * Use this in API routes and server components.
 *
 * @param context - Optional context identifier (e.g., "api/users")
 * @returns Promise resolving to logger instance
 */
export async function getLogger(context?: string): Promise<ILogger> {
  const session = await getServerSession(authOptions);

  // Use root logger and create child for better performance
  const rootLogger = getRootLogger();
  const childLogger = rootLogger.child({
    service: "nextjs-template",
    context: context || "app",
    userId: session?.user?.id || "anonymous",
    userEmail: session?.user?.email || undefined,
  });

  return new PinoLogger(
    {
      service: "nextjs-template",
      context: context || "app",
      userId: session?.user?.id || "anonymous",
      userEmail: session?.user?.email || undefined,
    },
    childLogger
  );
}

export * from "./types";
