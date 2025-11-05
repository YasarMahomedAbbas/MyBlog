import { PublicNavbar } from "@/components/public-navbar";
import { PublicFooter } from "@/components/public-footer";
import { CTA } from "@/components/ui/cta";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />
      <main>{children}</main>
      <CTA
        title="Ready to Get Started?"
        description="Join thousands of satisfied customers and take your business to the next level with our powerful platform."
        buttonText="Start Your Journey"
        href="/auth/register"
        size="lg"
      />
      <PublicFooter />
    </div>
  );
}
