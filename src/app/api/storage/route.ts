import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  internalServerErrorResponse,
  validationErrorResponse,
  unauthorizedResponse,
} from "@/lib/operation-result";
import { StorageFactory } from "@/lib/storage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withRateLimit } from "@/lib/rate-limit";
import { getLogger } from "@/lib/logging";

// Upload files
export async function POST(request: NextRequest) {
  return withRateLimit(
    request,
    async () => {
      try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session?.user) {
          return unauthorizedResponse("Authentication required");
        }

        const storage = StorageFactory.getProvider();
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const bucket = (formData.get("bucket") as string) || "uploads";

        if (!file) {
          return validationErrorResponse("No file provided");
        }

        // Server-side validation
        const allowedBuckets = ["uploads", "avatars", "documents"];
        if (!allowedBuckets.includes(bucket)) {
          return validationErrorResponse("Invalid bucket");
        }

        // File size validation (in bytes)
        const maxSizes: Record<string, number> = {
          uploads: 50 * 1024 * 1024, // 50MB
          avatars: 5 * 1024 * 1024, // 5MB
          documents: 100 * 1024 * 1024, // 100MB
        };

        if (file.size > maxSizes[bucket]) {
          return validationErrorResponse(
            `File too large. Maximum size for ${bucket} is ${maxSizes[bucket] / 1024 / 1024}MB`
          );
        }

        // File type validation
        const allowedTypes: Record<string, string[]> = {
          uploads: ["image/", "application/pdf", "text/", "video/", "audio/"],
          avatars: ["image/jpeg", "image/png", "image/gif", "image/webp"],
          documents: [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument",
            "text/",
          ],
        };

        const isValidType = allowedTypes[bucket].some(type => {
          return type.endsWith("/")
            ? file.type.startsWith(type)
            : file.type === type;
        });

        if (!isValidType) {
          return validationErrorResponse(
            `Invalid file type for ${bucket}. Allowed types: ${allowedTypes[bucket].join(", ")}`
          );
        }

        // Generate unique filename with user ID prefix
        const fileExt = file.name.split(".").pop();
        const fileName = `${session.user.id}_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload file using storage provider
        const result = await storage.upload(file, filePath, {
          bucket,
          contentType: file.type,
          upsert: false,
        });

        return successResponse(result, "File uploaded successfully");
      } catch (error) {
        const logger = await getLogger("api/storage");
        logger.error("Upload server error", { err: error, method: "POST" });
        if (error instanceof Error) {
          return errorResponse("Failed to upload file", 500, "UPLOAD_ERROR", {
            details: error.message,
          });
        }
        return internalServerErrorResponse();
      }
    },
    true
  ); // true for upload rate limiting
}

// List recent files
export async function GET(request: NextRequest) {
  return withRateLimit(
    request,
    async () => {
      try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session?.user) {
          return unauthorizedResponse("Authentication required");
        }

        const storage = StorageFactory.getProvider();
        const buckets = ["uploads", "avatars", "documents"];
        const allFiles = [];

        for (const bucket of buckets) {
          try {
            const files = await storage.list(bucket, "", {
              limit: 20,
              sortBy: { column: "created_at", order: "desc" },
            });
            allFiles.push(...files);
          } catch (error) {
            // Continue with other buckets if one fails
            const logger = await getLogger("api/storage");
            logger.warn(`Failed to list files in bucket ${bucket}`, {
              err: error,
              bucket,
            });
          }
        }

        // Sort all files by creation date
        allFiles.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });

        return successResponse(
          allFiles.slice(0, 10),
          "Files retrieved successfully"
        );
      } catch (error) {
        const logger = await getLogger("api/storage");
        logger.error("List files server error", { err: error, method: "GET" });
        return internalServerErrorResponse();
      }
    },
    false
  ); // false for general rate limiting
}

// Delete files
export async function DELETE(request: NextRequest) {
  return withRateLimit(
    request,
    async () => {
      try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session?.user) {
          return unauthorizedResponse("Authentication required");
        }

        const storage = StorageFactory.getProvider();
        const { searchParams } = new URL(request.url);
        const filePath = searchParams.get("path");
        const bucket = searchParams.get("bucket") || "uploads";

        if (!filePath) {
          return validationErrorResponse("File path is required");
        }

        // Check if user owns the file (files are prefixed with user ID)
        if (!filePath.startsWith(session.user.id)) {
          return validationErrorResponse("You can only delete your own files");
        }

        await storage.delete(bucket, filePath);

        return successResponse(null, "File deleted successfully");
      } catch (error) {
        const logger = await getLogger("api/storage");
        logger.error("Delete server error", { err: error, method: "DELETE" });
        if (error instanceof Error) {
          return errorResponse("Failed to delete file", 500, "DELETE_ERROR", {
            details: error.message,
          });
        }
        return internalServerErrorResponse();
      }
    },
    false
  ); // false for general rate limiting
}
