import { NextRequest } from "next/server";
import { ArticleService } from "@/services/article.service";
import {
  successResponse,
  errorResponse,
  internalServerErrorResponse,
  badRequestResponse,
} from "@/lib/operation-result";
import { getLogger } from "@/lib/logging";
import { isSuccess } from "@/lib/operation-result";

/**
 * GET /api/articles/featured
 *
 * Query Parameters:
 * - limit: Number of featured articles to return (default: 3, max: 10)
 *
 * Examples:
 * - GET /api/articles/featured (Get 3 featured articles)
 * - GET /api/articles/featured?limit=5 (Get 5 featured articles)
 */
export async function GET(request: NextRequest) {
  const logger = await getLogger("api/articles/featured");

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "3");

    // Validate limit
    if (limit < 1 || limit > 10) {
      return badRequestResponse("Limit must be between 1 and 10");
    }

    // Fetch featured articles
    const result = await ArticleService.getFeaturedArticles(limit);

    if (!isSuccess(result)) {
      logger.error("Failed to fetch featured articles", { error: result.error });
      return errorResponse(result.error, 500, result.code);
    }

    logger.info("Featured articles fetched successfully", {
      count: result.data.length,
      limit
    });

    return successResponse({
      articles: result.data,
      count: result.data.length,
    });
  } catch (error) {
    logger.error("Error in GET /api/articles/featured", { err: error, method: "GET" });
    return internalServerErrorResponse();
  }
}
