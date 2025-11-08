import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import { FeaturedStoryCard } from "./featured-story-card";

interface FeaturedStory {
  category: string;

  title: string;

  description: string;

  author: string;

  time: string;

  readTime: string;

  isHot?: boolean;
}

interface FeaturedStoriesSectionProps {
  stories: FeaturedStory[];
}

export function FeaturedStoriesSection({
  stories,
}: FeaturedStoriesSectionProps) {
  return (
    <section className="py-20 px-4 bg-background tech-grid-bg">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-2">
              Featured Stories
            </h2>
            <p className="text-muted-foreground text-lg">
              The latest in tech, gaming, and innovation
            </p>
          </div>
          <Button variant="outline" className="gap-2 hidden md:flex">
            <TrendingUp className="w-4 h-4" />
            Trending Now
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((story, index) => (
            <FeaturedStoryCard key={index} {...story} />
          ))}
        </div>
      </div>
    </section>
  );
}
