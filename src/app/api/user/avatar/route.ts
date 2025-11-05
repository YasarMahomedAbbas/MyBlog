import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  internalServerErrorResponse,
  validationErrorResponse,
  unauthorizedResponse,
} from "@/lib/operation-result";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withRateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { getLogger } from "@/lib/logging";

// Update user avatar
export async function PATCH(request: NextRequest) {
  return withRateLimit(
    request,
    async () => {
      try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
          return unauthorizedResponse("Authentication required");
        }

        const body = await request.json();
        const { avatarPath } = body;

        if (typeof avatarPath !== "string") {
          return validationErrorResponse("Avatar path must be a string");
        }

        // Validate that the avatar path belongs to the current user
        // Files are prefixed with user ID: {userId}_{timestamp}_{random}.{ext}
        if (!avatarPath.startsWith(session.user.id)) {
          return validationErrorResponse("You can only set your own avatar");
        }

        // Update user avatar in database
        const updatedUser = await prisma.user.update({
          where: { id: session.user.id },
          data: { avatar: avatarPath },
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        });

        const response = successResponse(
          updatedUser,
          "Avatar updated successfully"
        );

        // Add cache control headers to ensure fresh session data
        response.headers.set(
          "Cache-Control",
          "no-cache, no-store, must-revalidate"
        );

        return response;
      } catch (error) {
        const logger = await getLogger("api/user/avatar");
        logger.error("Avatar update server error", {
          err: error,
          method: "PATCH",
        });
        if (error instanceof Error) {
          return errorResponse("Failed to update avatar", 500, "UPDATE_ERROR", {
            details: error.message,
          });
        }
        return internalServerErrorResponse();
      }
    },
    false
  ); // false for general rate limiting
}

// Get user avatar
export async function GET(request: NextRequest) {
  return withRateLimit(
    request,
    async () => {
      try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
          return unauthorizedResponse("Authentication required");
        }

        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        });

        if (!user) {
          return errorResponse("User not found", 404, "USER_NOT_FOUND");
        }

        return successResponse(user, "User data retrieved successfully");
      } catch (error) {
        const logger = await getLogger("api/user/avatar");
        logger.error("Get user avatar server error", {
          err: error,
          method: "GET",
        });
        return internalServerErrorResponse();
      }
    },
    false
  ); // false for general rate limiting
}
