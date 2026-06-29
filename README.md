<p align="center">
  <img src="https://img.shields.io/badge/Next.js%2016-1e1b2e?style=for-the-badge&logo=next.js&logoColor=c9a8e8" alt="Next.js 16"/>
  <img src="https://img.shields.io/badge/TypeScript-2d1b4e?style=for-the-badge&logo=typescript&logoColor=d4b8ff" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind%20CSS-1a1a3e?style=for-the-badge&logo=tailwindcss&logoColor=a8d8ea" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Prisma-1b1226?style=for-the-badge&logo=prisma&logoColor=e8a8d8" alt="Prisma"/>
  <img src="https://img.shields.io/badge/PostgreSQL-0d1b2a?style=for-the-badge&logo=postgresql&logoColor=a8c8e8" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Tiptap-1e122a?style=for-the-badge&logo=tiptap&logoColor=e8b8d8" alt="Tiptap"/>
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/Maddyrampant/maddyBlog?style=flat-square&color=f472b6" alt="License"/>
  <img src="https://img.shields.io/github/last-commit/Maddyrampant/maddyBlog?style=flat-square&color=c084fc" alt="Last Commit"/>
  <img src="https://img.shields.io/github/stars/Maddyrampant/maddyBlog?style=flat-square&color=facc15" alt="Stars"/>
  <img src="https://img.shields.io/badge/status-active-a78bfa?style=flat-square" alt="Status"/>
</p>

<h1 align="center">🌙 maddyBlog</h1>

<p align="center">
  <b>a dark, lovely blogging platform</b><br/>
  <sub>dokhtouraneh · gentle · type‑safe · production‑ready</sub>
</p>

<p align="center">
  <a href="#features">features</a>
  ·
  <a href="#quick-start">quick start</a>
  ·
  <a href="#tech-stack">tech stack</a>
  ·
  <a href="#project-structure">structure</a>
</p>

<br/>

---

<br/>

## overview

**maddyBlog** is an open‑source blogging platform with a **dark, dokhtouraneh soul** and a **lovely heart**.  
Built from the ground up with Next.js 16, TypeScript, and PostgreSQL — every piece is modular, type‑safe, and designed to scale.

> ✦ modular · maintainable · production‑ready ✦

<br/>

---

## features

|                            |                                                                                     |
| -------------------------- | ----------------------------------------------------------------------------------- |
| 📝 **Rich‑Text Editor**    | Tiptap‑powered editor with slash commands, image upload, live preview, and autosave |
| 🔐 **Auth System**         | JWT (jose) with httpOnly cookies, bcrypt, role‑based (USER / ADMIN)                 |
| 🏷️ **Categories & Tags**   | Organize content with PostTag many‑to‑many                                          |
| 💬 **Nested Comments**     | Threaded discussions with reply trees + in‑memory rate limiting                     |
| 🌐 **SEO Optimized**       | Dynamic OG/Twitter metadata, JSON‑LD, sitemap.xml, RSS feed                         |
| 🔍 **Full‑Text Search**    | PostgreSQL `to_tsvector` / `to_tsquery` across title + content                      |
| 📈 **Trending Algorithm**  | views × 0.6 + comments × 0.4 + recency boost                                        |
| ❤️ **Reactions**           | Like / Fire / Clap with toggle                                                      |
| 🔖 **Bookmarks**           | Save posts for later                                                                |
| 👁️ **View Tracking**       | Granular PostView analytics (visitorHash, referrer, userAgent)                      |
| 📊 **Analytics Dashboard** | recharts charts, traffic sources, top posts table                                   |
| 📧 **Newsletter**          | Email subscription with rate limiting                                               |
| ⏱️ **Reading Time**        | Estimated reading time on every post                                                |
| 👥 **Follow System**       | Follow/unfollow with unique constraints                                             |
| 🔔 **Notifications**       | Follow, comment, reaction, mention notifications                                    |
| 📰 **Activity Feed**       | Timeline of followed users' actions                                                 |
| 👤 **Profile Pages**       | `/users/[username]` with bio, avatar, post list                                     |
| 🎛️ **Admin Dashboard**     | Sidebar with posts, comments, analytics                                             |
| 📱 **Responsive**          | Looks stunning on every screen, dark by default                                     |
| 🐳 **Docker**              | Multi‑stage Alpine build + docker‑compose with PostgreSQL 16                        |
| 🧪 **Tested**              | Vitest, ESLint, TypeScript strict mode                                              |
| 📚 **Storybook**           | Component documentation                                                             |
| 🚀 **CI/CD**               | GitHub Actions — lint → typecheck → build on push/PR                                |

