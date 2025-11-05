import { ILogger, LogContext, LoggerConfig } from "../types";

/**
 * Browser-optimized logger that logs to console and optionally sends to backend.
 * This is much lighter than Pino (~30KB) and provides better browser devtools integration.
 */
export class BrowserLogger implements ILogger {
  private config: LoggerConfig;
  private sendToBackend: boolean;

  constructor(config: LoggerConfig = {}, sendToBackend = true) {
    this.config = config;
    this.sendToBackend = sendToBackend;
  }

  debug(message: string, context?: LogContext): void {
    this.log("debug", message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log("info", message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log("warn", message, context);
  }

  error(message: string, context?: LogContext): void {
    this.log("error", message, context);
    // Send errors to backend for persistence
    if (this.sendToBackend) {
      this.sendLogToBackend("error", message, context);
    }
  }

  fatal(message: string, context?: LogContext): void {
    this.log("fatal", message, context);
    // Send fatal errors to backend for persistence
    if (this.sendToBackend) {
      this.sendLogToBackend("fatal", message, context);
    }
  }

  /**
   * Log to browser console with proper formatting
   */
  private log(
    level: "debug" | "info" | "warn" | "error" | "fatal",
    message: string,
    context?: LogContext
  ): void {
    const prefix = this.config.context ? `[${this.config.context}]` : "";
    const timestamp = new Date().toISOString();

    // Format the log message
    const formattedMessage = `${timestamp} ${prefix} ${message}`;

    // Choose appropriate console method
    const consoleMethod = level === "fatal" ? "error" : level;
    const consoleFunc = console[consoleMethod] || console.log;

    // Log with context if provided
    if (context && Object.keys(context).length > 0) {
      // If error object exists, extract useful info
      const processedContext = this.processContext(context);
      consoleFunc(formattedMessage, processedContext);
    } else {
      consoleFunc(formattedMessage);
    }
  }

  /**
   * Process context to extract error information for better console display
   */
  private processContext(context: LogContext): LogContext {
    const processed = { ...context };

    // If err or error field exists and is an Error, extract useful info
    if (processed.err instanceof Error) {
      processed.err = {
        name: processed.err.name,
        message: processed.err.message,
        stack: processed.err.stack,
      };
    }

    if (processed.error instanceof Error) {
      processed.error = {
        name: processed.error.name,
        message: processed.error.message,
        stack: processed.error.stack,
      };
    }

    return processed;
  }

  /**
   * Send log to backend API for persistence
   */
  private sendLogToBackend(
    level: string,
    message: string,
    context?: LogContext
  ): void {
    // Don't block the main thread or throw errors if logging fails
    try {
      const logData = {
        level,
        message,
        context: context ? this.processContext(context) : {},
        timestamp: new Date().toISOString(),
        clientInfo: {
          userAgent: navigator.userAgent,
          url: window.location.href,
          referrer: document.referrer,
          service: this.config.service,
          logContext: this.config.context,
        },
      };

      // Use fetch with keepalive to ensure logs are sent even during page unload
      fetch("/api/logs/client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logData),
        keepalive: true, // Important for logs during navigation/close
      }).catch(() => {
        // Silently fail - we don't want logging errors to break the app
        // Could add a fallback to localStorage here if needed
      });
    } catch {
      // Silently catch any errors in the logging process
    }
  }
}
