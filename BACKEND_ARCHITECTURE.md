# Backend Architecture Documentation

This document describes the backend architecture for the blog/article management system.

## Overview

The backend follows a layered architecture pattern:
- **API Layer** (`src/app/api/*`) - RESTful endpoints
- **Service Layer** (`src/services/*`) - Business logic
- **Data Layer** (Prisma) - Database access

## Database Schema

### Models

#### Article
Represents blog posts/articles with the following fields:
- `id` (String) - Unique identifier
- `title` (String) - Article title
- `slug` (String, unique) - URL-friendly identifier
- `description` (String) - Short excerpt/summary
- `content` (Text) - Full article content
- `categoryId` (String) - Foreign key to Category
- `authorId` (String) - Foreign key to User
- `status` (ArticleStatus) - DRAFT | PUBLISHED | ARCHIVED
- `isFeatured` (Boolean) - Featured on landing page
- `isHot` (Boolean) - Trending/hot badge
- `readTime` (String) - e.g., "8 min read"
- `viewCount` (Integer) - Page view counter
- `publishedAt` (DateTime, optional) - Publication date
- `createdAt`, `updatedAt` (DateTime) - Timestamps

**Indexes**: slug, categoryId, authorId, status, isFeatured, publishedAt

#### Category
Represents article categories:
- `id` (String) - Unique identifier
- `name` (String, unique) - Category name
- `slug` (String, unique) - URL-friendly identifier
- `description` (String, optional) - Category description
- `icon` (String, optional) - Icon identifier (e.g., "Gamepad2", "Cpu")
- `createdAt`, `updatedAt` (DateTime) - Timestamps

**Indexes**: slug

## Service Layer

### ArticleService (`src/services/article.service.ts`)

Handles all article-related business logic.

#### Methods

##### `getArticles(filters, pagination)`
Get articles with optional filters and pagination.

**Filters:**
- `categorySlug` - Filter by category
- `isFeatured` - Filter by featured status
- `isHot` - Filter by hot status
- `status` - Filter by article status (defaults to PUBLISHED)
- `authorId` - Filter by author
- `search` - Search in title and description

**Pagination:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Returns:** `{ articles, total, page, limit, totalPages }`

##### `getArticleBySlug(slug)`
Get a single article by its slug.

##### `getArticleById(id)`
Get a single article by its ID.

##### `createArticle(data)`
Create a new article.

**Required fields:** title, slug, description, content, categoryId, authorId, readTime

##### `updateArticle(id, data)`
Update an existing article.

##### `deleteArticle(id)`
Delete an article.

##### `incrementViewCount(slug)`
Increment the view count for an article.

##### `getFeaturedArticles(limit)`
Get featured articles for the landing page (default limit: 3).

### CategoryService (`src/services/category.service.ts`)

Handles all category-related business logic.

#### Methods

##### `getCategories(includeCount)`
Get all categories, optionally with article counts.

##### `getCategoryBySlug(slug, includeCount)`
Get a single category by slug.

##### `getCategoryById(id, includeCount)`
Get a single category by ID.

##### `createCategory(data)`
Create a new category.

**Required fields:** name, slug

##### `updateCategory(id, data)`
Update an existing category.

##### `deleteCategory(id)`
Delete a category (only if no articles exist).

## REST API Endpoints

All API responses follow the `OperationResult` pattern defined in `src/lib/operation-result.ts`.

### Articles

#### `GET /api/articles`
Get a list of articles.

**Query Parameters:**
- `category` - Filter by category slug
- `featured` - Filter by featured status (true/false)
- `hot` - Filter by hot status (true/false)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `search` - Search query

**Examples:**
```
GET /api/articles?featured=true&limit=3
GET /api/articles?category=gaming&featured=true
GET /api/articles?search=AI&page=2
```

**Response:**
```json
{
  "success": true,
  "data": {
    "articles": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### `POST /api/articles`
Create a new article (requires authentication).

**Body:**
```json
{
  "title": "Article Title",
  "slug": "article-slug",
  "description": "Article description",
  "content": "Full article content",
  "categoryId": "category-id",
  "status": "DRAFT",
  "isFeatured": false,
  "isHot": false,
  "readTime": "8 min read",
  "publishedAt": "2024-01-01T00:00:00Z"
}
```

#### `GET /api/articles/featured`
Get featured articles for the landing page.

**Query Parameters:**
- `limit` - Number of articles (default: 3, max: 10)

**Example:**
```
GET /api/articles/featured?limit=5
```

#### `GET /api/articles/[slug]`
Get a single article by slug. Automatically increments view count.

**Example:**
```
GET /api/articles/my-article-slug
```

#### `PUT /api/articles/[slug]`
Update an article (requires authentication and ownership or admin role).

**Body:** Same as POST, but all fields are optional.

#### `DELETE /api/articles/[slug]`
Delete an article (requires authentication and ownership or admin role).

### Categories

#### `GET /api/categories`
Get all categories.

**Query Parameters:**
- `includeCount` - Include article count (true/false)

**Example:**
```
GET /api/categories?includeCount=true
```

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "cat-1",
        "name": "Gaming",
        "slug": "gaming",
        "description": "Gaming articles",
        "icon": "Gamepad2",
        "_count": {
          "articles": 25
        }
      }
    ],
    "count": 3
  }
}
```

#### `POST /api/categories`
Create a new category (requires admin authentication).

**Body:**
```json
{
  "name": "Category Name",
  "slug": "category-slug",
  "description": "Category description",
  "icon": "Gamepad2"
}
```

#### `GET /api/categories/[slug]`
Get a single category by slug.

**Query Parameters:**
- `includeCount` - Include article count (true/false)

#### `PUT /api/categories/[slug]`
Update a category (requires admin authentication).

#### `DELETE /api/categories/[slug]`
Delete a category (requires admin authentication, only if no articles exist).

## Usage Examples

### Landing Page - Server Component (Recommended)

For server-rendered pages, directly use the service layer:

```tsx
import { ArticleService } from "@/services/article.service";
import { isSuccess } from "@/lib/operation-result";

export default async function HomePage() {
  const result = await ArticleService.getFeaturedArticles(3);
  const articles = isSuccess(result) ? result.data : [];

  return (
    <div>
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
```

### Client Component

For client-side data fetching, use the REST API:

```tsx
'use client';

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch('/api/articles?featured=true&limit=3')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setArticles(data.data.articles);
        }
      });
  }, []);

  return (
    <div>
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
```

## Migration Steps

1. Review the Prisma schema in `prisma/schema.prisma`
2. Create a new migration:
   ```bash
   npx prisma migrate dev --name add_articles_and_categories
   ```
3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
4. Seed the database with initial categories:
   ```bash
   npx prisma db seed
   ```

## Next Steps

1. Create seed script to populate initial categories (Gaming, AI, Tech, etc.)
2. Update landing page to use the new service layer
3. Create admin panel for article management
4. Add image upload functionality for article thumbnails
5. Implement article tags/keywords for better SEO
6. Add comments/engagement features
