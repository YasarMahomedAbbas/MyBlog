/**
 * @vitest-environment node
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createMockRequest,
  parseResponse,
} from "../../../../helpers/api-test-helpers";
import type { DeepMockProxy } from "vitest-mock-extended";
import type { PrismaClient } from "@prisma/client";

// Mock dependencies
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/logging", () => ({
  getLogger: vi.fn(() => ({
    error: vi.fn(),
  })),
}));

// Import after mocks are set up
import { GET, PATCH } from "../../../../../src/app/api/user/profile/route";

describe("/api/user/profile", () => {
  let getServerSession: ReturnType<typeof vi.fn>;
  let prisma: DeepMockProxy<PrismaClient>;

  const mockUser = {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    avatar: null,
    role: "USER" as const,
    password: null,
    emailVerified: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    // Get mocked modules
    const authModule = await import("next-auth/next");
    const prismaModule = await import("@/lib/prisma");

    getServerSession = vi.mocked(authModule.getServerSession);
    prisma = vi.mocked(prismaModule.prisma) as DeepMockProxy<PrismaClient>;
  });

  describe("GET /api/user/profile", () => {
    it("should return user profile for authenticated user", async () => {
      // Arrange
      getServerSession.mockResolvedValue({
        user: { id: "user-1" },
      });
      prisma.user.findUnique.mockResolvedValue(mockUser);

      // Act
      const response = await GET();
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toMatchObject({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
      });
    });

    it("should return 401 for unauthenticated user", async () => {
      // Arrange
      getServerSession.mockResolvedValue(null);

      // Act
      const response = await GET();
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Authentication required");
    });

    it("should return 400 when user not found", async () => {
      // Arrange
      getServerSession.mockResolvedValue({
        user: { id: "user-1" },
      });
      prisma.user.findUnique.mockResolvedValue(null);

      // Act
      const response = await GET();
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("User not found");
    });
  });

  describe("PATCH /api/user/profile", () => {
    it("should update user profile successfully", async () => {
      // Arrange
      const updatedUser = { ...mockUser, name: "Updated Name" };
      getServerSession.mockResolvedValue({
        user: { id: "user-1" },
      });
      prisma.user.update.mockResolvedValue(updatedUser);

      const request = createMockRequest("/api/user/profile", {
        method: "PATCH",
        body: { name: "Updated Name" },
      });

      // Act
      const response = await PATCH(request);
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe("Updated Name");
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: { name: "Updated Name" },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          updatedAt: true,
        },
      });
    });

    it("should return 401 for unauthenticated user", async () => {
      // Arrange
      getServerSession.mockResolvedValue(null);
      const request = createMockRequest("/api/user/profile", {
        method: "PATCH",
        body: { name: "New Name" },
      });

      // Act
      const response = await PATCH(request);
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Authentication required");
    });

    it("should return 400 for missing name", async () => {
      // Arrange
      getServerSession.mockResolvedValue({
        user: { id: "user-1" },
      });
      const request = createMockRequest("/api/user/profile", {
        method: "PATCH",
        body: { name: "" },
      });

      // Act
      const response = await PATCH(request);
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Name is required");
    });
  });
});
