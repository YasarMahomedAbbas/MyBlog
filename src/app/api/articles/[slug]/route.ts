import { NextRequest } from "next/server";
import { ArticleService } from "@/services/article.service";
import {
  successResponse,
  errorResponse,
  internalServerErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
  validationErrorResponse,
  forbiddenResponse,
} from "@/lib/operation-result";
import { getLogger } from "@/lib/logging";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { isSuccess } from "@/lib/operation-result";
import { Role, isAdmin } from "@/types/roles";

/**
 * GET /api/articles/[slug]
 * Get a single article by slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const logger = await getLogger("api/articles/[slug]");

  try {
    const { slug } = params;

    // Fetch article
    const result = await ArticleService.getArticleBySlug(slug);

    if (!isSuccess(result)) {
      if (result.code === "NOT_FOUND") {
        return notFoundResponse(result.error);
      }

      logger.error("Failed to fetch article", { error: result.error, slug });
      return errorResponse(result.error, 500, result.code);
    }

    // Increment view count asynchronously (don't await)
    ArticleService.incrementViewCount(slug).catch((error) => {
      logger.error("Failed to increment view count", { err: error, slug });
    });

    logger.info("Article fetched successfully", { slug });

    return successResponse(result.data);
  } catch (error) {
    logger.error("Error in GET /api/articles/[slug]", { err: error, method: "GET" });
    return internalServerErrorResponse();
  }
}

/**
 * PUT /api/articles/[slug]
 * Update an article (requires authentication and ownership or admin role)
 *
 * Body:
 * {
 *   "title": "Updated Title" (optional),
 *   "slug": "updated-slug" (optional),
 *   "description": "Updated description" (optional),
 *   "content": "Updated content" (optional),
 *   "categoryId": "category-id" (optional),
 *   "status": "DRAFT" | "PUBLISHED" | "ARCHIVED" (optional),
 *   "isFeatured": boolean (optional),
 *   "isHot": boolean (optional),
 *   "readTime": "8 min read" (optional),
 *   "publishedAt": "2024-01-01T00:00:00Z" (optional)
 * }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const logger = await getLogger("api/articles/[slug]");

  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return unauthorizedResponse();
    }

    const { slug } = params;

    // Get the article first to check ownership
    const articleResult = await ArticleService.getArticleBySlug(slug);

    if (!isSuccess(articleResult)) {
      if (articleResult.code === "NOT_FOUND") {
        return notFoundResponse(articleResult.error);
      }

      logger.error("Failed to fetch article", { error: articleResult.error, slug });
      return errorResponse(articleResult.error, 500, articleResult.code);
    }

    const article = articleResult.data;

    // Check if user is the author or an admin
    const isAuthor = article.authorId === session.user.id;
    const isUserAdmin = isAdmin(session.user.role as Role);

    if (!isAuthor && !isUserAdmin) {
      return forbiddenResponse("You do not have permission to update this article");
    }

    // Parse request body
    const body = await request.json();

    // Update article
    const result = await ArticleService.updateArticle(article.id, {
      title: body.title,
      slug: body.slug,
      description: body.description,
      content: body.content,
      categoryId: body.categoryId,
      status: body.status,
      isFeatured: body.isFeatured,
      isHot: body.isHot,
      readTime: body.readTime,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
    });

    if (!isSuccess(result)) {
      logger.error("Failed to update article", { error: result.error, slug });

      if (result.code === "CONFLICT") {
        return errorResponse(result.error, 409, result.code);
      }

      if (result.code === "NOT_FOUND") {
        return notFoundResponse(result.error);
      }

      return errorResponse(result.error, 500, result.code);
    }

    logger.info("Article updated successfully", {
      id: result.data.id,
      slug: result.data.slug,
      userId: session.user.id
    });

    return successResponse(result.data, "Article updated successfully");
  } catch (error) {
    logger.error("Error in PUT /api/articles/[slug]", { err: error, method: "PUT" });
    return internalServerErrorResponse();
  }
}

/**
 * DELETE /api/articles/[slug]
 * Delete an article (requires authentication and ownership or admin role)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const logger = await getLogger("api/articles/[slug]");

  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return unauthorizedResponse();
    }

    const { slug } = params;

    // Get the article first to check ownership
    const articleResult = await ArticleService.getArticleBySlug(slug);

    if (!isSuccess(articleResult)) {
      if (articleResult.code === "NOT_FOUND") {
        return notFoundResponse(articleResult.error);
      }

      logger.error("Failed to fetch article", { error: articleResult.error, slug });
      return errorResponse(articleResult.error, 500, articleResult.code);
    }

    const article = articleResult.data;

    // Check if user is the author or an admin
    const isAuthor = article.authorId === session.user.id;
    const isUserAdmin = isAdmin(session.user.role as Role);

    if (!isAuthor && !isUserAdmin) {
      return forbiddenResponse("You do not have permission to delete this article");
    }

    // Delete article
    const result = await ArticleService.deleteArticle(article.id);

    if (!isSuccess(result)) {
      logger.error("Failed to delete article", { error: result.error, slug });
      return errorResponse(result.error, 500, result.code);
    }

    logger.info("Article deleted successfully", {
      id: article.id,
      slug,
      userId: session.user.id
    });

    return successResponse(null, "Article deleted successfully");
  } catch (error) {
    logger.error("Error in DELETE /api/articles/[slug]", { err: error, method: "DELETE" });
    return internalServerErrorResponse();
  }
}
