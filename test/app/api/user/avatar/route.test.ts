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

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/logging", () => ({
  getLogger: vi.fn(() => ({
    error: vi.fn(),
  })),
}));

vi.mock("@/lib/rate-limit", () => ({
  withRateLimit: vi.fn((request, handler) => handler()),
}));

// Import after mocks are set up
import { GET, PATCH } from "../../../../../src/app/api/user/avatar/route";

describe("/api/user/avatar", () => {
  let getServerSession: ReturnType<typeof vi.fn>;
  let prisma: DeepMockProxy<PrismaClient>;

  const mockUser = {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "user-1_123456_avatar.jpg",
    role: "USER" as const,
    password: null,
    emailVerified: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    // Get mocked modules
    const authModule = await import("next-auth");
    const prismaModule = await import("@/lib/prisma");

    getServerSession = vi.mocked(authModule.getServerSession);
    prisma = vi.mocked(prismaModule.prisma) as DeepMockProxy<PrismaClient>;
  });

  describe("GET /api/user/avatar", () => {
    it("should return user avatar data for authenticated user", async () => {
      // Arrange
      getServerSession.mockResolvedValue({
        user: { id: "user-1" },
      });
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const request = createMockRequest("/api/user/avatar");

      // Act
      const response = await GET(request);
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toMatchObject({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        avatar: mockUser.avatar,
      });
    });

    it("should return 401 for unauthenticated user", async () => {
      // Arrange
      getServerSession.mockResolvedValue(null);
      const request = createMockRequest("/api/user/avatar");

      // Act
      const response = await GET(request);
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Authentication required");
    });

    it("should return 404 when user not found", async () => {
      // Arrange
      getServerSession.mockResolvedValue({
        user: { id: "user-1" },
      });
      prisma.user.findUnique.mockResolvedValue(null);

      const request = createMockRequest("/api/user/avatar");

      // Act
      const response = await GET(request);
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("User not found");
    });
  });

  describe("PATCH /api/user/avatar", () => {
    it("should update user avatar successfully", async () => {
      // Arrange
      const newAvatarPath = "user-1_789012_newavatar.jpg";
      const updatedUser = { ...mockUser, avatar: newAvatarPath };

      getServerSession.mockResolvedValue({
        user: { id: "user-1" },
      });
      prisma.user.update.mockResolvedValue(updatedUser);

      const request = createMockRequest("/api/user/avatar", {
        method: "PATCH",
        body: { avatarPath: newAvatarPath },
      });

      // Act
      const response = await PATCH(request);
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.avatar).toBe(newAvatarPath);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: { avatar: newAvatarPath },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      });
    });

    it("should return 401 for unauthenticated user", async () => {
      // Arrange
      getServerSession.mockResolvedValue(null);
      const request = createMockRequest("/api/user/avatar", {
        method: "PATCH",
        body: { avatarPath: "user-1_123456_avatar.jpg" },
      });

      // Act
      const response = await PATCH(request);
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Authentication required");
    });

    it("should return 400 for invalid avatar path type", async () => {
      // Arrange
      getServerSession.mockResolvedValue({
        user: { id: "user-1" },
      });
      const request = createMockRequest("/api/user/avatar", {
        method: "PATCH",
        body: { avatarPath: 123 }, // Invalid type
      });

      // Act
      const response = await PATCH(request);
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Avatar path must be a string");
    });

    it("should return 400 for avatar path that doesn't belong to user", async () => {
      // Arrange
      getServerSession.mockResolvedValue({
        user: { id: "user-1" },
      });
      const request = createMockRequest("/api/user/avatar", {
        method: "PATCH",
        body: { avatarPath: "different-user_123456_avatar.jpg" },
      });

      // Act
      const response = await PATCH(request);
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("You can only set your own avatar");
    });
  });
});
