import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 pt-32 bg-background tech-grid-pattern">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="text-foreground">The Future of</span>
          <br />
          <span className="text-primary">Tech & Gaming</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          A bold yet elegant digital publication merging innovation and
          entertainment. Step into a world of next-gen technology — fast,
          vibrant, intelligent.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="gap-2 text-lg px-8 py-3">
            Explore Articles
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-3">
            Subscribe to Newsletter
          </Button>
        </div>
      </div>
    </section>
  );
}
