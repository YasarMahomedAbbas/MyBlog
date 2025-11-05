import { Prisma } from "@prisma/client";
import {
  errorResponse,
  conflictResponse,
  notFoundResponse,
  validationErrorResponse,
  internalServerErrorResponse,
  type OperationError,
} from "./operation-result";
import { NextResponse } from "next/server";
import { createLogger, type ILogger } from "./logging";

export function handlePrismaError(
  error: unknown,
  logger?: ILogger
): NextResponse<OperationError> {
  // Use provided logger or create a fallback one
  const errorLogger = logger || createLogger({ context: "error-handler" });
  errorLogger.error("Database error", { err: error });

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return conflictResponse(
          "A record with this data already exists",
          error.code
        );

      case "P2025":
        return notFoundResponse("Record not found", error.code);

      case "P2003":
        return validationErrorResponse("Foreign key constraint failed", {
          code: error.code,
        });

      case "P2014":
        return validationErrorResponse("Invalid ID provided", {
          code: error.code,
        });

      default:
        return errorResponse(`Database error: ${error.code}`, 400, error.code);
    }
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return internalServerErrorResponse("Unknown database error occurred");
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return validationErrorResponse("Invalid data provided");
  }

  // Generic error fallback
  return internalServerErrorResponse();
}

// Type guard functions for cleaner error checking
export function isPrismaKnownRequestError(
  error: unknown
): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError;
}

export function isPrismaValidationError(
  error: unknown
): error is Prisma.PrismaClientValidationError {
  return error instanceof Prisma.PrismaClientValidationError;
}

// Specific error type checkers
export function isUniqueConstraintError(error: unknown): boolean {
  return isPrismaKnownRequestError(error) && error.code === "P2002";
}

export function isRecordNotFoundError(error: unknown): boolean {
  return isPrismaKnownRequestError(error) && error.code === "P2025";
}
