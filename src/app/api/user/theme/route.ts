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

    const userPreference = await prisma.userPreference.findUnique({
      where: { userId: session.user.id },
      select: { theme: true },
    });

    if (!userPreference) {
      // Create default preferences if they don't exist
      const newPreference = await prisma.userPreference.create({
        data: {
          userId: session.user.id,
          theme: "SYSTEM",
        },
        select: { theme: true },
      });
      return successResponse({ theme: newPreference.theme });
    }

    return successResponse({ theme: userPreference.theme });
  } catch (error) {
    const logger = await getLogger("api/user/theme");
    logger.error("Error fetching user theme", { err: error, method: "GET" });
    return internalServerErrorResponse("Failed to fetch theme preference");
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return unauthorizedResponse("Authentication required");
    }

    const body = await req.json();
    const { theme } = body;

    // Validate theme value
    if (!theme || !["LIGHT", "DARK", "SYSTEM"].includes(theme)) {
      return validationErrorResponse(
        "Invalid theme value. Must be LIGHT, DARK, or SYSTEM"
      );
    }

    const updatedPreference = await prisma.userPreference.upsert({
      where: { userId: session.user.id },
      update: { theme },
      create: {
        userId: session.user.id,
        theme,
      },
      select: { theme: true },
    });

    return successResponse(
      { theme: updatedPreference.theme },
      "Theme preference updated successfully"
    );
  } catch (error) {
    const logger = await getLogger("api/user/theme");
    logger.error("Error updating user theme", { err: error, method: "PATCH" });
    return internalServerErrorResponse("Failed to update theme preference");
  }
}
