import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role, isAdmin } from "@/types/roles";
import { handlePrismaError, isRecordNotFoundError } from "@/lib/error-handler";
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  validationErrorResponse,
} from "@/lib/operation-result";
import { getLogger } from "@/lib/logging";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const logger = await getLogger("api/users/role");

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return unauthorizedResponse();
    }

    // Only admins can change roles
    if (!isAdmin(session.user.role as Role)) {
      return forbiddenResponse("Admin access required");
    }

    const { id } = await params;
    const body = await request.json();
    const { role } = body;

    if (!role) {
      return validationErrorResponse("Role is required");
    }

    if (!Object.values(Role).includes(role)) {
      return validationErrorResponse(
        `Invalid role. Must be one of: ${Object.values(Role).join(", ")}`
      );
    }

    // Prevent admin from changing their own role to non-admin
    if (session.user.id === id && role !== Role.ADMIN) {
      return validationErrorResponse(
        "Cannot remove admin role from your own account"
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
      return notFoundResponse("User not found");
    }

    if (user.role === role) {
      return successResponse({ user }, `User already has ${role} role`);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true,
      },
    });

    logger.info("User role updated", {
      targetUserId: id,
      targetUserEmail: user.email,
      oldRole: user.role,
      newRole: role,
      adminUserId: session.user.id,
      method: "PUT",
    });

    return successResponse(
      { user: updatedUser },
      `User role changed to ${role} successfully`
    );
  } catch (error) {
    logger.error("Error updating user role", {
      err: error,
      targetUserId: await params.then(p => p.id),
      adminUserId: await getServerSession(authOptions).then(s => s?.user?.id),
      method: "PUT",
    });

    if (isRecordNotFoundError(error)) {
      return notFoundResponse("User not found");
    }

    return handlePrismaError(error, logger);
  }
}
