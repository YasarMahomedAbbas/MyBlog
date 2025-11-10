import { NextRequest } from "next/server";
import { CategoryService } from "@/services/category.service";
import {
  successResponse,
  errorResponse,
  internalServerErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/lib/operation-result";
import { getLogger } from "@/lib/logging";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { isSuccess } from "@/lib/operation-result";
import { Role, isAdmin } from "@/types/roles";

/**
 * GET /api/categories/[slug]
 * Get a single category by slug
 *
 * Query Parameters:
 * - includeCount: Include article count (true/false, default: false)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const logger = await getLogger("api/categories/[slug]");

  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);
    const includeCount = searchParams.get("includeCount") === "true";

    // Fetch category
    const result = await CategoryService.getCategoryBySlug(slug, includeCount);

    if (!isSuccess(result)) {
      if (result.code === "NOT_FOUND") {
        return notFoundResponse(result.error);
      }

      logger.error("Failed to fetch category", { error: result.error, slug });
      return errorResponse(result.error, 500, result.code);
    }

    logger.info("Category fetched successfully", { slug });

    return successResponse(result.data);
  } catch (error) {
    logger.error("Error in GET /api/categories/[slug]", { err: error, method: "GET" });
    return internalServerErrorResponse();
  }
}

/**
 * PUT /api/categories/[slug]
 * Update a category (requires admin authentication)
 *
 * Body:
 * {
 *   "name": "Updated Name" (optional),
 *   "slug": "updated-slug" (optional),
 *   "description": "Updated description" (optional),
 *   "icon": "UpdatedIcon" (optional)
 * }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const logger = await getLogger("api/categories/[slug]");

  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return unauthorizedResponse();
    }

    // Only admins can update categories
    if (!isAdmin(session.user.role as Role)) {
      return errorResponse("Admin access required", 403, "FORBIDDEN");
    }

    const { slug } = params;

    // Get the category first to get its ID
    const categoryResult = await CategoryService.getCategoryBySlug(slug);

    if (!isSuccess(categoryResult)) {
      if (categoryResult.code === "NOT_FOUND") {
        return notFoundResponse(categoryResult.error);
      }

      logger.error("Failed to fetch category", { error: categoryResult.error, slug });
      return errorResponse(categoryResult.error, 500, categoryResult.code);
    }

    const category = categoryResult.data;

    // Parse request body
    const body = await request.json();

    // Update category
    const result = await CategoryService.updateCategory(category.id, {
      name: body.name,
      slug: body.slug,
      description: body.description,
      icon: body.icon,
    });

    if (!isSuccess(result)) {
      logger.error("Failed to update category", { error: result.error, slug });

      if (result.code === "CONFLICT") {
        return errorResponse(result.error, 409, result.code);
      }

      if (result.code === "NOT_FOUND") {
        return notFoundResponse(result.error);
      }

      return errorResponse(result.error, 500, result.code);
    }

    logger.info("Category updated successfully", {
      id: result.data.id,
      slug: result.data.slug,
      userId: session.user.id
    });

    return successResponse(result.data, "Category updated successfully");
  } catch (error) {
    logger.error("Error in PUT /api/categories/[slug]", { err: error, method: "PUT" });
    return internalServerErrorResponse();
  }
}

/**
 * DELETE /api/categories/[slug]
 * Delete a category (requires admin authentication)
 * Note: Cannot delete category with existing articles
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const logger = await getLogger("api/categories/[slug]");

  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return unauthorizedResponse();
    }

    // Only admins can delete categories
    if (!isAdmin(session.user.role as Role)) {
      return errorResponse("Admin access required", 403, "FORBIDDEN");
    }

    const { slug } = params;

    // Get the category first to get its ID
    const categoryResult = await CategoryService.getCategoryBySlug(slug);

    if (!isSuccess(categoryResult)) {
      if (categoryResult.code === "NOT_FOUND") {
        return notFoundResponse(categoryResult.error);
      }

      logger.error("Failed to fetch category", { error: categoryResult.error, slug });
      return errorResponse(categoryResult.error, 500, categoryResult.code);
    }

    const category = categoryResult.data;

    // Delete category
    const result = await CategoryService.deleteCategory(category.id);

    if (!isSuccess(result)) {
      logger.error("Failed to delete category", { error: result.error, slug });

      if (result.code === "CONFLICT") {
        return errorResponse(result.error, 409, result.code);
      }

      return errorResponse(result.error, 500, result.code);
    }

    logger.info("Category deleted successfully", {
      id: category.id,
      slug,
      userId: session.user.id
    });

    return successResponse(null, "Category deleted successfully");
  } catch (error) {
    logger.error("Error in DELETE /api/categories/[slug]", { err: error, method: "DELETE" });
    return internalServerErrorResponse();
  }
}
