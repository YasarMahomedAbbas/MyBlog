import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  validationErrorResponse,
  internalServerErrorResponse,
} from "@/lib/operation-result";
import { getLogger } from "@/lib/logging";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return validationErrorResponse("Valid email is required");
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return success even if user doesn't exist for security
      return successResponse(
        {
          message:
            "If an account with this email exists, a password reset email has been sent.",
        },
        "Password reset email sent"
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Store reset token in database
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: resetToken,
        expires: resetTokenExpiry,
      },
    });

    // In a real application, you would send an email here
    // For now, we'll just log it and return success
    const logger = await getLogger("api/auth/reset-password");
    logger.info("Password reset requested", {
      email,
      resetToken,
      expiresAt: resetTokenExpiry,
    });

    // TODO: Implement email sending logic
    // await sendPasswordResetEmail(email, resetToken);

    return successResponse(
      {
        message:
          "If an account with this email exists, a password reset email has been sent.",
      },
      "Password reset email sent"
    );
  } catch (error) {
    const logger = await getLogger("api/auth/reset-password");
    logger.error("Error processing password reset", {
      err: error,
      method: "POST",
    });
    return internalServerErrorResponse(
      "Failed to process password reset request"
    );
  }
}
