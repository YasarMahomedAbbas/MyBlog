import { Role } from "@prisma/client";

export { Role };

export const ROLES = {
  USER: Role.USER,
  MODERATOR: Role.MODERATOR,
  ADMIN: Role.ADMIN,
} as const;

export type RoleType = keyof typeof ROLES;

// Helper functions for role checking
export function isAdmin(role: Role): boolean {
  return role === Role.ADMIN;
}

export function isModerator(role: Role): boolean {
  return role === Role.MODERATOR;
}

export function isModeratorOrAdmin(role: Role): boolean {
  return role === Role.MODERATOR || role === Role.ADMIN;
}

export function hasPermission(userRole: Role, requiredRole: Role): boolean {
  const hierarchy = {
    [Role.USER]: 1,
    [Role.MODERATOR]: 2,
    [Role.ADMIN]: 3,
  };

  return hierarchy[userRole] >= hierarchy[requiredRole];
}

// Role display names
export const ROLE_LABELS = {
  [Role.USER]: "User",
  [Role.MODERATOR]: "Moderator",
  [Role.ADMIN]: "Admin",
} as const;
