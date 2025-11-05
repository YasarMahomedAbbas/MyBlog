import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role, isAdmin } from "@/types/roles";
import {
  handlePrismaError,
  isUniqueConstraintError,
  isRecordNotFoundError,
} from "@/lib/error-handler";
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  conflictResponse,
  validationErrorResponse,
} from "@/lib/operation-result";
import { getLogger } from "@/lib/logging";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const logger = await getLogger("api/users/[id]");
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    // Users can view their own profile, admins can view any profile
    if (session.user.id !== id && !isAdmin(session.user.role as Role)) {
      return forbiddenResponse();
    }

    const user = await prisma.user.findUnique({
      where: { id },
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

    if (!user) {
      return notFoundResponse("User not found");
    }

    return successResponse({ user });
  } catch (error) {
    logger.error("Error fetching user", {
      err: error,
      method: "GET",
    });
    return handlePrismaError(error, logger);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const logger = await getLogger("api/users/[id]");
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return unauthorizedResponse();
    }

    const { id } = await params;
    const body = await request.json();

    // Users can update their own profile, admins can update any profile
    if (session.user.id !== id && !isAdmin(session.user.role as Role)) {
      return forbiddenResponse();
    }

    // Validate input
    const { name, email, password, role } = body;

    // Only admins can change roles, and users cannot change their own role
    if (role !== undefined) {
      if (!isAdmin(session.user.role as Role)) {
        return forbiddenResponse("Admin access required to change roles");
      }

      if (!Object.values(Role).includes(role)) {
        return validationErrorResponse(
          `Invalid role. Must be one of: ${Object.values(Role).join(", ")}`
        );
      }
    }

    const updateData: Record<string, unknown> = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (email !== undefined) {
      // Check if email is already taken by another user
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser && existingUser.id !== id) {
        return conflictResponse("Email already in use");
      }

      updateData.email = email;
      updateData.emailVerified = null; // Reset email verification
    }

    if (password !== undefined && password !== "") {
      const hashedPassword = await bcrypt.hash(password, 12);
      updateData.password = hashedPassword;
    }

    if (role !== undefined) {
      updateData.role = role;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        updatedAt: true,
      },
    });

    return successResponse({ user: updatedUser }, "User updated successfully");
  } catch (error) {
    // Handle specific cases with custom messages
    if (isUniqueConstraintError(error)) {
      return conflictResponse("Email already exists");
    }

    if (isRecordNotFoundError(error)) {
      return notFoundResponse("User not found");
    }

    // Use generic handler for other Prisma errors
    return handlePrismaError(error, logger);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const logger = await getLogger("api/users/[id]");
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return unauthorizedResponse();
    }

    // Only admins can delete users
    if (!isAdmin(session.user.role as Role)) {
      return forbiddenResponse("Admin access required");
    }

    const { id } = await params;

    // Prevent admin from deleting themselves
    if (session.user.id === id) {
      return validationErrorResponse("Cannot delete your own account");
    }

    await prisma.user.delete({
      where: { id },
    });

    return successResponse({ deleted: true }, "User deleted successfully");
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      return notFoundResponse("User not found");
    }

    return handlePrismaError(error, logger);
  }
}
