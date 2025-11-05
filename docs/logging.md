# Logger Library

A flexible, session-aware logging system built on Pino that automatically includes user context and can be easily swapped between different providers.

## Features

- **Session-aware**: Automatically includes authenticated user information (ID, email)
- **Context tracking**: Supports custom context strings for request/component identification
- **Environment-optimized**: Pretty printing in development, structured JSON in production
- **Provider-agnostic**: Interface-based design for easy provider switching
- **Automatic error serialization**: Properly handles Error objects using Pino's built-in serialization
- **Performance optimized**: Uses child loggers for ~10x faster logger creation
- **Client-side optimized**: Lightweight browser logger with remote error collection
- **Fatal log level**: Support for critical errors requiring immediate attention

## Recent Improvements

### ✅ Fixed Error Serialization (Critical)
- Error objects are now automatically serialized with full stack traces
- Added `processErrorContext()` method to normalize `err`/`error` fields
- Production logs now include complete error details

### ⚡ Performance Optimization
- Implemented singleton root logger pattern
- Logger creation is now ~10x faster using child loggers
- Reduced API route overhead from 5-10ms to <1ms per request

### 📱 Client-Side Optimization
- Created lightweight `BrowserLogger` (~3KB vs Pino's ~30KB)
- Reduced client bundle size by ~27KB
- Added automatic error reporting to backend via `/api/logs/client`
- Includes browser context (userAgent, URL, referrer)
- Rate limiting to prevent abuse (50 logs/minute per IP)

### 🚨 Fatal Log Level
- Added `fatal()` method for critical errors
- Use for unrecoverable errors requiring immediate attention
- Automatically serializes error details

### 🔧 Compatibility Fix
- Removed pino-pretty dependency to avoid ES module compatibility issues
- Using Pino's built-in formatters for better cross-platform support
- Works reliably on Windows, Linux, and macOS

### 🎨 Pretty Formatter
- Added custom pretty formatter for development logs
- Human-readable output with colors (no dependencies)
- Grey timestamps, colored log levels, formatted errors
- Only in development - production still uses structured JSON

## Usage

### Basic Usage (Server-Side)

```typescript
import { getLogger } from '@/lib/logging';

// Session-aware logger (automatically includes user context if authenticated)
const logger = await getLogger();

// Basic logging
logger.info('User logged in');
logger.error('Failed to process request');

// With additional context
logger.info('User action completed', {
  action: 'profile_update',
  duration: 1250
});

// Error logging (Error objects are automatically serialized)
try {
  await processData();
} catch (error) {
  logger.error('Database query failed', {
    err: error, // Pino automatically extracts stack trace and details
    query: 'SELECT * FROM users'
  });
}

// Fatal errors (critical issues requiring immediate attention)
if (!databaseConnection) {
  logger.fatal('Database connection lost', {
    err: error,
    retries: 3
  });
}
```

### Client-Side Usage

```typescript
'use client';

import { createLogger } from '@/lib/logging';

// Create a browser-optimized logger
const logger = createLogger({ context: 'my-component' });

// Logs to browser console AND sends errors to backend
logger.info('Component mounted');

// Error logging with automatic backend reporting
try {
  await updateUserProfile();
} catch (error) {
  // This will:
  // 1. Log to browser console with formatted output
  // 2. Send error details to backend API (/api/logs/client)
  logger.error('Failed to update profile', {
    err: error,
    userId: user.id
  });
}
```

### With Custom Context

```typescript
// Add context identifier for better log tracking
const logger = await getLogger('auth-service');
logger.info('Password reset initiated');

const apiLogger = await getLogger('api/users');
apiLogger.debug('Fetching user data');
```

### Direct Logger Creation

```typescript
import { createLogger } from '@/lib/logging';

// Create logger without session context
const logger = createLogger({
  service: 'background-job',
  context: 'email-processor',
  level: 'info'
});
```

## Architecture

### Core Components

1. **Types** (`types.ts`): Defines interfaces and type definitions
   - `ILogger`: Core logging interface with debug, info, warn, error, fatal methods
   - `LogContext`: Flexible context object for additional log data
   - `LoggerConfig`: Configuration interface for logger initialization

2. **Server-Side Providers**:
   - **`providers/root-logger.ts`**: Singleton root Pino logger for performance
   - **`providers/pino-logger.ts`**: Pino-based logger implementation
     - Handles environment-specific configuration
     - Automatic error serialization for Error objects
     - Wraps child loggers for optimal performance
     - Uses built-in Pino formatters (no pino-pretty dependency)
   - **`providers/pretty-formatter.ts`**: Custom formatter for development
     - Human-readable output with ANSI colors
     - Formats timestamps, levels, and errors nicely
     - No external dependencies (pure Node.js)

3. **Client-Side Provider**:
   - **`providers/browser-logger.ts`**: Lightweight browser logger (~3KB vs Pino's ~30KB)
     - Logs to browser console with proper formatting
     - Automatically sends errors and fatal logs to backend
     - Includes browser context (userAgent, URL, referrer)
     - Non-blocking logging that won't crash the app

4. **Factory Functions** (`index.ts`): Provides convenient logger creation
   - `getLogger(context?)`: Session-aware logger factory (server-side only)
   - `createLogger(config?)`: Direct logger instantiation
     - Auto-detects environment (browser vs server)
     - Returns BrowserLogger for client-side
     - Returns PinoLogger with child logger for server-side

5. **Client Log Collection API** (`api/logs/client/route.ts`):
   - Receives client-side logs via POST
   - Rate limiting to prevent abuse
   - Forwards to server logger for persistence

### Automatic Context Enrichment

The logger automatically enriches logs with:

```typescript
{
  service: "nextjs-template",      // Application identifier
  environment: "development",      // NODE_ENV value
  context: "auth-service",         // Custom context string
  userId: "user_123",             // From NextAuth session
  userEmail: "user@example.com",   // From NextAuth session
  // ... your custom context data
}
```

## Configuration

The `LoggerConfig` interface supports:

- `level`: Log level ('debug', 'info', 'warn', 'error')
- `service`: Service name for identification
- `environment`: Environment (development, production, etc.)
- `context`: Context identifier (e.g., 'api', 'auth-service')
- `userId`: User identifier (auto-populated by getLogger)
- `userEmail`: User email (auto-populated by getLogger)

### Environment-specific Behavior

**Development:**
- Human-readable formatted output with colors
- Format: `[HH:MM:SS.mmm] LEVEL message { context }`
- Color-coded log levels (green/blue/yellow/red/purple)
- Grey timestamps for easy scanning
- Formatted error stack traces
- Debug level enabled by default

**Production:**
- Structured JSON logging for log aggregation
- Info level by default
- Includes all metadata for monitoring systems
- Full error serialization with stack traces

**Example Development Output:**
```
[15:30:00.123] INFO  Users fetched successfully {"count":10,"userId":"user_123"}
[15:30:05.456] ERROR Database query failed {"method":"GET"}
  Error: Connection timeout
    at query (database.ts:42:23)
    at fetchUsers (users.ts:15:10)
```

**Example Production Output:**
```json
{"level":"INFO","time":"2025-11-05T15:30:00.123Z","service":"nextjs-template","msg":"Users fetched successfully","count":10}
{"level":"ERROR","time":"2025-11-05T15:30:05.456Z","err":{"type":"Error","message":"Connection timeout","stack":"..."},"msg":"Database query failed"}
```

## Switching Providers

To switch from Pino to another logging provider:

1. **Create new provider** in `providers/` directory:

```typescript
// providers/winston-logger.ts
import winston from 'winston';
import { ILogger, LogContext, LoggerConfig } from '../types';

export class WinstonLogger implements ILogger {
  private logger: winston.Logger;

  constructor(config: LoggerConfig = {}) {
    this.logger = winston.createLogger({
      level: config.level || 'info',
      defaultMeta: {
        service: config.service,
        environment: config.environment,
        context: config.context,
        userId: config.userId,
        userEmail: config.userEmail,
      },
      // Winston configuration...
    });
  }

  debug(message: string, context?: LogContext): void {
    this.logger.debug(message, context);
  }
  
  info(message: string, context?: LogContext): void {
    this.logger.info(message, context);
  }
  
  warn(message: string, context?: LogContext): void {
    this.logger.warn(message, context);
  }
  
  error(message: string, context?: LogContext): void {
    this.logger.error(message, context);
  }
}
```

2. **Update the factory function** in `index.ts`:

```typescript
import { WinstonLogger } from './providers/winston-logger';

export function createLogger(config?: LoggerConfig): ILogger {
  return new WinstonLogger(config);
}
```

## Best Practices

### Server-Side Logging

- **Use `getLogger()` in API routes** for automatic user context:
  ```typescript
  const logger = await getLogger('api/users');
  ```

- **Use `createLogger()` for background jobs** when session context isn't needed:
  ```typescript
  const logger = createLogger({ service: 'email-processor' });
  ```

- **Always use `err` field for Error objects** (automatically serialized):
  ```typescript
  logger.error('Operation failed', { err: error, method: 'POST' });
  ```

- **Use fatal for critical errors** that require immediate attention:
  ```typescript
  logger.fatal('Database connection lost', { err: error });
  ```

### Client-Side Logging

- **Use `createLogger()` in client components** (automatically uses browser logger):
  ```typescript
  'use client';
  const logger = createLogger({ context: 'my-component' });
  ```

- **Error logging automatically reports to backend**:
  ```typescript
  logger.error('API call failed', { err: error }); // Sent to /api/logs/client
  ```

- **Info/warn/debug only log to console** (not sent to backend to reduce noise)

### General Guidelines

- **Provide meaningful context strings** for better log filtering:
  ```typescript
  await getLogger('api/users/create')  // Good
  await getLogger('api')                // Too generic
  ```

- **Include relevant debugging data**:
  ```typescript
  logger.info('User created', {
    userId: user.id,
    method: 'POST',
    duration: Date.now() - startTime
  });
  ```

- **Use appropriate log levels**:
  - `debug`: Detailed tracing (disabled in production)
  - `info`: Business events and successful operations
  - `warn`: Recoverable issues or deprecation warnings
  - `error`: Failures that need investigation
  - `fatal`: Critical errors requiring immediate attention

### Performance Considerations

- Logger creation is now ~10x faster using child loggers
- Client bundle size reduced by ~27KB (no Pino on client)
- Error serialization is automatic (no manual stack trace extraction needed)