import { NextResponse } from "next/server";

export interface OperationSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface OperationError {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, unknown>;
}

export type OperationResult<T = unknown> = OperationSuccess<T> | OperationError;

// Helper functions to create operation results
export function createSuccess<T>(
  data: T,
  message?: string
): OperationSuccess<T> {
  return {
    success: true,
    data,
    ...(message && { message }),
  };
}

export function createError(
  error: string,
  code?: string,
  details?: Record<string, unknown>
): OperationError {
  return {
    success: false,
    error,
    ...(code && { code }),
    ...(details && { details }),
  };
}

// Helper functions to create NextResponse with operation results
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<OperationSuccess<T>> {
  return NextResponse.json(createSuccess(data, message), { status });
}

export function errorResponse(
  error: string,
  status: number = 400,
  code?: string,
  details?: Record<string, unknown>
): NextResponse<OperationError> {
  return NextResponse.json(createError(error, code, details), { status });
}

// Specific error response helpers
export function badRequestResponse(
  message: string = "Bad request"
): NextResponse<OperationError> {
  return errorResponse(message, 400, "BAD_REQUEST");
}

export function unauthorizedResponse(
  message: string = "Unauthorized"
): NextResponse<OperationError> {
  return errorResponse(message, 401, "UNAUTHORIZED");
}

export function forbiddenResponse(
  message: string = "Forbidden"
): NextResponse<OperationError> {
  return errorResponse(message, 403, "FORBIDDEN");
}

export function notFoundResponse(
  message: string = "Resource not found",
  code?: string
): NextResponse<OperationError> {
  return errorResponse(message, 404, code || "NOT_FOUND");
}

export function conflictResponse(
  message: string = "Resource already exists",
  code?: string
): NextResponse<OperationError> {
  return errorResponse(message, 409, code || "CONFLICT");
}

export function validationErrorResponse(
  message: string = "Invalid input",
  details?: Record<string, unknown>
): NextResponse<OperationError> {
  return errorResponse(message, 400, "VALIDATION_ERROR", details);
}

export function internalServerErrorResponse(
  message: string = "Internal server error"
): NextResponse<OperationError> {
  return errorResponse(message, 500, "INTERNAL_SERVER_ERROR");
}

export function tooManyRequestsResponse(
  message: string = "Too many requests"
): NextResponse<OperationError> {
  return errorResponse(message, 429, "TOO_MANY_REQUESTS");
}

// Type guards for client-side usage
export function isSuccess<T>(
  result: OperationResult<T>
): result is OperationSuccess<T> {
  return result.success === true;
}

export function isError<T>(
  result: OperationResult<T>
): result is OperationError {
  return result.success === false;
}
