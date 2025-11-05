/**
 * @vitest-environment node
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createMockRequest,
  createMockParams,
  parseResponse,
} from "../../../../helpers/api-test-helpers";
import { mockUser } from "../../../../fixtures/users";
import { Role } from "@/types/roles";
import type { DeepMockProxy } from "vitest-mock-extended";
import type { PrismaClient } from "@prisma/client";

// Mock dependencies
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
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
import { GET, PUT, DELETE } from "../../../../../src/app/api/users/[id]/route";

describe("/api/users/[id]", () => {
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

  describe("GET /api/users/[id]", () => {
    it("should allow user to view their own profile", async () => {
      // Arrange
      getServerSession.mockResolvedValue({
        user: { id: "user-1", role: "USER" },
      });
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const request = createMockRequest("/api/users/user-1");
      const params = createMockParams({ id: "user-1" });

      // Act
      const response = await GET(request, { params });
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.user).toMatchObject({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        avatar: mockUser.avatar,
        password: mockUser.password,
      });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "user-1" },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });

    it("should allow admin to view any user profile", async () => {
      // Arrange
      getServerSession.mockResolvedValue({
        user: { id: "admin-1", role: "ADMIN" },
      });
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const request = createMockRequest("/api/users/user-1");
      const params = createMockParams({ id: "user-1" });

      // Act
      const response = await GET(request, { params });
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.user).toMatchObject({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        avatar: mockUser.avatar,
        password: mockUser.password,
      });
    });

    it("should return 403 when user tries to view another user profile", async () => {
      // Arrange
      getServerSession.mockResolvedValue({
        user: { id: "user-1", role: "USER" },
      });

      const request = createMockRequest("/api/users/different-user-id");
      const params = createMockParams({ id: "different-user-id" });

      // Act
      const response = await GET(request, { params });
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Forbidden");
    });

    it("should return 404 when user not found", async () => {
      // Arrange
      getServerSession.mockResolvedValue({
        user: { id: "admin-1", role: "ADMIN" },
      });
      prisma.user.findUnique.mockResolvedValue(null);

      const request = createMockRequest("/api/users/nonexistent-id");
      const params = createMockParams({ id: "nonexistent-id" });

      // Act
      const response = await GET(request, { params });
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("User not found");
    });

    it("should return 401 for unauthenticated user", async () => {
      // Arrange
      getServerSession.mockResolvedValue(null);

      const request = createMockRequest("/api/users/user-1");
      const params = createMockParams({ id: "user-1" });

      // Act
      const response = await GET(request, { params });
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Unauthorized");
    });
  });

  describe("PUT /api/users/[id]", () => {
    it("should allow user to update their own profile", async () => {
      // Arrange
      getServerSession.mockResolvedValue({
        user: { id: "user-1", role: "USER" },
      });
      const updatedUser = { ...mockUser, name: "Updated Name" };
      prisma.user.update.mockResolvedValue(updatedUser);

      const request = createMockRequest("/api/users/user-1", {
        method: "PUT",
        body: { name: "Updated Name" },
      });
      const params = createMockParams({ id: "user-1" });

      // Act
      const response = await PUT(request, { params });
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.user.name).toBe("Updated Name");
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: { name: "Updated Name" },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          emailVerified: true,
          updatedAt: true,
        },
      });
    });

    it("should allow admin to update any user profile", async () => {
      // Arrange
      getServerSession.mockResolvedValue({
        user: { id: "admin-1", role: "ADMIN" },
      });
      const updatedUser = { ...mockUser, role: Role.MODERATOR };
      prisma.user.update.mockResolvedValue(updatedUser);

      const request = createMockRequest("/api/users/user-1", {
        method: "PUT",
        body: { role: Role.MODERATOR },
      });
      const params = createMockParams({ id: "user-1" });

      // Act
      const response = await PUT(request, { params });
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.user.role).toBe(Role.MODERATOR);
    });

    it("should prevent non-admin from changing roles", async () => {
      // Arrange
      getServerSession.mockResolvedValue({
        user: { id: "user-1", role: "USER" },
      });

      const request = createMockRequest("/api/users/user-1", {
        method: "PUT",
        body: { role: Role.ADMIN },
      });
      const params = createMockParams({ id: "user-1" });

      // Act
      const response = await PUT(request, { params });
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Admin access required to change roles");
    });

    it("should return 401 for unauthenticated user", async () => {
      // Arrange
      getServerSession.mockResolvedValue(null);

      const request = createMockRequest("/api/users/user-1", {
        method: "PUT",
        body: { name: "Hacked Name" },
      });
      const params = createMockParams({ id: "user-1" });

      // Act
      const response = await PUT(request, { params });
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Unauthorized");
    });
  });

  describe("DELETE /api/users/[id]", () => {
    it("should allow admin to delete users", async () => {
      // Arrange
      getServerSession.mockResolvedValue({
        user: { id: "admin-1", role: "ADMIN" },
      });
      prisma.user.delete.mockResolvedValue(mockUser);

      const request = createMockRequest("/api/users/user-1", {
        method: "DELETE",
      });
      const params = createMockParams({ id: "user-1" });

      // Act
      const response = await DELETE(request, { params });
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.deleted).toBe(true);
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: "user-1" },
      });
    });

    it("should return 403 for non-admin users", async () => {
      // Arrange
      getServerSession.mockResolvedValue({
        user: { id: "user-1", role: "USER" },
      });

      const request = createMockRequest("/api/users/some-user-id", {
        method: "DELETE",
      });
      const params = createMockParams({ id: "some-user-id" });

      // Act
      const response = await DELETE(request, { params });
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Admin access required");
    });

    it("should return 401 for unauthenticated user", async () => {
      // Arrange
      getServerSession.mockResolvedValue(null);

      const request = createMockRequest("/api/users/user-1", {
        method: "DELETE",
      });
      const params = createMockParams({ id: "user-1" });

      // Act
      const response = await DELETE(request, { params });
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Unauthorized");
    });
  });
});
