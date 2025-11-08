import { Card } from "@/components/ui/card";

interface FeaturedStoryCardProps {
  category: string;
  title: string;
  description: string;
  author: string;
  time: string;
  readTime: string;
  isHot?: boolean;
}

export function FeaturedStoryCard({
  category,
  title,
  description,
  author,
  time,
  readTime,
  isHot,
}: FeaturedStoryCardProps) {
  return (
    <Card className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300">
      <div
        className={`relative h-64 bg-gradient-to-br from-card to-card/90 flex items-center justify-center`}
      >
        {isHot && (
          <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-semibold">
            HOT
          </div>
        )}
        <div
          className={`absolute bottom-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-md text-xs font-semibold`}
        >
          {category}
        </div>
        <div className={`text-6xl text-foreground/30 font-bold`}>
          {title.toUpperCase()}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{author}</span>
          <div className="flex items-center gap-3">
            <span>{time}</span>
            <span>{readTime}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
