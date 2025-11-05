import { NextRequest } from "next/server";
import {
  successResponse,
  badRequestResponse,
  internalServerErrorResponse,
} from "@/lib/operation-result";
import { getLogger } from "@/lib/logging";

/**
 * POST /api/test/logger
 *
 * Test endpoint for server-side logging.
 * Tests all log levels with proper error serialization.
 */
export async function POST(request: NextRequest) {
  const logger = await getLogger("api/test/logger");

  try {
    const body = await request.json();
    const { level } = body;

    if (!level) {
      return badRequestResponse("Missing required field: level");
    }

    const validLevels = ["debug", "info", "warn", "error", "fatal"];
    if (!validLevels.includes(level)) {
      return badRequestResponse(
        `Invalid log level. Must be one of: ${validLevels.join(", ")}`
      );
    }

    // Test data with context
    const testContext = {
      testId: `test-${Date.now()}`,
      timestamp: new Date().toISOString(),
      requestUrl: request.url,
      method: request.method,
      testData: {
        foo: "bar",
        nested: {
          value: 123,
          array: [1, 2, 3],
        },
      },
    };

    // Create a test error for error and fatal levels
    const testError = new Error(`Test ${level} error from server`);
    testError.stack = `Error: Test ${level} error from server
    at POST (api/test/logger/route.ts:42:23)
    at handler (next/server:123:45)
    at processRequest (next/server:456:78)`;

    // Log based on level
    switch (level) {
      case "debug":
        logger.debug("[TEST] Server debug log test", testContext);
        break;

      case "info":
        logger.info("[TEST] Server info log test", testContext);
        break;

      case "warn":
        logger.warn("[TEST] Server warning log test", {
          ...testContext,
          warningReason: "This is a test warning",
        });
        break;

      case "error":
        logger.error("[TEST] Server error log test", {
          err: testError,
          ...testContext,
          errorType: "test_error",
        });
        break;

      case "fatal":
        logger.fatal("[TEST] Server fatal log test", {
          err: testError,
          ...testContext,
          severity: "critical",
          requiresImmediate: true,
        });
        break;
    }

    return successResponse({
      message: `Successfully tested ${level} log on server`,
      level,
      timestamp: new Date().toISOString(),
      note: "Check your server console for the log output",
    });
  } catch (error) {
    logger.error("[TEST] Error in logger test endpoint", {
      err: error,
      method: "POST",
    });
    return internalServerErrorResponse();
  }
}

/**
 * GET /api/test/logger
 *
 * Returns information about the logger test endpoint.
 */
export async function GET() {
  return successResponse({
    endpoint: "/api/test/logger",
    method: "POST",
    description: "Test endpoint for server-side logging",
    supportedLevels: ["debug", "info", "warn", "error", "fatal"],
    usage: {
      method: "POST",
      body: {
        level: "debug | info | warn | error | fatal",
      },
    },
    example: {
      request: {
        method: "POST",
        body: { level: "error" },
      },
      response: {
        success: true,
        data: {
          message: "Successfully tested error log on server",
          level: "error",
          timestamp: "2025-11-05T15:30:00.000Z",
          note: "Check your server console for the log output",
        },
      },
    },
  });
}
