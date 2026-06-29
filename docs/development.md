# Development Guide

## Quick Start

```bash
npm install
cp .env.example .env   # Edit with your DB credentials
npx prisma generate --generator client
npx prisma migrate dev
npm run seed
npm run dev
```

Visit http://localhost:3000

## Available Scripts

| Script                                     | Description                    |
| ------------------------------------------ | ------------------------------ |
| `npm run dev`                              | Start Next.js dev server       |
| `npm run build`                            | Production build               |
| `npm run start`                            | Start production server        |
| `npm run lint`                             | Run ESLint across all files    |
| `npm run typecheck`                        | TypeScript type check          |
| `npm run test`                             | Run Vitest tests               |
| `npm run test:watch`                       | Tests in watch mode            |
| `npm run seed`                             | Seed database with sample data |
| `npm run db:studio`                        | Open Prisma Studio GUI         |
| `npm run db:reset`                         | Drop, migrate, and re-seed     |
| `npm run dev:cli seed`                     | Dev CLI — seed database        |
| `npm run dev:cli reset-db`                 | Dev CLI — reset database       |
| `npm run dev:cli generate-slug "My Title"` | Convert title to slug          |
| `npm run dev:cli studio`                   | Open Prisma Studio             |
| `npm run storybook`                        | Start Storybook (port 6006)    |
| `npm run build-storybook`                  | Build Storybook static         |

## Environment Variables

| Variable              | Required | Description                       |
| --------------------- | -------- | --------------------------------- |
| `DATABASE_URL`        | Yes      | PostgreSQL connection string      |
| `JWT_SECRET`          | Yes      | Secret key for JWT (min 16 chars) |
| `NEXT_PUBLIC_APP_URL` | Yes      | Public URL of the app             |
| `LOG_LEVEL`           | No       | Log level (default: info)         |

## CLI Tool

```bash
npm run dev:cli <command>

Commands:
  seed             Run database seed
  reset-db         Drop tables + migrate + seed
  generate-slug    "My Title" → "my-title"
  studio           Open Prisma Studio
  help             Show help
```

## Testing

```bash
# Run all tests
npm run test

# Watch mode
npx vitest

# Single file
npx vitest tests/unit/slug.test.ts

# Coverage
npx vitest --coverage
```

## Storybook

```bash
npm run storybook
```

Opens at http://localhost:6006

## Docker

```bash
# Start services
docker compose up -d

# Run migrations
docker compose --profile migrate run migrate

# View logs
docker compose logs -f app
```

## Project Conventions

- **File naming**: kebab-case for files, PascalCase for components
- **Imports**: Use `@/` alias (maps to `src/`)
- **Components**: Server Components by default
- **Client Components**: Only when interactivity needed (forms, buttons)
- **CSS**: TailwindCSS utility classes
- **Validation**: Zod schemas in `src/validations/`
- **Error handling**: Use `AppError` classes from `src/lib/errors.ts`
- **Logging**: Use `logger` from `src/lib/logger.ts`
