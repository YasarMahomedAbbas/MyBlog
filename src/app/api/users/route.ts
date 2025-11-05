import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role, isAdmin } from "@/types/roles";
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  internalServerErrorResponse,
} from "@/lib/operation-result";
import { getLogger } from "@/lib/logging";

export async function GET(request: NextRequest) {
  const logger = await getLogger("api/users");
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return unauthorizedResponse();
    }

    // Only admin users can view all users
    if (!isAdmin(session.user.role as Role)) {
      return forbiddenResponse("Admin access required");
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";

    const skip = (page - 1) * limit;

    const whereCondition: Record<string, unknown> = {};

    if (search) {
      whereCondition.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role) {
      whereCondition.role = role;
    }

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: whereCondition,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatar: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where: whereCondition }),
    ]);
    logger.info("Users fetched successfully", { count: users.length });
    return successResponse({
      users,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    logger.error("Error fetching users", { err: error, method: "GET" });
  }
  return internalServerErrorResponse();
}
