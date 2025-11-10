import { NextRequest } from "next/server";
import { CategoryService } from "@/services/category.service";
import {
  successResponse,
  errorResponse,
  internalServerErrorResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/lib/operation-result";
import { getLogger } from "@/lib/logging";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { isSuccess } from "@/lib/operation-result";
import { Role, isAdmin } from "@/types/roles";

/**
 * GET /api/categories
 *
 * Query Parameters:
 * - includeCount: Include article count for each category (true/false, default: false)
 *
 * Examples:
 * - GET /api/categories (Get all categories)
 * - GET /api/categories?includeCount=true (Get all categories with article counts)
 */
export async function GET(request: NextRequest) {
  const logger = await getLogger("api/categories");

  try {
    const { searchParams } = new URL(request.url);
    const includeCount = searchParams.get("includeCount") === "true";

    // Fetch categories
    const result = await CategoryService.getCategories(includeCount);

    if (!isSuccess(result)) {
      logger.error("Failed to fetch categories", { error: result.error });
      return errorResponse(result.error, 500, result.code);
    }

    logger.info("Categories fetched successfully", {
      count: result.data.length,
      includeCount
    });

    return successResponse({
      categories: result.data,
      count: result.data.length,
    });
  } catch (error) {
    logger.error("Error in GET /api/categories", { err: error, method: "GET" });
    return internalServerErrorResponse();
  }
}

/**
 * POST /api/categories
 * Create a new category (requires admin authentication)
 *
 * Body:
 * {
 *   "name": "Category Name",
 *   "slug": "category-slug",
 *   "description": "Category description" (optional),
 *   "icon": "Gamepad2" (optional)
 * }
 */
export async function POST(request: NextRequest) {
  const logger = await getLogger("api/categories");

  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return unauthorizedResponse();
    }

    // Only admins can create categories
    if (!isAdmin(session.user.role as Role)) {
      return errorResponse("Admin access required", 403, "FORBIDDEN");
    }

    // Parse request body
    const body = await request.json();

    // Validate required fields
    const requiredFields = ["name", "slug"];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return validationErrorResponse(
        "Missing required fields",
        { missingFields }
      );
    }

    // Create category
    const result = await CategoryService.createCategory({
      name: body.name,
      slug: body.slug,
      description: body.description,
      icon: body.icon,
    });

    if (!isSuccess(result)) {
      logger.error("Failed to create category", { error: result.error });

      if (result.code === "CONFLICT") {
        return errorResponse(result.error, 409, result.code);
      }

      return errorResponse(result.error, 500, result.code);
    }

    logger.info("Category created successfully", {
      id: result.data.id,
      slug: result.data.slug,
      userId: session.user.id
    });

    return successResponse(result.data, "Category created successfully", 201);
  } catch (error) {
    logger.error("Error in POST /api/categories", { err: error, method: "POST" });
    return internalServerErrorResponse();
  }
}
