<p align="center">
  <img src="https://img.shields.io/badge/Next.js%2016-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 16"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma"/>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white" alt="Zod"/>
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/Maddyrampant/maddyBlog?style=flat-square&color=f472b6" alt="License"/>
  <img src="https://img.shields.io/github/last-commit/Maddyrampant/maddyBlog?style=flat-square&color=fb923c" alt="Last Commit"/>
  <img src="https://img.shields.io/github/stars/Maddyrampant/maddyBlog?style=flat-square&color=eab308" alt="Stars"/>
  <img src="https://img.shields.io/badge/status-active-22c55e?style=flat-square" alt="Status"/>
</p>

<h1 align="center">🌸 maddy Blog</h1>

<p align="center">
  <b>A modern, bleeding‑edge blogging platform</b><br/>
  built with love, TypeScript, and the best of the Next.js ecosystem.
  <br/>⚡ Modular. Maintainable. Production‑ready.
</p>

<p align="center">
  <a href="https://github.com/Maddyrampant/maddyBlog">📦 Repository</a>
  ·
  <a href="#features">✨ Features</a>
  ·
  <a href="#quick-start">🚀 Quick Start</a>
  ·
  <a href="#tech-stack">🛠 Tech Stack</a>
</p>

<br/>

---

<br/>

## 💎 Overview

**maddyBlog** is an open‑source blogging platform that blends **clean architecture** with **modern design**. From personal diaries to content platforms — it scales beautifully.

> Built to be **fast**, **type‑safe**, and **an absolute joy** to work with.

<p align="center">
  <code>✦ modular · maintainable · production‑ready ✦</code>
</p>

<br/>

## ✨ Features

|                          |                                                 |
| ------------------------ | ----------------------------------------------- |
| 📝 **Blog Posts**        | Full Markdown support, publishing workflow      |
| 🏷️ **Categories & Tags** | Organize content with ease                      |
| 🌐 **SEO Optimized**     | Metadata, sitemap, RSS, JSON-LD — all built‑in  |
| 💬 **Nested Comments**   | Threaded discussions with reply trees           |
| 🎛️ **Admin Dashboard**   | Manage posts, comments, and stats in one place  |
| 🔍 **Full‑Text Search**  | PostgreSQL full‑text search across posts        |
| 📈 **Trending Posts**    | Algorithm based on views, comments, and recency |
| 🔖 **Bookmarks**         | Save posts for later reading                    |
| ❤️ **Reactions**         | Like, Fire, and Clap reactions on posts         |
| 📧 **Newsletter**        | Email subscription system with rate limiting    |
| 🏷️ **Popular Tags**      | Discover trending topics                        |
| 👁️ **View Tracking**     | Automatic post view analytics                   |
| ⏱️ **Reading Time**      | Estimated reading time on every post            |
| 📄 **Pagination**        | Butter‑smooth browsing                          |
| 📱 **Responsive**        | Looks stunning on every screen                  |
| 🧪 **Tested**            | Vitest unit tests for core utilities            |
| 📚 **Storybook**         | Component documentation and visual testing      |
| 🐳 **Docker**            | Multi‑stage build + docker‑compose              |

<br/>

## 🛠 Tech Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,typescript,react,tailwind,postgres,prisma" />
</p>

| Layer             | Technology                                                   |
| ----------------- | ------------------------------------------------------------ |
| 🎨 **Frontend**   | Next.js 16 · TypeScript · React 19 · TailwindCSS             |
| ⚙️ **Backend**    | API Routes (REST)                                            |
| 🗄️ **Database**   | PostgreSQL · Prisma ORM (v7)                                 |
| ✅ **Validation** | Zod                                                          |
| 🔐 **Auth**       | JWT · jose · bcryptjs · httpOnly cookies                     |
| 🧹 **Dev Tools**  | ESLint · Prettier · Husky · lint‑staged · Vitest · Storybook |
| 🐳 **Deploy**     | Docker · docker‑compose · GitHub CI                          |

<br/>

## 🗂️ Project Structure

```
maddyBlog/
├── prisma/                  # Schema, migrations & seed
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (admin)/         #  Admin dashboard
│   │   ├── api/             #  REST route handlers
│   │   └── posts/           #  Public blog pages
│   ├── cli/                 #  Developer CLI tool
│   ├── components/          #  Reusable UI
│   │   ├── blog/            #  Blog components
│   │   ├── admin/           #  Admin components
│   │   └── seo/             #  SEO components
│   ├── features/            #  Domain modules (auth, post, comment)
│   ├── services/            #  Business logic layer
│   ├── validations/         #  Zod schemas
│   ├── lib/                 #  Utilities (JWT, env, errors, etc.)
│   ├── stories/             #  Storybook stories
│   └── types/               #  TypeScript types
├── tests/                   #  Vitest unit tests
├── docs/                    #  Architecture & development docs
└── .github/                 #  CI & issue templates
```

<br/>

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/Maddyrampant/maddyBlog.git
cd maddyBlog

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npm run seed

# Start the dev server
npm run dev
```

> **Note:** You'll need a PostgreSQL instance running. Set `DATABASE_URL` in `.env`.

<br/>

## 🔐 Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/maddyblog
JWT_SECRET=your-super-secret-key-change-in-production
NEXT_PUBLIC_APP_URL=http://localhost:3000
LOG_LEVEL=info
```

<br/>

## 🧪 Testing

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Type check
npm run typecheck
```

<br/>

## 🎨 Storybook

```bash
npm run storybook
```

<br/>

## 🐳 Docker

```bash
# Build and run with PostgreSQL
docker compose up --build

# Run migrations
docker compose run --rm migrate
```

<br/>

## 📦 Available Scripts

| Script              | Description                    |
| ------------------- | ------------------------------ |
| `npm run dev`       | Start development server       |
| `npm run build`     | Production build               |
| `npm run start`     | Start production server        |
| `npm run test`      | Run Vitest tests               |
| `npm run seed`      | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio             |
| `npm run db:reset`  | Reset and re‑seed database     |
| `npm run dev:cli`   | Developer CLI tool             |
| `npm run typecheck` | TypeScript type checking       |
| `npm run storybook` | Start Storybook                |
| `npm run lint`      | Lint all files                 |

<br/>

## 🗺️ Roadmap

- [ ] Rich‑text editor (TipTap / Plate)
- [ ] Analytics dashboard
- [ ] Content scheduling
- [ ] Multi‑author workspace
- [ ] Image upload with CDN
- [ ] Plugin system
- [ ] i18n support

<br/>

## 🤝 Contributing

Contributions are **warmly welcomed**.

1. **Fork** the repo
2. Create a branch: `git checkout -b feat/amazing-feature`
3. **Commit**: `git commit -m "feat: add amazing feature"`
4. **Push**: `git push origin feat/amazing-feature`
5. Open a **Pull Request** 🚀

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

<br/>

## 📜 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for details.

<br/>

---

<p align="center">
  <sub>✨ built with 🩷 & TypeScript · Maddyrampant © 2026 ✨</sub>
</p>
