import { Transform } from "stream";

/**
 * Simple log formatter for development
 * Provides human-readable logs with colors, without pino-pretty dependency
 */

// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  grey: "\x1b[90m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",

  // Bright variants
  brightRed: "\x1b[91m",
  brightGreen: "\x1b[92m",
  brightYellow: "\x1b[93m",
  brightBlue: "\x1b[94m",
  brightMagenta: "\x1b[95m",
  brightCyan: "\x1b[96m",
};

// Log level colors
const levelColors: Record<string, string> = {
  DEBUG: colors.brightBlue,
  INFO: colors.brightGreen,
  WARN: colors.brightYellow,
  ERROR: colors.brightRed,
  FATAL: colors.brightMagenta,
};

/**
 * Format timestamp to HH:MM:SS.mmm
 */
function formatTimestamp(time: string): string {
  const date = new Date(time);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const ms = date.getMilliseconds().toString().padStart(3, "0");
  return `${hours}:${minutes}:${seconds}.${ms}`;
}

/**
 * Format error object for display
 */
function formatError(err: unknown): string {
  if (!err) return "";

  if (err instanceof Error || (typeof err === "object" && "message" in err)) {
    const error = err as { message?: string; stack?: string; name?: string };
    const name = error.name || "Error";
    const message = error.message || "Unknown error";
    const stack = error.stack?.split("\n").slice(1, 4).join("\n    ") || "";

    return `\n  ${colors.red}${name}: ${message}${colors.reset}${stack ? `\n    ${colors.grey}${stack}${colors.reset}` : ""}`;
  }

  return JSON.stringify(err, null, 2);
}

/**
 * Format context object for display
 */
function formatContext(obj: Record<string, unknown>): string {
  // Exclude standard Pino fields
  const excludeKeys = ["level", "time", "msg", "pid", "hostname"];

  const context: Record<string, unknown> = {};
  let hasError = false;

  for (const [key, value] of Object.entries(obj)) {
    if (excludeKeys.includes(key)) continue;

    if (key === "err" || key === "error") {
      hasError = true;
      continue; // We'll handle errors separately
    }

    context[key] = value;
  }

  let result = "";

  // Add context if present
  if (Object.keys(context).length > 0) {
    result += ` ${colors.grey}${JSON.stringify(context)}${colors.reset}`;
  }

  // Add error if present
  if (hasError) {
    const error = obj.err || obj.error;
    result += formatError(error);
  }

  return result;
}

/**
 * Format a log line for pretty output
 */
export function formatLogLine(logString: string): string {
  try {
    const log = JSON.parse(logString);

    // Extract fields
    const time = log.time || new Date().toISOString();
    const level = (log.level || "INFO").toString().toUpperCase();
    const msg = log.msg || "";

    // Format timestamp
    const timestamp = formatTimestamp(time);
    const coloredTimestamp = `${colors.grey}[${timestamp}]${colors.reset}`;

    // Format level
    const levelColor = levelColors[level] || colors.white;
    const coloredLevel = `${levelColor}${level.padEnd(5)}${colors.reset}`;

    // Format context
    const contextStr = formatContext(log);

    // Combine
    return `${coloredTimestamp} ${coloredLevel} ${msg}${contextStr}`;
  } catch {
    // If parsing fails, return original string
    return logString;
  }
}

/**
 * Create a transform stream that prettifies logs
 */
export function createPrettyStream(): NodeJS.WritableStream {
  const prettyTransform = new Transform({
    transform(
      chunk: Buffer,
      _encoding: string,
      callback: (error?: Error | null) => void
    ) {
      try {
        const logString = chunk.toString().trim();
        if (!logString) {
          callback();
          return;
        }

        const formatted = formatLogLine(logString);
        this.push(formatted + "\n");
        callback();
      } catch {
        // If formatting fails, pass through original
        this.push(chunk);
        callback();
      }
    },
  });

  // Pipe to stdout
  prettyTransform.pipe(process.stdout);

  return prettyTransform;
}
