# Architecture

maddyBlog follows a **Controller → Service → Repository** layered architecture.

## Layers

```
Route (page/api)  →  Controller  →  Service  →  Repository  →  Prisma  →  PostgreSQL
```

1. **Routes** (`src/app/`) — Next.js App Router pages and API route handlers
2. **Controllers** (`src/features/*/`) — Request parsing, response formatting, auth checks
3. **Services** — Business logic, validation, orchestration
4. **Repositories** (`src/features/*/`) — Data access via Prisma
5. **Prisma** (`src/lib/prisma.ts`) — Database client singleton

## Folder Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (admin)/            # Admin route group
│   ├── api/                # API route handlers
│   ├── categories/[slug]/
│   ├── posts/[slug]/
│   ├── search/
│   ├── tags/[slug]/
│   ├── rss/                # RSS feed endpoint
│   ├── sitemap.ts          # Dynamic sitemap
│   ├── error.tsx           # Global error boundary
│   ├── not-found.tsx       # 404 page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/
│   ├── blog/               # Blog UI components
│   ├── seo/                # SEO components (StructuredData)
│   └── [admin]/            # Admin components
├── features/
│   ├── auth/               # Authentication (login, register, middleware)
│   ├── post/               # Post CRUD
│   └── comment/            # Comment system
├── services/
│   └── blogService.ts      # Public blog queries
├── lib/
│   ├── prisma.ts           # Prisma client singleton
│   ├── jwt.ts              # JWT session management (jose)
│   ├── hash.ts             # bcrypt password hashing
│   ├── slug.ts             # URL slug generation
│   ├── seo.ts              # SEO metadata utilities
│   ├── rss.ts              # RSS feed generator
│   ├── errors.ts           # Standardized error classes
│   ├── logger.ts           # Structured logging (pino)
│   ├── rateLimit.ts        # In-memory rate limiter
│   ├── env.ts              # Environment validation (Zod)
│   └── utils.ts            # General utilities
├── validations/            # Zod schemas
├── types/                  # TypeScript types
├── generated/prisma/       # Prisma client (auto-generated)
├── cli/                    # Dev CLI tools
└── proxy.ts                # Security headers proxy
```

## Data Flow

1. User requests a URL → Next.js routes to the matching page or API route
2. Server Component / Route Handler calls Service
3. Service validates input (Zod), applies business logic
4. Service calls Repository for data access
5. Repository queries Prisma
6. Response flows back up

## Caching Strategy

| Page       | Strategy | Revalidation |
| ---------- | -------- | ------------ |
| Homepage   | ISR      | 60s          |
| Post       | ISR      | 300s         |
| Category   | ISR      | 120s         |
| Tag        | ISR      | 120s         |
| Search     | Dynamic  | —            |
| Admin      | Dynamic  | —            |
| API Routes | Dynamic  | —            |
