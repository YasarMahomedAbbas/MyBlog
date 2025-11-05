import { vi } from "vitest";
import { prismaMock } from "../../__mocks__/prisma";

// Mock the prisma client module
vi.mock("@/lib/prisma", () => ({
  __esModule: true,
  prisma: prismaMock,
}));

export { prismaMock };
