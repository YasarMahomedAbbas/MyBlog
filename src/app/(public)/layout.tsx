import { PublicNavbar } from "@/components/public-navbar";
import { PublicFooter } from "@/components/public-footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />
      <main className="tech-grid-bg">{children}</main>
      <PublicFooter />
    </div>
  );
}
