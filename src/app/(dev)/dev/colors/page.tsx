import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ColorTestPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />

        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
          <div className="text-2xl font-bold text-foreground">
            Template Project
          </div>
          <div className="hidden md:flex space-x-8">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Colors
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Components
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Docs
            </a>
          </div>
          <div className="flex space-x-3">
            <Button variant="secondary">Sign In</Button>
            <Button>Get Started</Button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6">
              Beautiful
              <span className="text-primary"> Tailwind </span>
              Theme
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience the power of Tailwind CSS v4 with custom semantic
              colors, dark mode support, and modern design tokens built for
              scalable applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-6 text-lg">
                Explore Theme
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                View Code
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Cards */}
        <div className="absolute top-1/2 left-8 transform -translate-y-1/2 hidden xl:block">
          <Card className="p-4">
            <div className="w-3 h-3 bg-primary rounded-full mb-2"></div>
            <div className="text-sm text-card-foreground font-medium">
              bg-primary
            </div>
          </Card>
        </div>
        <div className="absolute top-3/4 right-12 transform -translate-y-1/2 hidden xl:block">
          <Card className="bg-accent text-accent-foreground p-4">
            <div className="w-3 h-3 bg-accent-foreground rounded-full mb-2"></div>
            <div className="text-sm font-medium">bg-accent</div>
          </Card>
        </div>
      </div>

      {/* Color Palette Showcase */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Color Palette
            </h2>
            <p className="text-muted-foreground text-lg">
              Carefully crafted colors for your design system
            </p>
          </div>

          <div className="grid gap-8">
            {/* Primary Row */}
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary rounded-xl mb-3 shadow-lg"></div>
                <div className="text-sm font-medium text-foreground">
                  Primary
                </div>
                <div className="text-xs text-muted-foreground">bg-primary</div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-secondary rounded-xl mb-3 shadow-lg"></div>
                <div className="text-sm font-medium text-foreground">
                  Secondary
                </div>
                <div className="text-xs text-muted-foreground">
                  bg-secondary
                </div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-accent rounded-xl mb-3 shadow-lg"></div>
                <div className="text-sm font-medium text-foreground">
                  Accent
                </div>
                <div className="text-xs text-muted-foreground">bg-accent</div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-muted rounded-xl mb-3 shadow-lg"></div>
                <div className="text-sm font-medium text-foreground">Muted</div>
                <div className="text-xs text-muted-foreground">bg-muted</div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-destructive rounded-xl mb-3 shadow-lg"></div>
                <div className="text-sm font-medium text-foreground">
                  Destructive
                </div>
                <div className="text-xs text-muted-foreground">
                  bg-destructive
                </div>
              </div>
            </div>

            {/* Chart Colors */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Chart Colors
              </h3>
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[hsl(var(--chart-1))] rounded-lg shadow-lg mb-2"></div>
                  <div className="text-xs text-muted-foreground">chart-1</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[hsl(var(--chart-2))] rounded-lg shadow-lg mb-2"></div>
                  <div className="text-xs text-muted-foreground">chart-2</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[hsl(var(--chart-3))] rounded-lg shadow-lg mb-2"></div>
                  <div className="text-xs text-muted-foreground">chart-3</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[hsl(var(--chart-4))] rounded-lg shadow-lg mb-2"></div>
                  <div className="text-xs text-muted-foreground">chart-4</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[hsl(var(--chart-5))] rounded-lg shadow-lg mb-2"></div>
                  <div className="text-xs text-muted-foreground">chart-5</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Typography Showcase */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Typography System
            </h2>
            <p className="text-muted-foreground text-lg">
              Consistent typography scale with semantic classes
            </p>
          </div>

          <div className="grid gap-16">
            {/* Headings */}
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-8">
                Headings
              </h3>
              <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="lg:w-1/3">
                    <h1 className="text-4xl font-bold text-foreground">
                      Heading 1
                    </h1>
                  </div>
                  <div className="lg:w-2/3">
                    <code className="bg-muted text-muted-foreground px-3 py-1 rounded text-sm">
                      text-4xl font-bold text-foreground
                    </code>
                    <p className="text-muted-foreground text-sm mt-2">
                      Use for main page titles, hero headlines. Pairs with
                      text-xl for subtitles.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="lg:w-1/3">
                    <h2 className="text-3xl font-bold text-foreground">
                      Heading 2
                    </h2>
                  </div>
                  <div className="lg:w-2/3">
                    <code className="bg-muted text-muted-foreground px-3 py-1 rounded text-sm">
                      text-3xl font-bold text-foreground
                    </code>
                    <p className="text-muted-foreground text-sm mt-2">
                      Use for major section headings, feature titles. Should be
                      prominent but not overwhelming.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="lg:w-1/3">
                    <h3 className="text-2xl font-semibold text-foreground">
                      Heading 3
                    </h3>
                  </div>
                  <div className="lg:w-2/3">
                    <code className="bg-muted text-muted-foreground px-3 py-1 rounded text-sm">
                      text-2xl font-semibold text-foreground
                    </code>
                    <p className="text-muted-foreground text-sm mt-2">
                      Use for subsection headings, card titles. Note the
                      font-semibold instead of font-bold.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="lg:w-1/3">
                    <h4 className="text-xl font-semibold text-foreground">
                      Heading 4
                    </h4>
                  </div>
                  <div className="lg:w-2/3">
                    <code className="bg-muted text-muted-foreground px-3 py-1 rounded text-sm">
                      text-xl font-semibold text-foreground
                    </code>
                    <p className="text-muted-foreground text-sm mt-2">
                      Use for component titles, form section headers.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="lg:w-1/3">
                    <h5 className="text-lg font-medium text-foreground">
                      Heading 5
                    </h5>
                  </div>
                  <div className="lg:w-2/3">
                    <code className="bg-muted text-muted-foreground px-3 py-1 rounded text-sm">
                      text-lg font-medium text-foreground
                    </code>
                    <p className="text-muted-foreground text-sm mt-2">
                      Use for smaller component titles, list headers. Note the
                      font-medium weight.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Body Text */}
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-8">
                Body Text
              </h3>
              <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="lg:w-1/3">
                    <p className="text-xl text-foreground">
                      Large body text for introductory paragraphs and important
                      descriptions.
                    </p>
                  </div>
                  <div className="lg:w-2/3">
                    <code className="bg-muted text-muted-foreground px-3 py-1 rounded text-sm">
                      text-xl text-foreground
                    </code>
                    <p className="text-muted-foreground text-sm mt-2">
                      Use for hero descriptions, lead paragraphs, important
                      introductory text.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="lg:w-1/3">
                    <p className="text-base text-foreground">
                      Regular body text for most content, paragraphs, and
                      general information throughout your application.
                    </p>
                  </div>
                  <div className="lg:w-2/3">
                    <code className="bg-muted text-muted-foreground px-3 py-1 rounded text-sm">
                      text-base text-foreground
                    </code>
                    <p className="text-muted-foreground text-sm mt-2">
                      Default body text size. Use for most content,
                      descriptions, form labels.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="lg:w-1/3">
                    <p className="text-sm text-muted-foreground">
                      Smaller supporting text for captions, helper text, and
                      secondary information.
                    </p>
                  </div>
                  <div className="lg:w-2/3">
                    <code className="bg-muted text-muted-foreground px-3 py-1 rounded text-sm">
                      text-sm text-muted-foreground
                    </code>
                    <p className="text-muted-foreground text-sm mt-2">
                      Use for captions, helper text, form descriptions, meta
                      information.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="lg:w-1/3">
                    <p className="text-xs text-muted-foreground">
                      Very small text for timestamps, labels, and fine print.
                    </p>
                  </div>
                  <div className="lg:w-2/3">
                    <code className="bg-muted text-muted-foreground px-3 py-1 rounded text-sm">
                      text-xs text-muted-foreground
                    </code>
                    <p className="text-muted-foreground text-sm mt-2">
                      Use for timestamps, badges, fine print, code examples.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Text */}
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-8">
                Interactive Text
              </h3>
              <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="lg:w-1/3">
                    <a
                      href="#"
                      className="text-primary hover:text-primary/80 underline underline-offset-4"
                    >
                      Primary Link
                    </a>
                  </div>
                  <div className="lg:w-2/3">
                    <code className="bg-muted text-muted-foreground px-3 py-1 rounded text-sm">
                      text-primary hover:text-primary/80 underline
                      underline-offset-4
                    </code>
                    <p className="text-muted-foreground text-sm mt-2">
                      Use for primary navigation links, important CTAs in text.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="lg:w-1/3">
                    <button className="text-primary hover:text-primary/80 font-medium">
                      Button Link Style
                    </button>
                  </div>
                  <div className="lg:w-2/3">
                    <code className="bg-muted text-muted-foreground px-3 py-1 rounded text-sm">
                      text-primary hover:text-primary/80 font-medium
                    </code>
                    <p className="text-muted-foreground text-sm mt-2">
                      Use for text-based buttons, subtle CTAs, "Learn more"
                      links.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="lg:w-1/3">
                    <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      Subtle Link
                    </span>
                  </div>
                  <div className="lg:w-2/3">
                    <code className="bg-muted text-muted-foreground px-3 py-1 rounded text-sm">
                      text-muted-foreground hover:text-foreground
                      transition-colors
                    </code>
                    <p className="text-muted-foreground text-sm mt-2">
                      Use for secondary navigation, breadcrumbs, subtle
                      interactions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Code and Monospace */}
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-8">
                Code & Monospace
              </h3>
              <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="lg:w-1/3">
                    <code className="bg-muted text-muted-foreground px-2 py-1 rounded font-mono text-sm">
                      inline code
                    </code>
                  </div>
                  <div className="lg:w-2/3">
                    <code className="bg-muted text-muted-foreground px-3 py-1 rounded text-sm">
                      bg-muted text-muted-foreground px-2 py-1 rounded font-mono
                      text-sm
                    </code>
                    <p className="text-muted-foreground text-sm mt-2">
                      Use for inline code snippets, class names, API endpoints.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="lg:w-1/3">
                    <pre className="bg-muted text-muted-foreground p-4 rounded font-mono text-sm overflow-x-auto">
                      {`function example() {
  return "code block"
}`}
                    </pre>
                  </div>
                  <div className="lg:w-2/3">
                    <code className="bg-muted text-muted-foreground px-3 py-1 rounded text-sm">
                      bg-muted text-muted-foreground p-4 rounded font-mono
                      text-sm
                    </code>
                    <p className="text-muted-foreground text-sm mt-2">
                      Use for code blocks, configuration examples, JSON
                      snippets.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Colors */}
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-8">
                Text Colors
              </h3>
              <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="lg:w-1/3">
                    <p className="text-foreground text-lg">
                      Primary text content using foreground color for maximum
                      readability and contrast.
                    </p>
                  </div>
                  <div className="lg:w-2/3">
                    <code className="bg-muted text-muted-foreground px-3 py-1 rounded text-sm">
                      text-foreground
                    </code>
                    <p className="text-muted-foreground text-sm mt-2">
                      Default text color for headings, body text, and primary
                      content. High contrast against background.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="lg:w-1/3">
                    <p className="text-muted-foreground text-lg">
                      Secondary text content with reduced emphasis for
                      supporting information.
                    </p>
                  </div>
                  <div className="lg:w-2/3">
                    <code className="bg-muted text-muted-foreground px-3 py-1 rounded text-sm">
                      text-muted-foreground
                    </code>
                    <p className="text-muted-foreground text-sm mt-2">
                      Use for descriptions, captions, helper text, meta
                      information. Lower contrast but still readable.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="lg:w-1/3">
                    <p className="text-primary text-lg">
                      Primary brand color text for links, CTAs, and important
                      accents.
                    </p>
                  </div>
                  <div className="lg:w-2/3">
                    <code className="bg-muted text-muted-foreground px-3 py-1 rounded text-sm">
                      text-primary
                    </code>
                    <p className="text-muted-foreground text-sm mt-2">
                      Use for links, call-to-action text, brand accents,
                      interactive elements. Pairs with hover:text-primary/80.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="lg:w-1/3">
                    <p className="text-secondary-foreground text-lg">
                      Secondary color text for subtle emphasis and variety.
                    </p>
                  </div>
                  <div className="lg:w-2/3">
                    <code className="bg-muted text-muted-foreground px-3 py-1 rounded text-sm">
                      text-secondary-foreground
                    </code>
                    <p className="text-muted-foreground text-sm mt-2">
                      Use for secondary navigation, alternative text styling,
                      subtle emphasis.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="lg:w-1/3">
                    <p className="text-accent text-lg">
                      Accent color text for highlights and special call-outs.
                    </p>
                  </div>
                  <div className="lg:w-2/3">
                    <code className="bg-muted text-muted-foreground px-3 py-1 rounded text-sm">
                      text-accent
                    </code>
                    <p className="text-muted-foreground text-sm mt-2">
                      Use for special highlights, success states, featured
                      content, accent elements.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="lg:w-1/3">
                    <p className="text-destructive text-lg">
                      Destructive color text for errors, warnings, and dangerous
                      actions.
                    </p>
                  </div>
                  <div className="lg:w-2/3">
                    <code className="bg-muted text-muted-foreground px-3 py-1 rounded text-sm">
                      text-destructive
                    </code>
                    <p className="text-muted-foreground text-sm mt-2">
                      Use for error messages, validation errors, delete actions,
                      critical warnings.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="lg:w-1/3">
                    <div className="bg-card p-4 rounded-lg border">
                      <p className="text-card-foreground text-lg">
                        Card content text that adapts to card backgrounds.
                      </p>
                    </div>
                  </div>
                  <div className="lg:w-2/3">
                    <code className="bg-muted text-muted-foreground px-3 py-1 rounded text-sm">
                      text-card-foreground
                    </code>
                    <p className="text-muted-foreground text-sm mt-2">
                      Use inside cards, panels, and containers. Automatically
                      contrasts with card backgrounds.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="lg:w-1/3">
                    <div className="bg-popover p-4 rounded-lg border shadow-lg">
                      <p className="text-popover-foreground text-lg">
                        Popover text with optimal contrast.
                      </p>
                    </div>
                  </div>
                  <div className="lg:w-2/3">
                    <code className="bg-muted text-muted-foreground px-3 py-1 rounded text-sm">
                      text-popover-foreground
                    </code>
                    <p className="text-muted-foreground text-sm mt-2">
                      Use in popovers, dropdowns, tooltips, and overlay content
                      for proper contrast.
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Text Color Examples */}
              <div className="mt-12">
                <h4 className="text-xl font-semibold text-foreground mb-6">
                  Interactive Text States
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="font-medium text-foreground">
                      Hover States
                    </h5>
                    <div className="space-y-2">
                      <p className="text-primary hover:text-primary/80 cursor-pointer transition-colors">
                        Primary hover effect (80% opacity)
                      </p>
                      <p className="text-accent hover:text-accent/80 cursor-pointer transition-colors">
                        Accent hover effect (80% opacity)
                      </p>
                      <p className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                        Muted to foreground hover
                      </p>
                      <p className="text-destructive hover:text-destructive/80 cursor-pointer transition-colors">
                        Destructive hover effect
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="font-medium text-foreground">
                      State Combinations
                    </h5>
                    <div className="space-y-2">
                      <p className="text-primary/60">
                        Primary with 60% opacity
                      </p>
                      <p className="text-muted-foreground/80">
                        Muted foreground with 80% opacity
                      </p>
                      <p className="text-accent/90">Accent with 90% opacity</p>
                      <p className="text-foreground/50">
                        Foreground with 50% opacity (disabled state)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background + Text Combinations */}
              <div className="mt-12">
                <h4 className="text-xl font-semibold text-foreground mb-6">
                  Background + Text Combinations
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-primary text-primary-foreground p-4 rounded-lg">
                    <p className="font-medium">
                      bg-primary + text-primary-foreground
                    </p>
                    <p className="text-sm opacity-90">
                      High contrast combination for buttons and important
                      content
                    </p>
                  </div>

                  <div className="bg-secondary text-secondary-foreground p-4 rounded-lg">
                    <p className="font-medium">
                      bg-secondary + text-secondary-foreground
                    </p>
                    <p className="text-sm opacity-90">
                      Subtle combination for secondary actions
                    </p>
                  </div>

                  <div className="bg-accent text-accent-foreground p-4 rounded-lg">
                    <p className="font-medium">
                      bg-accent + text-accent-foreground
                    </p>
                    <p className="text-sm opacity-90">
                      Eye-catching combination for highlights
                    </p>
                  </div>

                  <div className="bg-destructive text-destructive-foreground p-4 rounded-lg">
                    <p className="font-medium">
                      bg-destructive + text-destructive-foreground
                    </p>
                    <p className="text-sm opacity-90">
                      High contrast for error states and warnings
                    </p>
                  </div>

                  <div className="bg-muted text-muted-foreground p-4 rounded-lg">
                    <p className="font-medium">
                      bg-muted + text-muted-foreground
                    </p>
                    <p className="text-sm">
                      Subtle combination for less important content
                    </p>
                  </div>

                  <div className="bg-card text-card-foreground border p-4 rounded-lg">
                    <p className="font-medium">
                      bg-card + text-card-foreground
                    </p>
                    <p className="text-sm opacity-90">
                      Standard card styling with proper contrast
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>Typography Guidelines</CardTitle>
                <CardDescription>
                  Best practices for using typography in your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium mb-3 text-foreground">
                      Color Usage
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          text-foreground
                        </code>{" "}
                        - Primary text, headings
                      </li>
                      <li>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          text-muted-foreground
                        </code>{" "}
                        - Secondary text, descriptions
                      </li>
                      <li>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          text-primary
                        </code>{" "}
                        - Links, CTAs, accents
                      </li>
                      <li>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          text-destructive
                        </code>{" "}
                        - Errors, warnings
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 text-foreground">
                      Font Weights
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          font-bold
                        </code>{" "}
                        - H1, H2 only
                      </li>
                      <li>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          font-semibold
                        </code>{" "}
                        - H3, H4, important text
                      </li>
                      <li>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          font-medium
                        </code>{" "}
                        - H5, button text, labels
                      </li>
                      <li>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          font-normal
                        </code>{" "}
                        - Body text (default)
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Component Showcase */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Component Gallery
            </h2>
            <p className="text-muted-foreground text-lg">
              See your theme in action with real components
            </p>
          </div>

          {/* Button Variants */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
              Buttons
            </h3>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button className="px-6 py-3">Primary Button</Button>
              <Button variant="secondary" className="px-6 py-3">
                Secondary Button
              </Button>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 px-6 py-3">
                Accent Button
              </Button>
              <Button variant="outline" className="px-6 py-3">
                Outline Button
              </Button>
              <Button variant="destructive" className="px-6 py-3">
                Destructive Button
              </Button>
            </div>
          </div>

          {/* Card Variations */}
          <div className="space-y-16">
            {/* Basic Cards */}
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-8">
                Basic Card Layouts
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Standard Card */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <div className="w-6 h-6 bg-primary rounded"></div>
                    </div>
                    <CardTitle className="text-lg">Standard Card</CardTitle>
                    <CardDescription>
                      Default card with header, content, and proper spacing.
                      Uses bg-card and text-card-foreground.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      This demonstrates the basic card structure with
                      CardHeader, CardTitle, CardDescription, and CardContent.
                    </p>
                    <Button variant="outline" size="sm">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>

                {/* Card with Footer */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Card with Footer</CardTitle>
                    <CardDescription>
                      Demonstrates using CardFooter for actions and metadata.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Content area with proper spacing. Footer contains actions
                      or additional information.
                    </p>
                  </CardContent>
                </Card>

                {/* Minimal Card */}
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 bg-accent rounded-full"></div>
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground mb-2">
                      Minimal Layout
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Custom padding without CardHeader/CardContent structure.
                    </p>
                    <Button variant="secondary" size="sm">
                      Get Started
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

            {/* Background Variations */}
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-8">
                Background Variations
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Primary Background */}
                <Card className="bg-primary text-primary-foreground hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg text-primary-foreground">
                      Primary Background
                    </CardTitle>
                    <CardDescription className="text-primary-foreground/80">
                      Using bg-primary with text-primary-foreground for high
                      contrast.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-primary-foreground/90 mb-4">
                      Perfect for important announcements, featured content, or
                      primary CTAs.
                    </p>
                    <Button variant="secondary" size="sm">
                      Action
                    </Button>
                  </CardContent>
                </Card>

                {/* Secondary Background */}
                <Card className="bg-secondary text-secondary-foreground hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Secondary Background
                    </CardTitle>
                    <CardDescription className="text-secondary-foreground/80">
                      Subtle bg-secondary with text-secondary-foreground.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-secondary-foreground/90 mb-4">
                      Great for less prominent content that still needs visual
                      separation.
                    </p>
                    <Button size="sm">Learn More</Button>
                  </CardContent>
                </Card>

                {/* Accent Background */}
                <Card className="bg-accent text-accent-foreground hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg text-accent-foreground">
                      Accent Background
                    </CardTitle>
                    <CardDescription className="text-accent-foreground/80">
                      Eye-catching bg-accent with text-accent-foreground.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-accent-foreground/90 mb-4">
                      Use for highlights, success states, or special promotions.
                    </p>
                    <Button
                      variant="outline"
                      className="border-accent-foreground text-accent-foreground hover:bg-accent-foreground hover:text-accent"
                      size="sm"
                    >
                      Highlight
                    </Button>
                  </CardContent>
                </Card>

                {/* Muted Background */}
                <Card className="bg-muted text-muted-foreground hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">
                      Muted Background
                    </CardTitle>
                    <CardDescription>
                      Subtle bg-muted background for secondary content.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">
                      Perfect for sidebars, secondary information, or disabled
                      states.
                    </p>
                    <Button variant="outline" size="sm">
                      Secondary
                    </Button>
                  </CardContent>
                </Card>

                {/* Gradient Background */}
                <Card className="gradient-cta text-primary-foreground hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg text-primary-foreground">
                      Gradient Background
                    </CardTitle>
                    <CardDescription className="text-primary-foreground/80">
                      Using custom gradient-cta class from globals.css.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-primary-foreground/90 mb-4">
                      Eye-catching gradient for premium features or special
                      offers.
                    </p>
                    <Button
                      variant="outline"
                      className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                      size="sm"
                    >
                      Premium
                    </Button>
                  </CardContent>
                </Card>

                {/* Destructive Background */}
                <Card className="bg-destructive text-destructive-foreground hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg text-destructive-foreground">
                      Destructive Background
                    </CardTitle>
                    <CardDescription className="text-destructive-foreground/80">
                      bg-destructive for warnings or error states.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-destructive-foreground/90 mb-4">
                      Use sparingly for critical warnings or error messages.
                    </p>
                    <Button
                      variant="outline"
                      className="border-destructive-foreground text-destructive-foreground hover:bg-destructive-foreground hover:text-destructive"
                      size="sm"
                    >
                      Danger
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Functional Examples */}
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-8">
                Functional Components
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Stats Card */}
                <Card className="bg-gradient-to-br from-primary to-accent text-primary-foreground hover:shadow-xl transition-all hover:scale-105">
                  <CardHeader>
                    <CardTitle className="text-lg text-primary-foreground">
                      Usage Statistics
                    </CardTitle>
                    <CardDescription className="text-primary-foreground/80">
                      Real-time metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="opacity-90">Active Users</span>
                        <span className="font-semibold">12.4k</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-90">Total Sessions</span>
                        <span className="font-semibold">84.2k</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-90">Conversion Rate</span>
                        <span className="font-semibold">3.7%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Form Card */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Form</CardTitle>
                    <CardDescription>
                      Get in touch with our team
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Input placeholder="Your name" />
                      <Input type="email" placeholder="Email address" />
                      <textarea
                        className="w-full bg-input border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all h-20 resize-none text-sm"
                        placeholder="Your message"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Profile Card */}
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-primary rounded-full"></div>
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          Sarah Johnson
                        </CardTitle>
                        <CardDescription>Product Designer</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      "This design system makes it incredibly easy to build
                      consistent, beautiful interfaces."
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Follow
                      </Button>
                      <Button variant="ghost" size="sm">
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Notification Card */}
                <Card className="bg-accent/10 border-accent/20 hover:shadow-lg hover:bg-accent/15 transition-all">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <div className="w-4 h-4 bg-accent-foreground rounded-full"></div>
                      </div>
                      <div>
                        <CardTitle className="text-base text-accent">
                          New Feature Available
                        </CardTitle>
                        <CardDescription>
                          Dark mode is now supported across all components
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                      size="sm"
                    >
                      Try It Now
                    </Button>
                  </CardContent>
                </Card>

                {/* Pricing Card */}
                <Card className="relative overflow-hidden hover:shadow-xl transition-all hover:scale-105 cursor-pointer">
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                    Popular
                  </div>
                  <CardHeader className="pt-8">
                    <CardTitle className="text-xl">Pro Plan</CardTitle>
                    <CardDescription>Perfect for growing teams</CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-foreground">
                        $29
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-accent-foreground rounded-full"></div>
                        </div>
                        Unlimited projects
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-accent-foreground rounded-full"></div>
                        </div>
                        Advanced analytics
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-accent-foreground rounded-full"></div>
                        </div>
                        Priority support
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Dashboard Widget */}
                <Card className="bg-secondary hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Revenue</CardTitle>
                      <span className="text-xs text-accent font-medium bg-accent/10 px-2 py-1 rounded">
                        +12%
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground mb-2">
                      $24,567
                    </div>
                    <p className="text-xs text-muted-foreground">
                      vs last month
                    </p>
                    <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Usage Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>Card Usage Guidelines</CardTitle>
                <CardDescription>
                  Best practices for using cards and backgrounds in your
                  application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium mb-3 text-foreground">
                      Background Colors
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          bg-card
                        </code>{" "}
                        - Default card background
                      </li>
                      <li>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          bg-primary
                        </code>{" "}
                        - Important content, CTAs
                      </li>
                      <li>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          bg-secondary
                        </code>{" "}
                        - Subtle differentiation
                      </li>
                      <li>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          bg-accent
                        </code>{" "}
                        - Highlights, success states
                      </li>
                      <li>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          bg-muted
                        </code>{" "}
                        - Secondary information
                      </li>
                      <li>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          bg-destructive
                        </code>{" "}
                        - Warnings, errors
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 text-foreground">
                      Card Structure
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          CardHeader
                        </code>{" "}
                        - Title, description, actions
                      </li>
                      <li>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          CardContent
                        </code>{" "}
                        - Main content area
                      </li>
                      <li>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          CardFooter
                        </code>{" "}
                        - Actions, metadata
                      </li>
                      <li>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          hover:shadow-lg
                        </code>{" "}
                        - Interactive feedback
                      </li>
                      <li>
                        <code className="bg-muted px-2 py-1 rounded text-xs">
                          transition-shadow
                        </code>{" "}
                        - Smooth animations
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Usage Examples
            </h2>
            <p className="text-muted-foreground text-lg">
              Copy and use these semantic color classes in your components
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Semantic Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm font-mono">
                  <div className="bg-muted p-2 rounded text-muted-foreground">
                    bg-primary text-primary-foreground
                  </div>
                  <div className="bg-muted p-2 rounded text-muted-foreground">
                    bg-secondary text-secondary-foreground
                  </div>
                  <div className="bg-muted p-2 rounded text-muted-foreground">
                    bg-accent text-accent-foreground
                  </div>
                  <div className="bg-muted p-2 rounded text-muted-foreground">
                    bg-card text-card-foreground
                  </div>
                  <div className="bg-muted p-2 rounded text-muted-foreground">
                    border-border
                  </div>
                  <div className="bg-muted p-2 rounded text-muted-foreground">
                    ring-ring
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">CSS Variables</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm font-mono">
                  <div className="bg-muted p-2 rounded text-muted-foreground">
                    hsl(var(--primary))
                  </div>
                  <div className="bg-muted p-2 rounded text-muted-foreground">
                    hsl(var(--accent))
                  </div>
                  <div className="bg-muted p-2 rounded text-muted-foreground">
                    hsl(var(--chart-1))
                  </div>
                  <div className="bg-muted p-2 rounded text-muted-foreground">
                    var(--radius)
                  </div>
                  <div className="bg-muted p-2 rounded text-muted-foreground">
                    var(--border)
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 gradient-cta">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-4">
            Ready to Build?
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-8">
            Start building beautiful interfaces with this carefully crafted
            Tailwind CSS v4 theme.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8 py-4 text-lg font-semibold">
              Download Theme
            </Button>
            <Button
              variant="outline"
              className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 py-4 text-lg font-semibold"
            >
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold text-foreground mb-4 md:mb-0">
              Template Project
            </div>
            <div className="text-muted-foreground text-sm">
              Built with Tailwind CSS v4 • Powered by @theme directive • Dark
              mode included
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
