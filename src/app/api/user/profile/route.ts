import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
  internalServerErrorResponse,
} from "@/lib/operation-result";
import { getLogger } from "@/lib/logging";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return unauthorizedResponse("Authentication required");
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return validationErrorResponse("User not found");
    }

    return successResponse(user);
  } catch (error) {
    const logger = await getLogger("api/user/profile");
    logger.error("Error fetching user profile", { err: error, method: "GET" });
    return internalServerErrorResponse("Failed to fetch user profile");
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return unauthorizedResponse("Authentication required");
    }

    const body = await req.json();
    const { name } = body;

    // Validate input
    if (!name || name.trim().length === 0) {
      return validationErrorResponse("Name is required");
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        updatedAt: true,
      },
    });

    const response = successResponse(
      updatedUser,
      "Profile updated successfully"
    );

    // Add cache control headers to ensure fresh session data
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );

    return response;
  } catch (error) {
    const logger = await getLogger("api/user/profile");
    logger.error("Error updating user profile", {
      err: error,
      method: "PATCH",
    });
    return internalServerErrorResponse("Failed to update user profile");
  }
}