<br/>

---

## tech stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,typescript,react,tailwind,postgres,prisma" />
</p>

| Layer             | Technology                                                   |
| ----------------- | ------------------------------------------------------------ |
| 🎨 **Frontend**   | Next.js 16 · TypeScript · React 19 · TailwindCSS             |
| ⚙️ **Backend**    | REST API Routes + Server Components                          |
| 🗄️ **Database**   | PostgreSQL · Prisma ORM v7 (driver adapters)                 |
| ✍️ **Editor**     | Tiptap (Slash commands, image upload, live preview)          |
| ✅ **Validation** | Zod v4                                                       |
| 🔐 **Auth**       | JWT via `jose` · bcryptjs · httpOnly cookies                 |
| 📊 **Charts**     | recharts                                                     |
| 🧹 **Dev Tools**  | ESLint · Prettier · Husky · lint‑staged · Vitest · Storybook |
| 🐳 **Deploy**     | Docker · docker‑compose · GitHub CI                          |

<br/>

---

## project structure

```
maddyBlog/
├── prisma/                    # Schema, migrations & seed
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (admin)/           #  Admin dashboard + analytics
│   │   ├── api/               #  REST routes (auth, posts, comments,
│   │   │                      #   search, reactions, bookmarks, follow,
│   │   │                      #   notifications, feed, analytics, upload)
│   │   ├── posts/             #  Public blog pages (ISR)
│   │   ├── categories/        #  Category pages (ISR)
│   │   ├── tags/              #  Tag pages (ISR)
│   │   ├── search/            #  Search page (dynamic)
│   │   └── users/             #  Profile pages
│   ├── components/
│   │   ├── blog/              #  PostCard, CommentForm, SearchBar, ...
│   │   ├── editor/            #  Tiptap editor, toolbar, slash commands
│   │   ├── admin/             #  Admin UI components
│   │   ├── social/            #  FollowButton, NotificationBell, ActivityFeed
│   │   └── seo/               #  StructuredData (JSON‑LD)
│   ├── features/              #  Domain modules (auth, post, comment)
│   ├── services/              #  Business logic (blog, search, analytics,
│   │                          #   trending, traffic, social, notification, feed)
│   ├── lib/                   #  prisma, jwt, errors, logger, rateLimit,
│   │                          #   env, seo, rss, readingTime, mentions
│   ├── cli/                   #  Developer CLI tool
│   └── stories/               #  Storybook stories
├── tests/                     #  Vitest unit tests
├── docs/                      #  Architecture & development docs
└── .github/                   #  CI & issue templates
```

<br/>

---

## quick start

```bash
# clone
git clone https://github.com/Maddyrampant/maddyBlog.git
cd maddyBlog

# install
npm install

# setup env
cp .env.example .env

# generate prisma client
npx prisma generate

# run migrations (needs PostgreSQL)
npx prisma migrate dev

# seed (optional)
npm run seed

# start ✨
npm run dev
```

> needs a PostgreSQL instance — set `DATABASE_URL` in `.env`

<br/>

---

## environment

```env
DATABASE_URL=postgresql://user:password@localhost:5432/maddyblog
JWT_SECRET=your-super-secret-key-change-in-production
NEXT_PUBLIC_APP_URL=http://localhost:3000
LOG_LEVEL=info
```

<br/>

---

## scripts

| command             | does                     |
| ------------------- | ------------------------ |
| `npm run dev`       | start development server |
| `npm run build`     | production build         |
| `npm run lint`      | lint all files           |
| `npm run test`      | run Vitest tests         |
| `npm run seed`      | seed database            |
| `npm run db:studio` | open Prisma Studio       |
| `npm run dev:cli`   | developer CLI tool       |
| `npm run storybook` | start Storybook          |

<br/>

---

## license

**MIT** — see [LICENSE](LICENSE)

<br/>

---

<p align="center">
  <sub>🌙 built with a dokhtouraneh soul and a lovely heart</sub>
  <br/>
  <sub>Maddyrampant © 2026</sub>
</p>
