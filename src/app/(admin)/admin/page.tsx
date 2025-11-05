"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Users,
  Server,
  Database,
  Clock,
  HardDrive,
  Cpu,
  MemoryStick,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { createLogger } from "@/lib/logging";

interface HealthCheck {
  status: "healthy" | "unhealthy" | "checking";
  latency: number | null;
  timestamp: string;
}

interface SystemInfo {
  uptime: string;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    usage: number;
    cores: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
  };
  platform: string;
  arch: string;
  nodeVersion: string;
}

export default function AdminDashboard() {
  const [healthCheck, setHealthCheck] = useState<HealthCheck>({
    status: "checking",
    latency: null,
    timestamp: new Date().toISOString(),
  });
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  const checkHealth = async () => {
    setIsCheckingHealth(true);
    setHealthCheck(prev => ({ ...prev, status: "checking" }));

    try {
      const startTime = Date.now();
      const response = await fetch("/api/health");
      const endTime = Date.now();
      const latency = endTime - startTime;

      if (response.ok) {
        const data = await response.json();
        setHealthCheck({
          status: "healthy",
          latency,
          timestamp: new Date().toISOString(),
        });
        setSystemInfo(data.data.system);
      } else {
        setHealthCheck({
          status: "unhealthy",
          latency,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      const logger = createLogger({ service: "admin-health-check" });
      logger.error("Health check failed", { error });
      setHealthCheck({
        status: "unhealthy",
        latency: null,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsCheckingHealth(false);
    }
  };

  useEffect(() => {
    checkHealth();
    fetchUserCount();
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      checkHealth();
      fetchUserCount();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUserCount = async () => {
    try {
      const response = await fetch("/api/users?limit=1");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserCount(data.data.pagination.total);
        }
      }
    } catch (error) {
      const logger = createLogger({ context: "admin-dashboard" });
      logger.error("Failed to fetch user count", { err: error });
    }
  };

  const formatBytes = (bytes: number) => {
    const sizes = ["B", "KB", "MB", "GB"];
    if (bytes === 0) return "0 B";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Monitor system health and overview
          </p>
        </div>
        <Button
          onClick={checkHealth}
          disabled={isCheckingHealth}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw
            size={16}
            className={isCheckingHealth ? "animate-spin" : ""}
          />
          {isCheckingHealth ? "Checking..." : "Refresh"}
        </Button>
      </div>

      <div>
        {/* Key Metrics Row */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* System Status */}
          <Card
            className={`relative overflow-hidden ${
              healthCheck.status === "healthy"
                ? "border-success/20 bg-success/5"
                : healthCheck.status === "unhealthy"
                  ? "border-destructive/20 bg-destructive/5"
                  : "border-warning/20 bg-warning/5"
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  System Status
                </CardTitle>
                {healthCheck.status === "healthy" ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : healthCheck.status === "unhealthy" ? (
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                ) : (
                  <RefreshCw className="h-4 w-4 text-warning animate-spin" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div
                  className={`text-2xl font-bold ${
                    healthCheck.status === "healthy"
                      ? "text-success"
                      : healthCheck.status === "unhealthy"
                        ? "text-destructive"
                        : "text-warning"
                  }`}
                >
                  {healthCheck.status === "healthy"
                    ? "Operational"
                    : healthCheck.status === "unhealthy"
                      ? "Issues Detected"
                      : "Checking..."}
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  {healthCheck.latency !== null && (
                    <div>Response: {healthCheck.latency}ms</div>
                  )}
                  <div>
                    Updated:{" "}
                    {new Date(healthCheck.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Count */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {userCount !== null ? userCount : "..."}
              </div>
              <div className="text-xs text-muted-foreground">
                Registered accounts
              </div>
            </CardContent>
          </Card>

          {/* System Info Cards */}
          {systemInfo && (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Memory Usage
                    </CardTitle>
                    <MemoryStick className="h-4 w-4 text-accent" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-accent">
                      {systemInfo.memory.percentage.toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatBytes(systemInfo.memory.used)} /{" "}
                      {formatBytes(systemInfo.memory.total)}
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(systemInfo.memory.percentage, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      CPU Usage
                    </CardTitle>
                    <Cpu className="h-4 w-4 text-warning" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-warning">
                      {systemInfo.cpu.usage.toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {systemInfo.cpu.cores} cores available
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-warning h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(systemInfo.cpu.usage, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Detailed System Information */}
        {systemInfo && (
          <div className="grid gap-6 lg:grid-cols-3 mt-8">
            {/* System Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server size={20} className="text-primary" />
                  System Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Clock size={18} className="text-primary" />
                        <span className="font-medium">Uptime</span>
                      </div>
                      <span className="text-sm font-mono bg-background px-2 py-1 rounded">
                        {systemInfo.uptime}
                      </span>
                    </div>

                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Database size={18} className="text-primary" />
                        <span className="font-medium">Database</span>
                      </div>
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded ${
                          healthCheck.status === "healthy"
                            ? "bg-success/20 text-success"
                            : "bg-destructive/20 text-destructive"
                        }`}
                      >
                        {healthCheck.status === "healthy"
                          ? "Connected"
                          : "Disconnected"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3 mb-2">
                        <HardDrive size={18} className="text-primary" />
                        <span className="font-medium">Storage</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Used: {formatBytes(systemInfo.disk.used)}</span>
                          <span>{systemInfo.disk.percentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-background rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(systemInfo.disk.percentage, 100)}%`,
                            }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatBytes(systemInfo.disk.total)} total
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>Platform: {systemInfo.platform}</div>
                        <div>Architecture: {systemInfo.arch}</div>
                        <div>Node.js: {systemInfo.nodeVersion}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity size={20} className="text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/admin/users" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto p-4 hover:bg-primary/5"
                  >
                    <div className="flex items-center gap-3">
                      <Users size={18} className="text-primary" />
                      <div className="text-left">
                        <div className="font-medium">Manage Users</div>
                        <div className="text-xs text-muted-foreground">
                          View and edit user accounts
                        </div>
                      </div>
                    </div>
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 hover:bg-accent/5"
                  onClick={checkHealth}
                  disabled={isCheckingHealth}
                >
                  <div className="flex items-center gap-3">
                    <RefreshCw
                      size={18}
                      className={`text-accent ${isCheckingHealth ? "animate-spin" : ""}`}
                    />
                    <div className="text-left">
                      <div className="font-medium">
                        {isCheckingHealth ? "Checking..." : "Refresh Status"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Run system health check
                      </div>
                    </div>
                  </div>
                </Button>

                <div className="pt-2 border-t">
                  <div className="text-xs text-muted-foreground mb-2">
                    System Resources
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Memory</span>
                      <span className="text-sm font-mono">
                        {systemInfo.memory.percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">CPU</span>
                      <span className="text-sm font-mono">
                        {systemInfo.cpu.usage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
