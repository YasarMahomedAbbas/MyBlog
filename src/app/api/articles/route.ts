import { NextRequest } from "next/server";
import { ArticleService, ArticleFilters } from "@/services/article.service";
import {
  successResponse,
  errorResponse,
  internalServerErrorResponse,
  badRequestResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/lib/operation-result";
import { getLogger } from "@/lib/logging";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ArticleStatus } from "@prisma/client";
import { isSuccess } from "@/lib/operation-result";

/**
 * GET /api/articles
 *
 * Query Parameters:
 * - category: Filter by category slug
 * - featured: Filter by featured status (true/false)
 * - hot: Filter by hot status (true/false)
 * - page: Page number for pagination (default: 1)
 * - limit: Number of items per page (default: 10)
 * - search: Search in title and description
 *
 * Examples:
 * - GET /api/articles?featured=true&limit=3 (Featured articles for landing page)
 * - GET /api/articles?category=gaming&featured=true (Featured gaming articles)
 * - GET /api/articles?category=ai (All AI articles)
 */
export async function GET(request: NextRequest) {
  const logger = await getLogger("api/articles");

  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const categorySlug = searchParams.get("category") || undefined;
    const featuredParam = searchParams.get("featured");
    const hotParam = searchParams.get("hot");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || undefined;

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return badRequestResponse("Invalid pagination parameters");
    }

    // Build filters
    const filters: ArticleFilters = {
      status: ArticleStatus.PUBLISHED, // Only return published articles for public API
    };

    if (categorySlug) {
      filters.categorySlug = categorySlug;
    }

    if (featuredParam !== null) {
      filters.isFeatured = featuredParam === "true";
    }

    if (hotParam !== null) {
      filters.isHot = hotParam === "true";
    }

    if (search) {
      filters.search = search;
    }

    // Fetch articles from service
    const result = await ArticleService.getArticles(filters, { page, limit });

    if (!isSuccess(result)) {
      logger.error("Failed to fetch articles", { error: result.error });
      return errorResponse(result.error, 500, result.code);
    }

    logger.info("Articles fetched successfully", {
      count: result.data.articles.length,
      filters,
      page,
      limit
    });

    return successResponse({
      articles: result.data.articles,
      pagination: {
        page: result.data.page,
        limit: result.data.limit,
        total: result.data.total,
        totalPages: result.data.totalPages,
        hasNext: result.data.page < result.data.totalPages,
        hasPrev: result.data.page > 1,
      },
    });
  } catch (error) {
    logger.error("Error in GET /api/articles", { err: error, method: "GET" });
    return internalServerErrorResponse();
  }
}

/**
 * POST /api/articles
 * Create a new article (requires authentication)
 *
 * Body:
 * {
 *   "title": "Article Title",
 *   "slug": "article-slug",
 *   "description": "Article description",
 *   "content": "Full article content",
 *   "categoryId": "category-id",
 *   "status": "DRAFT" | "PUBLISHED" | "ARCHIVED" (optional, default: DRAFT),
 *   "isFeatured": boolean (optional, default: false),
 *   "isHot": boolean (optional, default: false),
 *   "readTime": "8 min read",
 *   "publishedAt": "2024-01-01T00:00:00Z" (optional)
 * }
 */
export async function POST(request: NextRequest) {
  const logger = await getLogger("api/articles");

  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return unauthorizedResponse();
    }

    // Parse request body
    const body = await request.json();

    // Validate required fields
    const requiredFields = ["title", "slug", "description", "content", "categoryId", "readTime"];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return validationErrorResponse(
        "Missing required fields",
        { missingFields }
      );
    }

    // Create article
    const result = await ArticleService.createArticle({
      title: body.title,
      slug: body.slug,
      description: body.description,
      content: body.content,
      categoryId: body.categoryId,
      authorId: session.user.id,
      status: body.status,
      isFeatured: body.isFeatured,
      isHot: body.isHot,
      readTime: body.readTime,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
    });

    if (!isSuccess(result)) {
      logger.error("Failed to create article", { error: result.error });

      if (result.code === "CONFLICT") {
        return errorResponse(result.error, 409, result.code);
      }

      if (result.code === "NOT_FOUND") {
        return errorResponse(result.error, 404, result.code);
      }

      return errorResponse(result.error, 500, result.code);
    }

    logger.info("Article created successfully", {
      id: result.data.id,
      slug: result.data.slug,
      authorId: session.user.id
    });

    return successResponse(result.data, "Article created successfully", 201);
  } catch (error) {
    logger.error("Error in POST /api/articles", { err: error, method: "POST" });
    return internalServerErrorResponse();
  }
}
