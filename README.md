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
  <br/>⚡ Lovly. Modular. Production‑ready.
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

| | |
|---|---|
| 📝 **Blog Posts** | Full Markdown support, publishing workflow |
| 🏷️ **Categories & Tags** | Organize content with ease |
| 🌐 **SEO Optimized** | Metadata, sitemap, RSS — all built‑in |
| 💬 **Comments** | Nested threads with moderation |
| 🎛️ **Admin Dashboard** | Manage everything in one place |
| 🖼️ **Image Uploads** | Drag & drop, ready for CDN |
| 🔍 **Search** | Full‑text search across posts |
| 📄 **Pagination** | Butter‑smooth browsing |
| 📱 **Responsive** | Looks stunning on every screen |

<br/>

## 🛠 Tech Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,typescript,react,tailwind,postgres,prisma" />
</p>

| Layer | Technology |
|---|---|
| 🎨 **Frontend** | Next.js 16 · TypeScript · React 19 · TailwindCSS |
| ⚙️ **Backend** | Server Actions · API Routes |
| 🗄️ **Database** | PostgreSQL · Prisma ORM (v7) |
| ✅ **Validation** | Zod |
| 🔐 **Auth** | JWT · jose · bcryptjs |
| 🧹 **Dev Tools** | ESLint · TypeScript strict · GitHub CI |

<br/>

## 🗂️ Project Structure

```
maddyBlog/
├── prisma/                  # Schema & migrations
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (public)/        #  Blog pages
│   │   ├── (admin)/         #  Admin dashboard
│   │   └── api/             #  Route handlers
│   ├── components/          #  Reusable UI
│   │   ├── ui/              #  Primitives
│   │   ├── blog/            #  Blog components
│   │   └── admin/           #  Admin components
│   ├── features/            #  Domain modules
│   ├── services/            #  Business logic
│   ├── validations/         #  Zod schemas
│   ├── lib/                 #  Utilities
│   └── types/               #  TypeScript types
└── .github/                 #  CI & templates
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
```

<br/>

## 🧠 Development Philosophy

This project dances to the rhythm of **Vibe Coding**:

```
①  Architecture first   →  ②  Database design
③  Core systems        →  ④  Feature implementation
⑤  Production polish
```

Every layer is **modular**, every component is **clean**. No shortcuts. No spaghetti.

<br/>

## 🗺️ Roadmap

- [ ] Rich‑text editor (TipTap / Plate)
- [ ] Full‑text search (pgvector)
- [ ] Content scheduling
- [ ] Analytics dashboard
- [ ] Plugin system
- [ ] Multi‑author workspace
- [ ] Newsletter & RSS

<br/>

## 🤝 Contributing

Contributions are **warmly welcomed**.

1. **Fork** the repo
2. Create a branch: `git checkout -b feat/amazing-feature`
3. **Commit**: `git commit -m "feat: add amazing feature"`
4. **Push**: `git push origin feat/amazing-feature`
5. Open a **Pull Request** 🚀

<br/>

## 📜 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for details.

<br/>

---

<p align="center">
  <sub>✨ built with 🩷 & TypeScript · Maddyrampant © 2026 ✨</sub>
</p>
