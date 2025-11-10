import { prisma } from "@/lib/prisma";
import { Category } from "@prisma/client";
import { createSuccess, createError, OperationResult } from "@/lib/operation-result";
import { getLogger } from "@/lib/logging";

const logger = await getLogger("services/category");

// Types for service operations
export interface CategoryWithArticleCount extends Category {
  _count: {
    articles: number;
  };
}

export interface CategoryCreateInput {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface CategoryUpdateInput {
  name?: string;
  slug?: string;
  description?: string;
  icon?: string;
}

export class CategoryService {
  /**
   * Get all categories
   */
  static async getCategories(
    includeCount = false
  ): Promise<OperationResult<Category[] | CategoryWithArticleCount[]>> {
    try {
      const categories = await prisma.category.findMany({
        ...(includeCount && {
          include: {
            _count: {
              select: {
                articles: true,
              },
            },
          },
        }),
        orderBy: { name: "asc" },
      });

      logger.info("Categories fetched successfully", { count: categories.length });

      return createSuccess(categories);
    } catch (error) {
      logger.error("Error fetching categories", { err: error });
      return createError("Failed to fetch categories", "FETCH_ERROR");
    }
  }

  /**
   * Get a single category by slug
   */
  static async getCategoryBySlug(
    slug: string,
    includeCount = false
  ): Promise<OperationResult<Category | CategoryWithArticleCount>> {
    try {
      const category = await prisma.category.findUnique({
        where: { slug },
        ...(includeCount && {
          include: {
            _count: {
              select: {
                articles: true,
              },
            },
          },
        }),
      });

      if (!category) {
        return createError("Category not found", "NOT_FOUND");
      }

      logger.info("Category fetched by slug", { slug });

      return createSuccess(category);
    } catch (error) {
      logger.error("Error fetching category by slug", { err: error, slug });
      return createError("Failed to fetch category", "FETCH_ERROR");
    }
  }

  /**
   * Get a single category by ID
   */
  static async getCategoryById(
    id: string,
    includeCount = false
  ): Promise<OperationResult<Category | CategoryWithArticleCount>> {
    try {
      const category = await prisma.category.findUnique({
        where: { id },
        ...(includeCount && {
          include: {
            _count: {
              select: {
                articles: true,
              },
            },
          },
        }),
      });

      if (!category) {
        return createError("Category not found", "NOT_FOUND");
      }

      logger.info("Category fetched by ID", { id });

      return createSuccess(category);
    } catch (error) {
      logger.error("Error fetching category by ID", { err: error, id });
      return createError("Failed to fetch category", "FETCH_ERROR");
    }
  }

  /**
   * Create a new category
   */
  static async createCategory(
    data: CategoryCreateInput
  ): Promise<OperationResult<Category>> {
    try {
      // Check if slug already exists
      const existingCategory = await prisma.category.findUnique({
        where: { slug: data.slug },
      });

      if (existingCategory) {
        return createError("Category with this slug already exists", "CONFLICT");
      }

      // Check if name already exists
      const nameConflict = await prisma.category.findUnique({
        where: { name: data.name },
      });

      if (nameConflict) {
        return createError("Category with this name already exists", "CONFLICT");
      }

      const category = await prisma.category.create({
        data,
      });

      logger.info("Category created successfully", { id: category.id, slug: category.slug });

      return createSuccess(category);
    } catch (error) {
      logger.error("Error creating category", { err: error, data });
      return createError("Failed to create category", "CREATE_ERROR");
    }
  }

  /**
   * Update an existing category
   */
  static async updateCategory(
    id: string,
    data: CategoryUpdateInput
  ): Promise<OperationResult<Category>> {
    try {
      // Check if category exists
      const existingCategory = await prisma.category.findUnique({
        where: { id },
      });

      if (!existingCategory) {
        return createError("Category not found", "NOT_FOUND");
      }

      // If updating slug, check for conflicts
      if (data.slug && data.slug !== existingCategory.slug) {
        const slugConflict = await prisma.category.findUnique({
          where: { slug: data.slug },
        });

        if (slugConflict) {
          return createError("Category with this slug already exists", "CONFLICT");
        }
      }

      // If updating name, check for conflicts
      if (data.name && data.name !== existingCategory.name) {
        const nameConflict = await prisma.category.findUnique({
          where: { name: data.name },
        });

        if (nameConflict) {
          return createError("Category with this name already exists", "CONFLICT");
        }
      }

      const category = await prisma.category.update({
        where: { id },
        data,
      });

      logger.info("Category updated successfully", { id: category.id });

      return createSuccess(category);
    } catch (error) {
      logger.error("Error updating category", { err: error, id, data });
      return createError("Failed to update category", "UPDATE_ERROR");
    }
  }

  /**
   * Delete a category
   */
  static async deleteCategory(id: string): Promise<OperationResult<void>> {
    try {
      const existingCategory = await prisma.category.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              articles: true,
            },
          },
        },
      });

      if (!existingCategory) {
        return createError("Category not found", "NOT_FOUND");
      }

      // Check if category has articles
      if (existingCategory._count.articles > 0) {
        return createError(
          "Cannot delete category with existing articles",
          "CONFLICT"
        );
      }

      await prisma.category.delete({
        where: { id },
      });

      logger.info("Category deleted successfully", { id });

      return createSuccess(undefined);
    } catch (error) {
      logger.error("Error deleting category", { err: error, id });
      return createError("Failed to delete category", "DELETE_ERROR");
    }
  }
}
