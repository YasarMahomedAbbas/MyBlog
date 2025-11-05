import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { validatePassword } from "@/lib/password-config";
import { passwordConfig } from "@/config/password";
import { getLogger } from "@/lib/logging";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Validate password requirements
    const passwordValidation = validatePassword(password, passwordConfig);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          error: "Password requirements not met",
          errors: passwordValidation.errors,
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
    });

    // Remove password from response
    const { ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: "User created successfully", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    const logger = await getLogger("api/auth/register");
    logger.error("Registration error", { err: error, method: "POST" });
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
