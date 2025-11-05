import { NextRequest } from "next/server";
import {
  successResponse,
  badRequestResponse,
  internalServerErrorResponse,
  tooManyRequestsResponse,
} from "@/lib/operation-result";
import { getLogger } from "@/lib/logging";

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 50; // 50 logs per minute per IP

/**
 * Simple rate limiter to prevent abuse of client logging endpoint
 */
function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    // New window
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count++;
  return true;
}

/**
 * Clean up old rate limit entries periodically
 */
function cleanupRateLimitMap(): void {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

// Clean up every 5 minutes
setInterval(cleanupRateLimitMap, 5 * 60 * 1000);

/**
 * POST /api/logs/client
 *
 * Receives client-side logs and forwards them to the server logger.
 * This allows client errors to be captured and stored with server logs.
 */
export async function POST(request: NextRequest) {
  const logger = await getLogger("api/logs/client");

  try {
    // Rate limiting by IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(ip)) {
      logger.warn("Client logging rate limit exceeded", { ip });
      return tooManyRequestsResponse(
        "Too many log requests. Please try again later."
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.level || !body.message) {
      return badRequestResponse("Missing required fields: level, message");
    }

    // Validate log level
    const validLevels = ["debug", "info", "warn", "error", "fatal"];
    if (!validLevels.includes(body.level)) {
      return badRequestResponse(
        `Invalid log level. Must be one of: ${validLevels.join(", ")}`
      );
    }

    // Sanitize and structure the log data
    const logData = {
      level: body.level,
      message: body.message,
      context: body.context || {},
      clientInfo: {
        userAgent: body.clientInfo?.userAgent || "unknown",
        url: body.clientInfo?.url || "unknown",
        referrer: body.clientInfo?.referrer || "",
        service: body.clientInfo?.service || "unknown",
        logContext: body.clientInfo?.logContext || "client",
      },
      timestamp: body.timestamp || new Date().toISOString(),
      ip,
    };

    // Log to server with appropriate level
    const serverLogger = await getLogger(
      `client/${logData.clientInfo.logContext}`
    );

    switch (body.level) {
      case "debug":
        serverLogger.debug(`[CLIENT] ${logData.message}`, {
          ...logData.context,
          ...logData.clientInfo,
        });
        break;
      case "info":
        serverLogger.info(`[CLIENT] ${logData.message}`, {
          ...logData.context,
          ...logData.clientInfo,
        });
        break;
      case "warn":
        serverLogger.warn(`[CLIENT] ${logData.message}`, {
          ...logData.context,
          ...logData.clientInfo,
        });
        break;
      case "error":
        serverLogger.error(`[CLIENT] ${logData.message}`, {
          ...logData.context,
          ...logData.clientInfo,
        });
        break;
      case "fatal":
        serverLogger.fatal(`[CLIENT] ${logData.message}`, {
          ...logData.context,
          ...logData.clientInfo,
        });
        break;
    }

    logger.debug("Client log received and processed", {
      level: body.level,
      clientContext: logData.clientInfo.logContext,
    });

    return successResponse({ received: true });
  } catch (error) {
    logger.error("Error processing client log", { err: error, method: "POST" });
    return internalServerErrorResponse();
  }
}
