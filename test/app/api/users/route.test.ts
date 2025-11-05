/**
 * @vitest-environment node
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createMockRequest,
  parseResponse,
} from "../../../helpers/api-test-helpers";
import { mockUsers } from "../../../fixtures/users";
import type { DeepMockProxy } from "vitest-mock-extended";
import type { PrismaClient } from "@prisma/client";

// Mock dependencies
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/logging", () => ({
  getLogger: vi.fn(() => ({
    info: vi.fn(),
    error: vi.fn(),
  })),
}));

// Import after mocks are set up
import { GET } from "../../../../src/app/api/users/route";

describe("/api/users", () => {
  let getServerSession: ReturnType<typeof vi.fn>;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Get mocked modules
    const authModule = await import("next-auth/next");
    const prismaModule = await import("@/lib/prisma");

    getServerSession = vi.mocked(authModule.getServerSession);
    prisma = vi.mocked(prismaModule.prisma) as DeepMockProxy<PrismaClient>;
  });

  describe("GET /api/users", () => {
    it("should return users list for admin", async () => {
      // Arrange
      getServerSession.mockResolvedValue({
        user: { id: "admin-1", role: "ADMIN" },
      });
      prisma.user.findMany.mockResolvedValue(mockUsers);
      prisma.user.count.mockResolvedValue(4);

      const request = createMockRequest("/api/users");

      // Act
      const response = await GET(request);
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.users).toHaveLength(4);
      expect(data.data.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 4,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });
    });

    it("should return 401 for unauthenticated user", async () => {
      // Arrange
      getServerSession.mockResolvedValue(null);
      const request = createMockRequest("/api/users");

      // Act
      const response = await GET(request);
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 403 for non-admin user", async () => {
      // Arrange
      getServerSession.mockResolvedValue({
        user: { id: "user-1", role: "USER" },
      });
      const request = createMockRequest("/api/users");

      // Act
      const response = await GET(request);
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Admin access required");
    });

    it("should handle search parameter", async () => {
      // Arrange
      getServerSession.mockResolvedValue({
        user: { id: "admin-1", role: "ADMIN" },
      });
      const searchedUsers = [mockUsers[0]];
      prisma.user.findMany.mockResolvedValue(searchedUsers);
      prisma.user.count.mockResolvedValue(1);

      const request = createMockRequest("/api/users", {
        searchParams: { search: "john" },
      });

      // Act
      const response = await GET(request);
      await parseResponse(response);

      // Assert
      expect(response.status).toBe(200);
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: "john", mode: "insensitive" } },
            { email: { contains: "john", mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatar: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
        skip: 0,
        take: 10,
        orderBy: { createdAt: "desc" },
      });
    });

    it("should return 500 on database error", async () => {
      // Arrange
      getServerSession.mockResolvedValue({
        user: { id: "admin-1", role: "ADMIN" },
      });
      prisma.user.findMany.mockRejectedValue(
        new Error("Database connection failed")
      );

      const request = createMockRequest("/api/users");

      // Act
      const response = await GET(request);
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Internal server error");
    });
  });
});
