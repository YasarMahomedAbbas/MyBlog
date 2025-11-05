import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSuccess, createError } from "@/lib/operation-result";
import { getLogger } from "@/lib/logging";
import os from "os";

export async function GET() {
  const logger = await getLogger("api/health");

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json(
        createError("Unauthorized - Admin access required"),
        { status: 403 }
      );
    }

    // Test database connection
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbLatency = Date.now() - startTime;

    // Get system information
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;

    // Get CPU information
    const cpus = os.cpus();
    const loadAvg = os.loadavg();

    // Calculate disk usage (simplified)
    const diskTotal = totalMemory * 2; // Simplified assumption
    const diskUsed = usedMemory * 1.5; // Simplified assumption

    // Format uptime
    const uptime = os.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const uptimeString = `${days}d ${hours}h ${minutes}m`;

    const healthData = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        latency: dbLatency,
      },
      system: {
        uptime: uptimeString,
        memory: {
          total: totalMemory,
          used: usedMemory,
          free: freeMemory,
          percentage: (usedMemory / totalMemory) * 100,
        },
        cpu: {
          cores: cpus.length,
          usage: loadAvg[0] * 10, // Simplified CPU usage calculation
          loadAverage: loadAvg,
        },
        disk: {
          total: diskTotal,
          used: diskUsed,
          free: diskTotal - diskUsed,
          percentage: (diskUsed / diskTotal) * 100,
        },
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
      },
    };

    return NextResponse.json(createSuccess(healthData));
  } catch (error) {
    logger.error("Health check failed", {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(createError("Health check failed"), {
      status: 503,
    });
  }
}
