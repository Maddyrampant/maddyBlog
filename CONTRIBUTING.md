# Contributing to maddyBlog

Thank you for your interest in contributing! maddyBlog is an open-source blogging platform built with Next.js, TypeScript, and Prisma.

## Architecture Overview

```
src/
├── app/            # Next.js App Router pages & API routes
├── components/     # UI components (blog, admin, seo)
├── features/       # Feature modules (auth, post, comment)
├── services/       # Business logic layer
├── lib/            # Utilities (prisma, jwt, logger, errors, etc.)
├── validations/    # Zod schemas
├── types/          # TypeScript types
├── generated/      # Prisma client (auto-generated)
└── cli/            # Dev CLI tools
```

- **Server Components by default** — minimize `"use client"`
- **Controller → Service → Repository** pattern for features
- **Prisma** for all database access
- **Zod** for validation

## Getting Started

### Prerequisites

- Node.js 22+
- PostgreSQL 16+
- npm

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/Maddyrampant/maddyBlog.git
cd maddyBlog

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env
# Edit .env with your PostgreSQL connection string

# 4. Generate Prisma client
npx prisma generate --generator client

# 5. Run database migrations
npx prisma migrate dev

# 6. Seed the database
npm run seed

# 7. Start the dev server
npm run dev
```

### Admin Credentials (after seeding)

| Email                | Password | Role   |
| -------------------- | -------- | ------ |
| admin@maddyblog.com  | admin123 | Admin  |
| author@maddyblog.com | user123  | Author |

### Available Scripts

| Command             | Description                            |
| ------------------- | -------------------------------------- |
| `npm run dev`       | Start development server               |
| `npm run build`     | Production build                       |
| `npm run start`     | Start production server                |
| `npm run lint`      | Run ESLint                             |
| `npm run test`      | Run tests                              |
| `npm run seed`      | Seed the database                      |
| `npm run db:studio` | Open Prisma Studio                     |
| `npm run db:reset`  | Reset database (drop + migrate + seed) |
| `npm run dev:cli`   | Dev CLI tool                           |
| `npm run storybook` | Start Storybook                        |

## Making Changes

### Branch Strategy

```bash
# Create a feature branch
git checkout -b feat/your-feature-name

# or for bug fixes
git checkout -b fix/your-bug-fix
```

### Commit Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add comment system
fix: resolve login redirect
docs: update API documentation
refactor: extract auth middleware
perf: optimize post queries
chore: update dependencies
test: add auth service tests
```

### Pull Request Process

1. Ensure your branch is up to date with `main`
2. Run `npm run lint` and `npm run typecheck` locally
3. Add tests for new functionality
4. Update documentation if needed
5. Create a PR with a clear title and description
6. Wait for CI checks to pass

### Coding Standards

- **TypeScript**: Strict mode enabled. Avoid `any`.
- **Imports**: Use `@/` path alias (e.g., `import { x } from "@/lib/x"`)
- **Components**: Prefer Server Components. Only use `"use client"` when necessary.
- **Data Fetching**: Use Server Components for data fetching. Keep API routes thin.
- **Error Handling**: Use the centralized error classes from `@/lib/errors`.
- **Validation**: All user input must be validated with Zod schemas.

### Testing

```bash
# Run all tests
npm run test

# Run with watch mode
npx vitest

# Run specific test file
npx vitest tests/unit/slug.test.ts
```

## Need Help?

Open an issue at https://github.com/Maddyrampant/maddyBlog/issues
