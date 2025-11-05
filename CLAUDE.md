# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 starter template with App Router, designed as a full-stack application with authentication, role-based access control, and a complete UI framework setup.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS with custom theme (primary, secondary, accent colors) ALWAYS USE global.css for reference to colors, NEVER make up colors.
- **UI Components**: shadcn/ui (pre-configured components: button, card, input, modal, navbar, sidebar)
- **Authentication**: NextAuth.js with email + OAuth provider support
- **Database**: PostgreSQL with Prisma ORM
- **Linting**: ESLint + Prettier + Tailwind lint plugin

## Project Structure

The application follows a specific routing structure:
- `app/(public)` - Landing page (marketing style)
- `app/(auth)` - Authentication pages (login, register, forgot password, reset password)
- `app/(protected)` - User dashboard (requires authentication)
- `app/(admin)` - Admin dashboard (requires admin role)
- `app/api` - REST endpoints for auth and CRUD operations

## Database Schema

Base Prisma migration includes:
- User (with Role field for admin access)
- Session
- Account  
- VerificationToken

## Authentication & Middleware

- NextAuth.js handles session management
- Middleware enforces role-based access:
  - `/protected/*` routes require authenticated users
  - `/admin/*` routes require users with `role=admin`

## Development Workflow
Ensure api is following proper crud workflow, don't just throw random APIs to solve a small problem, break into a crud operation. 
For all API routes, always use the operation-result.ts
For all frontend designs, always use the global.css

For any logging, use the logger.Add logging whenever we catch an error. 
Add info logging where needed but do not add unneccessary logging
always use api/route for the context when getting the logger.
  In API routes/server components:
   const logger = await getLogger('api/users');
   logger.error("Error fetching users", { err: error, method: "GET"});

  For background jobs:
  const logger = createLogger({ service: 'email-processor' });
  logger.info('email sent to user', {subject: email.subject});