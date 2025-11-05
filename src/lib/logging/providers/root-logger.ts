import pino from "pino";
import { createPrettyStream } from "./pretty-formatter";

let rootLoggerInstance: pino.Logger | null = null;

/**
 * Get or create the singleton root Pino logger instance.
 * This improves performance by reusing the same logger configuration
 * and transport across all logging operations.
 *
 * @returns The root Pino logger instance
 */
export function getRootLogger(): pino.Logger {
  if (rootLoggerInstance) {
    return rootLoggerInstance;
  }

  const isDev = process.env.NODE_ENV === "development";

  // Create pretty stream for development
  const stream = isDev ? createPrettyStream() : process.stdout;

  rootLoggerInstance = pino(
    {
      level: isDev ? "debug" : "info",
      formatters: {
        level: label => {
          return { level: label.toUpperCase() };
        },
        bindings: bindings => {
          // Remove pid and hostname in development for cleaner output
          if (isDev) {
            return {};
          }
          return bindings;
        },
      },
      timestamp: pino.stdTimeFunctions.isoTime,
      // Base context is minimal - child loggers will add more context
      base: {
        environment: process.env.NODE_ENV || "development",
      },
    },
    stream
  );

  return rootLoggerInstance;
}

/**
 * Reset the root logger instance. Primarily used for testing.
 */
export function resetRootLogger(): void {
  rootLoggerInstance = null;
}
