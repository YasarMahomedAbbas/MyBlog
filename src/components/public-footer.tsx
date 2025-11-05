import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const footerLinks = [
  { name: "Blog", href: "/blog" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms of Service", href: "/terms-of-service" },
  { name: "Contact Us", href: "/contact-us" },
];

export function PublicFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="max-w-6xl mx-auto py-16 px-8">
        <div className="grid grid-cols-1 md:grid-cols-4">
          {/* Brand Section */}
          <div className="md:col-span-3">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mr-2">
                <span className="text-secondary font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-xl text-foreground">AppName</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
              Building innovative solutions that empower businesses to achieve
              their goals with cutting-edge technology and industry expertise.
            </p>
            <div className="text-sm text-muted-foreground mb-3">
              © {new Date().getFullYear()} AppName. All rights reserved.
            </div>
            <ThemeToggle variant="simple" size="sm" excludeSystem={true} />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {footerLinks.map(link => (
                <li key={link.name}>
                  <Link
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    href={link.href as any}
                    className="text-muted-foreground hover:text-primary transition-colors block py-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
