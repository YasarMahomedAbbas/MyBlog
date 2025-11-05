"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bug,
  Info,
  AlertTriangle,
  XCircle,
  Skull,
  Server,
  Monitor,
  CheckCircle,
  XOctagon,
} from "lucide-react";
import { createLogger } from "@/lib/logging";

interface LogResult {
  timestamp: string;
  level: string;
  message: string;
  location: "client" | "server";
  status: "success" | "error";
}

export default function LoggerTestPage() {
  const [results, setResults] = useState<LogResult[]>([]);
  const [loading, setLoading] = useState(false);

  const clientLogger = createLogger({ context: "logger-test-page" });

  const addResult = (
    level: string,
    message: string,
    location: "client" | "server",
    status: "success" | "error" = "success"
  ) => {
    setResults(prev => [
      {
        timestamp: new Date().toISOString(),
        level,
        message,
        location,
        status,
      },
      ...prev.slice(0, 19), // Keep last 20 results
    ]);
  };

  // Client-side logging tests
  const testClientDebug = () => {
    clientLogger.debug("Client debug test", {
      testId: "debug-001",
      data: { foo: "bar" },
    });
    addResult("debug", "Client debug log sent to console", "client");
  };

  const testClientInfo = () => {
    clientLogger.info("Client info test", {
      testId: "info-001",
      timestamp: Date.now(),
    });
    addResult("info", "Client info log sent to console", "client");
  };

  const testClientWarn = () => {
    clientLogger.warn("Client warning test", {
      testId: "warn-001",
      reason: "Test warning",
    });
    addResult("warn", "Client warning log sent to console", "client");
  };

  const testClientError = () => {
    const testError = new Error("Test error from client");
    testError.stack =
      "Error: Test error from client\n    at testClientError (logger/page.tsx:58:23)";
    clientLogger.error("Client error test", {
      err: testError,
      testId: "error-001",
      context: "error testing",
    });
    addResult(
      "error",
      "Client error log sent to console AND backend",
      "client"
    );
  };

  const testClientFatal = () => {
    const testError = new Error("Fatal error from client");
    testError.stack =
      "Error: Fatal error from client\n    at testClientFatal (logger/page.tsx:69:23)";
    clientLogger.fatal("Client fatal error test", {
      err: testError,
      testId: "fatal-001",
      severity: "critical",
    });
    addResult(
      "fatal",
      "Client fatal log sent to console AND backend",
      "client"
    );
  };

  // Server-side logging tests
  const testServerLog = async (level: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/test/logger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level }),
      });

      const result = await response.json();

      if (response.ok) {
        addResult(
          level,
          `Server ${level} log successful: ${result.message}`,
          "server"
        );
      } else {
        addResult(
          level,
          `Server ${level} log failed: ${result.error}`,
          "server",
          "error"
        );
      }
    } catch (error) {
      addResult(
        level,
        `Server ${level} log failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        "server",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const testAllClientLogs = () => {
    testClientDebug();
    setTimeout(() => testClientInfo(), 100);
    setTimeout(() => testClientWarn(), 200);
    setTimeout(() => testClientError(), 300);
    setTimeout(() => testClientFatal(), 400);
  };

  const testAllServerLogs = async () => {
    for (const level of ["debug", "info", "warn", "error", "fatal"]) {
      await testServerLog(level);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Logger Testing Suite</h1>
        <p className="text-muted-foreground">
          Test client-side and server-side logging with all log levels. Check
          your browser console for client logs.
        </p>
      </div>

      {/* Client-Side Tests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Client-Side Logger Tests
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            These logs are sent to the browser console. Error and Fatal logs are
            also sent to the backend.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={testClientDebug} variant="outline" size="sm">
              <Bug className="h-4 w-4 mr-2" />
              Debug
            </Button>
            <Button onClick={testClientInfo} variant="outline" size="sm">
              <Info className="h-4 w-4 mr-2" />
              Info
            </Button>
            <Button onClick={testClientWarn} variant="outline" size="sm">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Warn
            </Button>
            <Button onClick={testClientError} variant="outline" size="sm">
              <XCircle className="h-4 w-4 mr-2" />
              Error
            </Button>
            <Button onClick={testClientFatal} variant="outline" size="sm">
              <Skull className="h-4 w-4 mr-2" />
              Fatal
            </Button>
            <Button onClick={testAllClientLogs} variant="default" size="sm">
              Test All Client Logs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Server-Side Tests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Server-Side Logger Tests
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            These logs are sent to the server logger. Check your server
            console/logs.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => testServerLog("debug")}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <Bug className="h-4 w-4 mr-2" />
              Debug
            </Button>
            <Button
              onClick={() => testServerLog("info")}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <Info className="h-4 w-4 mr-2" />
              Info
            </Button>
            <Button
              onClick={() => testServerLog("warn")}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Warn
            </Button>
            <Button
              onClick={() => testServerLog("error")}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Error
            </Button>
            <Button
              onClick={() => testServerLog("fatal")}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <Skull className="h-4 w-4 mr-2" />
              Fatal
            </Button>
            <Button
              onClick={testAllServerLogs}
              variant="default"
              size="sm"
              disabled={loading}
            >
              Test All Server Logs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Log */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Test Results</CardTitle>
          <Button onClick={clearResults} variant="outline" size="sm">
            Clear Results
          </Button>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No test results yet. Click any button above to test logging.
            </p>
          ) : (
            <div className="space-y-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-md border ${
                    result.status === "error"
                      ? "bg-destructive/10 border-destructive/20"
                      : "bg-muted/50"
                  }`}
                >
                  <div className="mt-0.5">
                    {result.status === "success" ? (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    ) : (
                      <XOctagon className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs font-mono px-2 py-0.5 rounded ${
                          result.level === "debug"
                            ? "bg-muted/20 text-muted-foreground"
                            : result.level === "info"
                              ? "bg-success/20 text-success"
                              : result.level === "warn"
                                ? "bg-warning/20 text-warning"
                                : result.level === "error"
                                  ? "bg-destructive/20 text-destructive"
                                  : "bg-destructive/20 text-destructive"
                        }`}
                      >
                        {result.level.toUpperCase()}
                      </span>
                      <span
                        className={`text-xs font-mono px-2 py-0.5 rounded ${
                          result.location === "client"
                            ? "bg-primary/20 text-primary"
                            : "bg-secondary/20 text-secondary-foreground"
                        }`}
                      >
                        {result.location.toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm">{result.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Testing Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <h4 className="font-semibold mb-1">Client-Side Tests:</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li>Open browser DevTools console (F12)</li>
              <li>Click any client-side log button</li>
              <li>Check console for formatted log output</li>
              <li>
                Error and Fatal logs are also sent to{" "}
                <code className="px-1 py-0.5 bg-muted rounded">
                  /api/logs/client
                </code>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Server-Side Tests:</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li>Check your terminal/server console running Next.js</li>
              <li>
                Look for logs prefixed with{" "}
                <code className="px-1 py-0.5 bg-muted rounded">[TEST]</code>
              </li>
              <li>Verify error logs include full stack traces</li>
              <li>Fatal logs should be clearly marked</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-1">What to Verify:</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li>Error objects include full stack traces</li>
              <li>User context (ID, email) is included in server logs</li>
              <li>Client logs include browser context (userAgent, URL)</li>
              <li>All log levels work correctly</li>
              <li>
                Client error/fatal logs appear in server logs via{" "}
                <code className="px-1 py-0.5 bg-muted rounded">
                  /api/logs/client
                </code>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
