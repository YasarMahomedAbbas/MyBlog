import { vi } from "vitest";
import { Role } from "@/types/roles";

export const mockSession = {
  user: {
    id: "test-user-id",
    email: "test@example.com",
    name: "Test User",
    role: Role.USER,
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
};

export const mockAdminSession = {
  user: {
    id: "test-admin-id",
    email: "admin@example.com",
    name: "Test Admin",
    role: Role.ADMIN,
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

// Mock getServerSession
export const mockGetServerSession = vi.fn();

// Mock NextAuth
vi.mock("next-auth/next", () => ({
  getServerSession: mockGetServerSession,
}));

// Mock useSession hook for client components
vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: mockSession,
    status: "authenticated",
  }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));
