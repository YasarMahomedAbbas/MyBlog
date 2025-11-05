import { Role } from "@/types/roles";

export const mockUser = {
  id: "user-1",
  email: "john@example.com",
  name: "John Doe",
  role: Role.USER,
  avatar: null,
  emailVerified: new Date("2024-01-15T10:00:00Z"),
  createdAt: new Date("2024-01-01T10:00:00Z"),
  updatedAt: new Date("2024-01-15T10:00:00Z"),
  password: null, // Never expose password in responses
};

export const mockAdminUser = {
  id: "admin-1",
  email: "admin@example.com",
  name: "Admin User",
  role: Role.ADMIN,
  avatar: null,
  emailVerified: new Date("2024-01-01T10:00:00Z"),
  createdAt: new Date("2024-01-01T10:00:00Z"),
  updatedAt: new Date("2024-01-01T10:00:00Z"),
  password: null,
};

export const mockModeratorUser = {
  id: "mod-1",
  email: "moderator@example.com",
  name: "Moderator User",
  role: Role.MODERATOR,
  avatar: null,
  emailVerified: new Date("2024-01-01T10:00:00Z"),
  createdAt: new Date("2024-01-01T10:00:00Z"),
  updatedAt: new Date("2024-01-01T10:00:00Z"),
  password: null,
};

export const mockUnverifiedUser = {
  id: "user-2",
  email: "unverified@example.com",
  name: "Unverified User",
  role: Role.USER,
  avatar: null,
  emailVerified: null,
  createdAt: new Date("2024-01-10T10:00:00Z"),
  updatedAt: new Date("2024-01-10T10:00:00Z"),
  password: null,
};

export const mockUsers = [
  mockUser,
  mockAdminUser,
  mockModeratorUser,
  mockUnverifiedUser,
];

export const mockUsersResponse = {
  users: mockUsers,
  pagination: {
    page: 1,
    limit: 10,
    total: 4,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  },
};

// Factory function to create users with custom data
export function createMockUser(overrides: Partial<typeof mockUser> = {}) {
  return {
    ...mockUser,
    ...overrides,
    id: overrides.id || `user-${Date.now()}`,
  };
}

// Factory function to create multiple mock users
export function createMockUsers(
  count: number,
  baseOverrides: Partial<typeof mockUser> = {}
) {
  return Array.from({ length: count }, (_, index) =>
    createMockUser({
      ...baseOverrides,
      id: `user-${index + 1}`,
      email: `user${index + 1}@example.com`,
      name: `User ${index + 1}`,
    })
  );
}
