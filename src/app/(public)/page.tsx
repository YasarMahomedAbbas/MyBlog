import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Star, Shield, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="gradient-hero min-h-screen flex items-center justify-center px-4 py-20 pt-32">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Build Amazing
            <span className="text-primary block">Applications</span>
            <span className="text-accent">Faster</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button size="lg" className="gap-2 text-lg px-8 py-3">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              View Demo
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">100K+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                Lightning Fast
              </h3>
              <p className="text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                Secure & Reliable
              </h3>
              <p className="text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                Easy to Use
              </h3>
              <p className="text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-16">
            Choose the plan that works best for you and your team.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Starter
              </h3>
              <div className="text-3xl font-bold text-primary mb-6">Free</div>
              <p className="text-muted-foreground mb-6">
                Perfect for getting started
              </p>
              <Button variant="outline" className="w-full">
                Get Started
              </Button>
            </Card>
            <Card className="p-8 hover:shadow-lg transition-shadow border-primary">
              <h3 className="text-xl font-bold text-foreground mb-4">Pro</h3>
              <div className="text-3xl font-bold text-primary mb-6">$29/mo</div>
              <p className="text-muted-foreground mb-6">
                For growing businesses
              </p>
              <Button className="w-full">Choose Pro</Button>
            </Card>
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Enterprise
              </h3>
              <div className="text-3xl font-bold text-primary mb-6">Custom</div>
              <p className="text-muted-foreground mb-6">
                For large organizations
              </p>
              <Button variant="outline" className="w-full">
                Contact Us
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            About Our Mission
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            We're dedicated to building innovative solutions that empower
            businesses to achieve their goals. Our team of experts combines
            cutting-edge technology with deep industry knowledge to deliver
            exceptional results.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">5+</div>
              <div className="text-muted-foreground">Years Experience</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">50+</div>
              <div className="text-muted-foreground">Team Members</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">1000+</div>
              <div className="text-muted-foreground">Projects Delivered</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-muted-foreground">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Get In Touch
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground mb-2">
                Email
              </div>
              <div className="text-muted-foreground">hello@appname.com</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground mb-2">
                Phone
              </div>
              <div className="text-muted-foreground">+1 (555) 123-4567</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground mb-2">
                Address
              </div>
              <div className="text-muted-foreground">
                123 Business Ave, City, State 12345
              </div>
            </div>
          </div>
          <Button size="lg" className="gap-2">
            Contact Us Today
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>
    </>
  );
}
