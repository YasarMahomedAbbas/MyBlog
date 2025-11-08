import {
  ArticleCard,
  CategorySection,
  FeaturedStoriesSection,
  TechCard,
  HeroSection,
} from "@/components/landing";
import { Cpu, Gamepad2, Smartphone } from "lucide-react";

const featuredStories = [
  {
    category: "AI",
    title:
      "The Rise of AI-Powered Gaming: How Machine Learning is Changing NPCs Forever",
    description:
      "Explore how artificial intelligence is revolutionizing non-player characters and creating more immersive gaming experiences.",
    author: "Sarah Chen",
    time: "2 hours ago",
    readTime: "8 min read",
    isHot: true,
  },
  {
    category: "Gaming",
    title:
      "PlayStation 6 Rumors: Everything We Know About Sony's Next-Gen Console",
    description:
      "Leaked specs, release dates, and exclusive titles — here's what to expect from the PS6.",
    author: "Marcus Rodriguez",
    time: "5 hours ago",
    readTime: "6 min read",
    isHot: true,
  },
  {
    category: "Tech",
    title: "Apple Vision Pro 2: Spatial Computing Gets a Major Upgrade",
    description:
      "The second generation of Apple's mixed reality headset promises better performance and a lower price point.",
    author: "Emily Watson",
    time: "1 day ago",
    readTime: "10 min read",
    isHot: false,
  },
];

const gamingArticles = [
  {
    icon: <Gamepad2 />,
    title: "GTA 6 Release Date Confirmed: Everything You Need to Know",
    time: "3 hours ago",
  },
  {
    icon: <Gamepad2 />,
    title: "Elden Ring DLC Shadow of the Erdtree: Complete Guide",
    time: "6 hours ago",
  },
];

const aiArticles = [
  {
    icon: <Cpu />,
    title: "GPT-5 Rumors: What to Expect from OpenAI's Next Model",
    time: "4 hours ago",
  },
  {
    icon: <Cpu />,
    title: "Google Gemini Ultra vs ChatGPT: The Ultimate AI Showdown",
    time: "8 hours ago",
  },
];

const techArticles = [
  {
    icon: <Cpu />,
    title: "RTX 5090 Review",
  },
  {
    icon: <Smartphone />,
    title: "M4 MacBook Pro",
  },
  {
    icon: <Smartphone />,
    title: "Samsung S25 Ultra",
  },
  {
    icon: <Gamepad2 />,
    title: "Steam Deck 2",
  },
];

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedStoriesSection stories={featuredStories} />

      <CategorySection
        icon={<Gamepad2 />}
        title="Gaming"
        description="Latest gaming news and reviews"
        viewAllLink="#"
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
        viewAllLink="#"
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
        viewAllLink="#"
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
