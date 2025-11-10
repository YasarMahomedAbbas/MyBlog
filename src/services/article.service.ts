import { prisma } from "@/lib/prisma";
import { Article, ArticleStatus, Prisma } from "@prisma/client";
import { createSuccess, createError, OperationResult } from "@/lib/operation-result";
import { getLogger } from "@/lib/logging";

const logger = await getLogger("services/article");

// Types for service operations
export interface ArticleWithAuthorAndCategory extends Article {
  author: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface ArticleFilters {
  categorySlug?: string;
  isFeatured?: boolean;
  isHot?: boolean;
  status?: ArticleStatus;
  authorId?: string;
  search?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ArticleCreateInput {
  title: string;
  slug: string;
  description: string;
  content: string;
  categoryId: string;
  authorId: string;
  status?: ArticleStatus;
  isFeatured?: boolean;
  isHot?: boolean;
  readTime: string;
  publishedAt?: Date;
}

export interface ArticleUpdateInput {
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
  categoryId?: string;
  status?: ArticleStatus;
  isFeatured?: boolean;
  isHot?: boolean;
  readTime?: string;
  publishedAt?: Date;
}

export class ArticleService {
  /**
   * Get articles with optional filters and pagination
   */
  static async getArticles(
    filters: ArticleFilters = {},
    pagination: PaginationParams = {}
  ): Promise<OperationResult<{ articles: ArticleWithAuthorAndCategory[]; total: number; page: number; limit: number; totalPages: number }>> {
    try {
      const page = pagination.page || 1;
      const limit = pagination.limit || 10;
      const skip = (page - 1) * limit;

      const whereCondition: Prisma.ArticleWhereInput = {};

      // Apply filters
      if (filters.categorySlug) {
        whereCondition.category = {
          slug: filters.categorySlug,
        };
      }

      if (filters.isFeatured !== undefined) {
        whereCondition.isFeatured = filters.isFeatured;
      }

      if (filters.isHot !== undefined) {
        whereCondition.isHot = filters.isHot;
      }

      if (filters.status) {
        whereCondition.status = filters.status;
      } else {
        // Default to only published articles if no status filter is provided
        whereCondition.status = ArticleStatus.PUBLISHED;
      }

      if (filters.authorId) {
        whereCondition.authorId = filters.authorId;
      }

      if (filters.search) {
        whereCondition.OR = [
          { title: { contains: filters.search, mode: "insensitive" } },
          { description: { contains: filters.search, mode: "insensitive" } },
        ];
      }

      const [articles, total] = await Promise.all([
        prisma.article.findMany({
          where: whereCondition,
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
          orderBy: [
            { isFeatured: "desc" },
            { publishedAt: "desc" },
          ],
          skip,
          take: limit,
        }),
        prisma.article.count({ where: whereCondition }),
      ]);

      logger.info("Articles fetched successfully", {
        count: articles.length,
        filters,
        page,
        limit
      });

      return createSuccess({
        articles,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      logger.error("Error fetching articles", { err: error, filters });
      return createError("Failed to fetch articles", "FETCH_ERROR");
    }
  }

  /**
   * Get a single article by slug
   */
  static async getArticleBySlug(
    slug: string
  ): Promise<OperationResult<ArticleWithAuthorAndCategory>> {
    try {
      const article = await prisma.article.findUnique({
        where: { slug },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      if (!article) {
        return createError("Article not found", "NOT_FOUND");
      }

      logger.info("Article fetched by slug", { slug });

      return createSuccess(article);
    } catch (error) {
      logger.error("Error fetching article by slug", { err: error, slug });
      return createError("Failed to fetch article", "FETCH_ERROR");
    }
  }

  /**
   * Get a single article by ID
   */
  static async getArticleById(
    id: string
  ): Promise<OperationResult<ArticleWithAuthorAndCategory>> {
    try {
      const article = await prisma.article.findUnique({
        where: { id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      if (!article) {
        return createError("Article not found", "NOT_FOUND");
      }

      logger.info("Article fetched by ID", { id });

      return createSuccess(article);
    } catch (error) {
      logger.error("Error fetching article by ID", { err: error, id });
      return createError("Failed to fetch article", "FETCH_ERROR");
    }
  }

  /**
   * Create a new article
   */
  static async createArticle(
    data: ArticleCreateInput
  ): Promise<OperationResult<Article>> {
    try {
      // Check if slug already exists
      const existingArticle = await prisma.article.findUnique({
        where: { slug: data.slug },
      });

      if (existingArticle) {
        return createError("Article with this slug already exists", "CONFLICT");
      }

      // Verify category exists
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        return createError("Category not found", "NOT_FOUND");
      }

      // Verify author exists
      const author = await prisma.user.findUnique({
        where: { id: data.authorId },
      });

      if (!author) {
        return createError("Author not found", "NOT_FOUND");
      }

      const article = await prisma.article.create({
        data: {
          title: data.title,
          slug: data.slug,
          description: data.description,
          content: data.content,
          categoryId: data.categoryId,
          authorId: data.authorId,
          status: data.status || ArticleStatus.DRAFT,
          isFeatured: data.isFeatured || false,
          isHot: data.isHot || false,
          readTime: data.readTime,
          publishedAt: data.publishedAt,
        },
      });

      logger.info("Article created successfully", { id: article.id, slug: article.slug });

      return createSuccess(article);
    } catch (error) {
      logger.error("Error creating article", { err: error, data });
      return createError("Failed to create article", "CREATE_ERROR");
    }
  }

  /**
   * Update an existing article
   */
  static async updateArticle(
    id: string,
    data: ArticleUpdateInput
  ): Promise<OperationResult<Article>> {
    try {
      // Check if article exists
      const existingArticle = await prisma.article.findUnique({
        where: { id },
      });

      if (!existingArticle) {
        return createError("Article not found", "NOT_FOUND");
      }

      // If updating slug, check for conflicts
      if (data.slug && data.slug !== existingArticle.slug) {
        const slugConflict = await prisma.article.findUnique({
          where: { slug: data.slug },
        });

        if (slugConflict) {
          return createError("Article with this slug already exists", "CONFLICT");
        }
      }

      // If updating category, verify it exists
      if (data.categoryId) {
        const category = await prisma.category.findUnique({
          where: { id: data.categoryId },
        });

        if (!category) {
          return createError("Category not found", "NOT_FOUND");
        }
      }

      const article = await prisma.article.update({
        where: { id },
        data,
      });

      logger.info("Article updated successfully", { id: article.id });

      return createSuccess(article);
    } catch (error) {
      logger.error("Error updating article", { err: error, id, data });
      return createError("Failed to update article", "UPDATE_ERROR");
    }
  }

  /**
   * Delete an article
   */
  static async deleteArticle(id: string): Promise<OperationResult<void>> {
    try {
      const existingArticle = await prisma.article.findUnique({
        where: { id },
      });

      if (!existingArticle) {
        return createError("Article not found", "NOT_FOUND");
      }

      await prisma.article.delete({
        where: { id },
      });

      logger.info("Article deleted successfully", { id });

      return createSuccess(undefined);
    } catch (error) {
      logger.error("Error deleting article", { err: error, id });
      return createError("Failed to delete article", "DELETE_ERROR");
    }
  }

  /**
   * Increment view count for an article
   */
  static async incrementViewCount(
    slug: string
  ): Promise<OperationResult<void>> {
    try {
      await prisma.article.update({
        where: { slug },
        data: {
          viewCount: {
            increment: 1,
          },
        },
      });

      logger.info("Article view count incremented", { slug });

      return createSuccess(undefined);
    } catch (error) {
      logger.error("Error incrementing view count", { err: error, slug });
      return createError("Failed to increment view count", "UPDATE_ERROR");
    }
  }

  /**
   * Get featured articles for landing page
   */
  static async getFeaturedArticles(
    limit: number = 3
  ): Promise<OperationResult<ArticleWithAuthorAndCategory[]>> {
    try {
      const articles = await prisma.article.findMany({
        where: {
          isFeatured: true,
          status: ArticleStatus.PUBLISHED,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: [
          { publishedAt: "desc" },
        ],
        take: limit,
      });

      logger.info("Featured articles fetched", { count: articles.length });

      return createSuccess(articles);
    } catch (error) {
      logger.error("Error fetching featured articles", { err: error });
      return createError("Failed to fetch featured articles", "FETCH_ERROR");
    }
  }
}
