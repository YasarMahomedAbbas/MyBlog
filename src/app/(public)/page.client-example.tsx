/**
 * EXAMPLE: Client-side approach using REST API
 *
 * This file shows how to fetch data from the REST API endpoints
 * using a client component. This approach is useful when you need
 * client-side interactivity or real-time data updates.
 *
 * Note: This is marked as a client component with 'use client'
 */

'use client';

import { useEffect, useState } from 'react';
import {
  ArticleCard,
  CategorySection,
  FeaturedStoriesSection,
  TechCard,
  HeroSection,
} from "@/components/landing";
import { Cpu, Gamepad2, Smartphone } from "lucide-react";

interface Article {
  id: string;
  title: string;
  description: string;
  category: {
    name: string;
    slug: string;
    icon?: string;
  };
  author: {
    name: string | null;
    email: string;
  };
  publishedAt: string;
  createdAt: string;
  readTime: string;
  isHot: boolean;
}

export default function HomePage() {
  const [featuredStories, setFeaturedStories] = useState<any[]>([]);
  const [gamingArticles, setGamingArticles] = useState<any[]>([]);
  const [aiArticles, setAiArticles] = useState<any[]>([]);
  const [techArticles, setTechArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all data in parallel
        const [featuredRes, gamingRes, aiRes, techRes] = await Promise.all([
          fetch('/api/articles/featured?limit=3'),
          fetch('/api/articles?category=gaming&featured=true&limit=2'),
          fetch('/api/articles?category=ai&featured=true&limit=2'),
          fetch('/api/articles?category=tech&featured=true&limit=4'),
        ]);

        const [featured, gaming, ai, tech] = await Promise.all([
          featuredRes.json(),
          gamingRes.json(),
          aiRes.json(),
          techRes.json(),
        ]);

        // Transform featured articles
        if (featured.success && featured.data.articles) {
          setFeaturedStories(
            featured.data.articles.map((article: Article) => ({
              category: article.category.name,
              title: article.title,
              description: article.description,
              author: article.author.name || article.author.email,
              time: getRelativeTime(article.publishedAt || article.createdAt),
              readTime: article.readTime,
              isHot: article.isHot,
            }))
          );
        }

        // Transform gaming articles
        if (gaming.success && gaming.data.articles) {
          setGamingArticles(
            gaming.data.articles.map((article: Article) => ({
              icon: <Gamepad2 />,
              title: article.title,
              time: getRelativeTime(article.publishedAt || article.createdAt),
            }))
          );
        }

        // Transform AI articles
        if (ai.success && ai.data.articles) {
          setAiArticles(
            ai.data.articles.map((article: Article) => ({
              icon: <Cpu />,
              title: article.title,
              time: getRelativeTime(article.publishedAt || article.createdAt),
            }))
          );
        }

        // Transform tech articles
        if (tech.success && tech.data.articles) {
          setTechArticles(
            tech.data.articles.map((article: Article) => ({
              icon: getCategoryIcon(article.category.icon),
              title: article.title,
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

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
function getRelativeTime(date: string): string {
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
