import { AuthNavbar } from "@/components/auth-navbar";
import { PublicFooter } from "@/components/public-footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthNavbar />
      {children}
      <PublicFooter />
    </>
  );
}
