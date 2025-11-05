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
    userPreference: {
      findUnique: vi.fn(),
      create: vi.fn(),
      upsert: vi.fn(),
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
import { GET, PATCH } from "../../../../../src/app/api/user/theme/route";

describe("/api/user/theme", () => {
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

  describe("GET /api/user/theme", () => {
    it("should return existing user theme preference", async () => {
      // Arrange
      getServerSession.mockResolvedValue({
        user: { id: "user-1" },
      });
      prisma.userPreference.findUnique.mockResolvedValue({
        id: "pref-1",
        userId: "user-1",
        theme: "DARK" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Act
      const response = await GET();
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.theme).toBe("DARK");
    });

    it("should create default preference if none exists", async () => {
      // Arrange
      getServerSession.mockResolvedValue({
        user: { id: "user-1" },
      });
      prisma.userPreference.findUnique.mockResolvedValue(null);
      prisma.userPreference.create.mockResolvedValue({
        id: "pref-1",
        userId: "user-1",
        theme: "SYSTEM" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Act
      const response = await GET();
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.theme).toBe("SYSTEM");
      expect(prisma.userPreference.create).toHaveBeenCalledWith({
        data: {
          userId: "user-1",
          theme: "SYSTEM",
        },
        select: { theme: true },
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
  });

  describe("PATCH /api/user/theme", () => {
    it("should update theme preference successfully", async () => {
      // Arrange
      getServerSession.mockResolvedValue({
        user: { id: "user-1" },
      });
      prisma.userPreference.upsert.mockResolvedValue({
        id: "pref-1",
        userId: "user-1",
        theme: "LIGHT" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const request = createMockRequest("/api/user/theme", {
        method: "PATCH",
        body: { theme: "LIGHT" },
      });

      // Act
      const response = await PATCH(request);
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.theme).toBe("LIGHT");
      expect(prisma.userPreference.upsert).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        update: { theme: "LIGHT" },
        create: {
          userId: "user-1",
          theme: "LIGHT",
        },
        select: { theme: true },
      });
    });

    it("should return 401 for unauthenticated user", async () => {
      // Arrange
      getServerSession.mockResolvedValue(null);
      const request = createMockRequest("/api/user/theme", {
        method: "PATCH",
        body: { theme: "DARK" },
      });

      // Act
      const response = await PATCH(request);
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Authentication required");
    });

    it("should return 400 for invalid theme value", async () => {
      // Arrange
      getServerSession.mockResolvedValue({
        user: { id: "user-1" },
      });
      const request = createMockRequest("/api/user/theme", {
        method: "PATCH",
        body: { theme: "INVALID" },
      });

      // Act
      const response = await PATCH(request);
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe(
        "Invalid theme value. Must be LIGHT, DARK, or SYSTEM"
      );
    });

    it("should return 400 for missing theme", async () => {
      // Arrange
      getServerSession.mockResolvedValue({
        user: { id: "user-1" },
      });
      const request = createMockRequest("/api/user/theme", {
        method: "PATCH",
        body: {},
      });

      // Act
      const response = await PATCH(request);
      const data = await parseResponse(response);

      // Assert
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe(
        "Invalid theme value. Must be LIGHT, DARK, or SYSTEM"
      );
    });
  });
});
