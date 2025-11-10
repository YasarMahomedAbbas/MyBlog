/**
 * EXAMPLE: Updated landing page using the new backend
 *
 * This file shows how to integrate the landing page with the new Article and Category services.
 *
 * Two approaches:
 * 1. Server Component (recommended) - Directly call service layer
 * 2. Client Component - Fetch from REST API endpoints
 *
 * This example uses approach #1 (Server Component with direct service calls)
 * which is more efficient for server-rendered pages.
 */

import {
  ArticleCard,
  CategorySection,
  FeaturedStoriesSection,
  TechCard,
  HeroSection,
} from "@/components/landing";
import { Cpu, Gamepad2, Smartphone } from "lucide-react";
import { ArticleService } from "@/services/article.service";
import { CategoryService } from "@/services/category.service";
import { isSuccess } from "@/lib/operation-result";

export default async function HomePage() {
  // Fetch featured articles for the hero section
  const featuredResult = await ArticleService.getFeaturedArticles(3);
  const featuredStories = isSuccess(featuredResult)
    ? featuredResult.data.map((article) => ({
        category: article.category.name,
        title: article.title,
        description: article.description,
        author: article.author.name || article.author.email,
        time: getRelativeTime(article.publishedAt || article.createdAt),
        readTime: article.readTime,
        isHot: article.isHot,
      }))
    : [];

  // Fetch Gaming articles
  const gamingResult = await ArticleService.getArticles(
    { categorySlug: "gaming", isFeatured: true },
    { limit: 2 }
  );
  const gamingArticles = isSuccess(gamingResult)
    ? gamingResult.data.articles.map((article) => ({
        icon: <Gamepad2 />,
        title: article.title,
        time: getRelativeTime(article.publishedAt || article.createdAt),
      }))
    : [];

  // Fetch AI articles
  const aiResult = await ArticleService.getArticles(
    { categorySlug: "ai", isFeatured: true },
    { limit: 2 }
  );
  const aiArticles = isSuccess(aiResult)
    ? aiResult.data.articles.map((article) => ({
        icon: <Cpu />,
        title: article.title,
        time: getRelativeTime(article.publishedAt || article.createdAt),
      }))
    : [];

  // Fetch Tech articles
  const techResult = await ArticleService.getArticles(
    { categorySlug: "tech", isFeatured: true },
    { limit: 4 }
  );
  const techArticles = isSuccess(techResult)
    ? techResult.data.articles.map((article) => ({
        icon: getCategoryIcon(article.category.icon),
        title: article.title,
      }))
    : [];

  return (
    <>
      <HeroSection />
      <FeaturedStoriesSection stories={featuredStories} />

      <CategorySection
        icon={<Gamepad2 />}
        title="Gaming"
        description="Latest gaming news and reviews"
        viewAllLink="/articles?category=gaming"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gamingArticles.map((article, index) => (
            <ArticleCard key={index} {...article} />
          ))}
        </div>
      </CategorySection>

      <CategorySection
        icon={<Cpu />}
        title="Artificial Intelligence"
        description="Exploring the future of AI"
        viewAllLink="/articles?category=ai"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aiArticles.map((article, index) => (
            <ArticleCard key={index} {...article} />
          ))}
        </div>
      </CategorySection>

      <CategorySection
        icon={<Smartphone />}
        title="Tech"
        description="Reviews and benchmarks"
        viewAllLink="/articles?category=tech"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {techArticles.map((article, index) => (
            <TechCard key={index} {...article} />
          ))}
        </div>
      </CategorySection>
    </>
  );
}

// Helper function to get relative time (e.g., "2 hours ago")
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) {
    return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
  } else {
    return new Date(date).toLocaleDateString();
  }
}

// Helper function to get icon component based on icon string
function getCategoryIcon(icon?: string | null) {
  switch (icon) {
    case "Gamepad2":
      return <Gamepad2 />;
    case "Cpu":
      return <Cpu />;
    case "Smartphone":
      return <Smartphone />;
    default:
      return <Cpu />;
  }
}
