import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// In-memory store for rate limiting
const memoryStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiter class
class MemoryRateLimiter {
  private limit: number;
  private windowMs: number;

  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  async check(identifier: string) {
    const now = Date.now();
    const windowStart = Math.floor(now / this.windowMs) * this.windowMs;
    const key = `${identifier}:${windowStart}`;

    const current = memoryStore.get(key) || {
      count: 0,
      resetTime: windowStart + this.windowMs,
    };

    current.count++;
    memoryStore.set(key, current);

    // Clean up old entries periodically
    if (Math.random() < 0.1) {
      // 10% chance to cleanup on each request
      for (const [mapKey, value] of memoryStore.entries()) {
        if (now > value.resetTime) {
          memoryStore.delete(mapKey);
        }
      }
    }

    return {
      success: current.count <= this.limit,
      limit: this.limit,
      remaining: Math.max(0, this.limit - current.count),
      reset: new Date(current.resetTime),
    };
  }
}

// Create rate limiters
const uploadRateLimit = new MemoryRateLimiter(10, 60 * 1000); // 10 per minute
const generalRateLimit = new MemoryRateLimiter(100, 60 * 1000); // 100 per minute

// Helper function to get rate limit identifier
export async function getRateLimitIdentifier(
  request: NextRequest
): Promise<string> {
  // Try to get user ID from session first
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    return `user:${session.user.id}`;
  }

  // Fall back to IP address for unauthenticated requests
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")?.[0] ??
    request.headers.get("x-real-ip") ??
    "127.0.0.1";
  return `ip:${ip}`;
}

// Rate limit check function
export async function checkRateLimit(
  request: NextRequest,
  isUpload: boolean = false
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: Date;
}> {
  const identifier = await getRateLimitIdentifier(request);
  const limiter = isUpload ? uploadRateLimit : generalRateLimit;
  return await limiter.check(identifier);
}

// Middleware helper for rate limiting
export async function withRateLimit<T>(
  request: NextRequest,
  handler: () => Promise<T>,
  isUpload: boolean = false
): Promise<T | Response> {
  const rateLimitResult = await checkRateLimit(request, isUpload);

  if (!rateLimitResult.success) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Rate limit exceeded",
        code: "RATE_LIMIT_EXCEEDED",
        data: {
          limit: rateLimitResult.limit,
          remaining: rateLimitResult.remaining,
          resetTime: rateLimitResult.reset.toISOString(),
        },
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": rateLimitResult.limit.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": rateLimitResult.reset.getTime().toString(),
          "Retry-After": Math.ceil(
            (rateLimitResult.reset.getTime() - Date.now()) / 1000
          ).toString(),
        },
      }
    );
  }

  return handler();
}
