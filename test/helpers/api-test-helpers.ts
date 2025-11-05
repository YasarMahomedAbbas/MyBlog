import { NextRequest } from "next/server";
import {
  mockGetServerSession,
  mockSession,
  mockAdminSession,
} from "../mocks/auth";

// Helper to create mock NextRequest
export function createMockRequest(
  url: string,
  options: {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
    searchParams?: Record<string, string>;
  } = {}
) {
  const { method = "GET", body, headers = {}, searchParams = {} } = options;

  // Build URL with search params
  const urlObj = new URL(url, "http://localhost:3000");
  Object.entries(searchParams).forEach(([key, value]) => {
    urlObj.searchParams.set(key, value);
  });

  const requestInit: Record<string, unknown> = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body && method !== "GET" && method !== "HEAD") {
    requestInit.body = JSON.stringify(body);
  }

  return new NextRequest(urlObj.toString(), requestInit);
}

// Helper to create mock params for dynamic routes
export function createMockParams<T extends Record<string, string>>(params: T) {
  return Promise.resolve(params);
}

// Session helpers
export function mockAuthenticatedUser() {
  mockGetServerSession.mockResolvedValue(mockSession);
}

export function mockAuthenticatedAdmin() {
  mockGetServerSession.mockResolvedValue(mockAdminSession);
}

export function mockUnauthenticatedUser() {
  mockGetServerSession.mockResolvedValue(null);
}

// Helper to parse response JSON
export async function parseResponse(response: Response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
