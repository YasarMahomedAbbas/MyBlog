import { NextRequest, NextResponse } from "next/server";
import {
  notFoundResponse,
  internalServerErrorResponse,
  unauthorizedResponse,
} from "@/lib/operation-result";
import { StorageFactory } from "@/lib/storage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withRateLimit } from "@/lib/rate-limit";
import { getLogger } from "@/lib/logging";

// Serve/download files
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bucket: string; path: string[] }> }
) {
  return withRateLimit(
    request,
    async () => {
      try {
        // Check authentication for private files
        const session = await getServerSession(authOptions);
        const { bucket, path } = await params;
        const filePath = path.join("/");

        // Public access for avatars, require auth for other buckets
        if (bucket !== "avatars" && !session?.user) {
          return unauthorizedResponse("Authentication required");
        }

        // If authenticated, check file ownership (files are prefixed with user ID)
        if (
          session?.user &&
          bucket !== "avatars" &&
          !filePath.startsWith(session.user.id)
        ) {
          return unauthorizedResponse("You can only access your own files");
        }

        const storage = StorageFactory.getProvider();

        // Download the file using storage provider
        const { data, contentType } = await storage.download(bucket, filePath);

        // Convert blob to buffer
        const buffer = await data.arrayBuffer();

        // Return the file with proper headers
        return new NextResponse(buffer, {
          headers: {
            "Content-Type": contentType,
            "Content-Disposition": `inline; filename="${filePath.split("/").pop()}"`,
            "Cache-Control": "public, max-age=3600",
          },
        });
      } catch (error) {
        const logger = await getLogger("api/storage/files");
        logger.error("File download server error", {
          err: error,
          method: "GET",
        });
        if (error instanceof Error && error.message.includes("not found")) {
          return notFoundResponse("File not found", "FILE_NOT_FOUND");
        }
        return internalServerErrorResponse();
      }
    },
    false
  ); // false for general rate limiting
}
