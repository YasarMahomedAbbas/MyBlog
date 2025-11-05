import pino from "pino";
import { ILogger, LogContext, LoggerConfig } from "../types";

export class PinoLogger implements ILogger {
  private logger: pino.Logger;

  /**
   * Create a PinoLogger instance.
   *
   * @param config - Logger configuration
   * @param childLogger - Optional pre-configured child logger. If provided, wraps this logger
   *                      for better performance. If not provided, creates a new logger instance.
   */
  constructor(config: LoggerConfig = {}, childLogger?: pino.Logger) {
    // If a child logger is provided, use it directly (performance optimization)
    if (childLogger) {
      this.logger = childLogger;
      return;
    }

    // Otherwise, create a new logger instance (backward compatibility / client-side)
    const isDev = process.env.NODE_ENV === "development";

    this.logger = pino({
      level: config.level || (isDev ? "debug" : "info"),
      // Use simple formatters for better compatibility
      // This avoids pino-pretty dependency issues
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
      base: {
        service: config.service || "nextjs-app",
        environment:
          config.environment || process.env.NODE_ENV || "development",
        context: config.context || "app",
        userId: config.userId || "anonymous",
        userEmail: config.userEmail || null,
      },
    });
  }

  debug(message: string, context?: LogContext): void {
    this.logger.debug(context || {}, message);
  }

  info(message: string, context?: LogContext): void {
    this.logger.info(context || {}, message);
  }

  warn(message: string, context?: LogContext): void {
    this.logger.warn(context || {}, message);
  }

  error(message: string, context?: LogContext): void {
    // Ensure proper error serialization by checking for Error objects
    const processedContext = this.processErrorContext(context);
    this.logger.error(processedContext, message);
  }

  fatal(message: string, context?: LogContext): void {
    // Ensure proper error serialization by checking for Error objects
    const processedContext = this.processErrorContext(context);
    this.logger.fatal(processedContext, message);
  }

  /**
   * Process context to ensure Error objects are properly serialized by Pino.
   * Pino automatically serializes the 'err' field, so we need to normalize
   * error fields to use this convention.
   */
  private processErrorContext(context?: LogContext): LogContext {
    if (!context) return {};

    const processed = { ...context };

    // If 'err' exists and is an Error, keep it (Pino will serialize it)
    // If 'error' exists and is an Error, copy it to 'err' for Pino serialization
    if (processed.error instanceof Error && !processed.err) {
      processed.err = processed.error;
      delete processed.error;
    }

    return processed;
  }
}
