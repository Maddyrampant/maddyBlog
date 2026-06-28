# maddyBlog

A modern, scalable blogging platform built with **TypeScript** and designed for performance, clean architecture, and developer experience.

Repository: https://github.com/Maddyrampant/maddyBlog

---

## Overview

maddyBlog is an open-source blogging platform built with modern web technologies.
The goal of this project is to provide a clean, extensible blogging system that can scale from personal blogs to content platforms.

The project follows a **modular architecture** and prioritizes:

- Type safety
- Clean code
- Performance
- SEO optimization
- Developer experience

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), TypeScript, React 19, TailwindCSS |
| Backend | Next.js Server Actions / Route Handlers |
| Database | PostgreSQL + Prisma ORM |
| Validation | Zod |
| Auth | JWT (jsonwebtoken) |
| Dev Tools | ESLint, Prettier, GitHub CLI, Type-safe APIs |

---

## Features

- Blog post publishing with Markdown support
- Categories and tags for content organization
- SEO optimized pages (metadata, sitemap, RSS)
- Nested comment system with moderation
- Admin dashboard for content management
- Image uploads
- Full-text search
- Pagination
- Responsive design

---

## Project Structure

```
src/
  app/          # Next.js App Router pages and API routes
  components/   # Reusable UI components
  features/     # Domain-specific modules
  lib/          # Utilities and shared logic
  services/     # Business logic layer
  validations/  # Zod schemas
  types/        # TypeScript type definitions
  generated/    # Prisma client output
prisma/         # Database schema and migrations
```

---

## Getting Started

```bash
git clone https://github.com/Maddyrampant/maddyBlog.git
cd maddyBlog
npm install
cp .env.example .env
npm run dev
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `NEXT_PUBLIC_APP_URL` | Public application URL |

---

## Development Philosophy

This project follows a **Vibe Coding workflow** — development happens step-by-step:

1. Architecture first
2. Database design
3. Core systems
4. Feature implementation
5. Production optimization

Each system is designed to remain **modular and maintainable**.

---

## Roadmap

- Advanced rich-text editor
- Full-text search
- Content scheduling
- Analytics dashboard
- Plugin system
- Multi-author support

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License — see [LICENSE](LICENSE) for details.
