import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLogger } from "@/lib/logging";

export async function GET() {
  try {
    await prisma.$connect();

    const result = await prisma.$queryRaw`SELECT 1 as test`;

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      data: result,
    });
  } catch (error) {
    const logger = await getLogger("api/test-db");
    logger.error("Database connection error", { err: error, method: "GET" });

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
