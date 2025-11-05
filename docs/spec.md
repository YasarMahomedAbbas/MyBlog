📋 Project Spec: Next.js Starter Template
Tech Stack
Framework: Next.js 14 (App Router)
Styling: TailwindCSS with custom theme (primary, secondary, accent)
UI Components: shadcn/ui (pre-configured with button, card, input, modal, navbar, sidebar)
Auth: NextAuth.js (email + OAuth provider support, session handling, middleware)
Database: PostgreSQL with Prisma ORM (base migration with User, Session, Account, VerificationToken)
Routing: File-based routing with directory structure:
/public → Landing page
/auth → Login, Register, Forgot Password
/protected → Dashboard (user access required)
/admin → Admin dashboard (role check via middleware)
/api → REST endpoints (auth, CRUD stubs)
Middleware: Role-based auth enforcement for protected/admin routes
CI/CD: GitHub Actions pipeline to run linting, type checking, and tests
Linting & Formatting: ESLint, Prettier, Tailwind lint rules
Pages / Flows
Landing Page (Public) → marketing style
Auth Pages (Sign in, Register, Forgot password, Reset password)
Dashboard (User-only area) → minimal placeholder
Admin Page → restricted by role=admin