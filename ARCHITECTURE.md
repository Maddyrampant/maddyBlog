# maddyBlog — System Architecture

> **Step 1 of Vibe Coding workflow**  
> This document defines the full architecture before any implementation code is written.

---

## 1. System Overview

maddyBlog is a **monolithic Next.js application** with a **layered backend** and a **modular frontend**. Despite being deployed as a single process, the internal structure follows strict separation of concerns:

```
┌─────────────────────────────────────────────────┐
│                   Next.js App                    │
│  ┌───────────────────────────────────────────┐  │
│  │              App Router                   │  │
│  │  ┌──────────┐  ┌──────────┐  ┌────────┐  │  │
│  │  │  Pages   │  │  API     │  │ Server │  │  │
│  │  │  (RSC)   │  │  Routes  │  │Actions │  │  │
│  │  └────┬─────┘  └────┬─────┘  └────┬───┘  │  │
│  └───────┼──────────────┼─────────────┼──────┘  │
│          ▼              ▼             ▼          │
│  ┌───────────────────────────────────────────┐  │
│  │             Services Layer                │  │
│  │   (auth.service / post.service / etc.)    │  │
│  └────────────────┬──────────────────────────┘  │
│                   ▼                             │
│  ┌───────────────────────────────────────────┐  │
│  │             Prisma ORM                    │  │
│  │         (Repository Layer)                │  │
│  └────────────────┬──────────────────────────┘  │
│                   ▼                             │
│  ┌───────────────────────────────────────────┐  │
│  │             PostgreSQL                    │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

**Key principles:**
- Pages are **React Server Components** by default; client interactivity is opt-in via `'use client'`
- Business logic lives in **services**, never in pages or components
- Validation happens at the **service boundary** via Zod
- Database access is exclusively through **Prisma**
- Authentication uses **stateless JWT**, stored in httpOnly cookies

---

## 2. Folder Structure

```
maddyBlog/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Auto-generated migrations
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (public)/          # Route group — no layout nesting
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx              # /blog — paginated listing
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx          # /blog/:slug — single post
│   │   │   ├── categories/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx          # /categories/:slug
│   │   │   └── tags/
│   │   │       └── [slug]/
│   │   │           └── page.tsx          # /tags/:slug
│   │   │
│   │   ├── (admin)/           # Route group — admin layout
│   │   │   └── admin/
│   │   │       ├── layout.tsx            # Admin shell (auth guard)
│   │   │       ├── page.tsx              # Dashboard
│   │   │       ├── posts/
│   │   │       │   └── page.tsx          # Manage posts
│   │   │       └── comments/
│   │   │           └── page.tsx          # Moderate comments
│   │   │
│   │   ├── api/               # RESTful route handlers
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   └── register/route.ts
│   │   │   ├── posts/route.ts
│   │   │   ├── comments/route.ts
│   │   │   └── upload/route.ts
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   │
│   ├── components/            # Reusable UI components
│   │   ├── ui/                # Primitives (Button, Card, Input, etc.)
│   │   ├── blog/              # Blog-specific (PostCard, CommentList, etc.)
│   │   └── admin/             # Admin-specific (StatsCard, DataTable, etc.)
│   │
│   ├── features/              # Domain modules (future use)
│   │   ├── auth/
│   │   ├── posts/
│   │   ├── comments/
│   │   ├── categories/
│   │   └── tags/
│   │
│   ├── lib/                   # Shared utilities
│   │   ├── auth.ts            # JWT helpers (sign, verify, session)
│   │   ├── prisma.ts          # Singleton Prisma client
│   │   └── utils.ts           # Formatting, slugify, etc.
│   │
│   ├── services/              # Business logic layer
│   │   ├── auth.service.ts
│   │   ├── post.service.ts
│   │   └── comment.service.ts
│   │
│   ├── validations/           # Zod schemas
│   │   ├── auth.ts
│   │   ├── post.ts
│   │   └── comment.ts
│   │
│   ├── types/                 # Shared TypeScript types
│   │   └── index.ts
│   │
│   └── generated/             # Prisma client (auto-generated)
│       └── prisma/
│
├── .github/
│   ├── workflows/ci.yml
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
│
├── .env.example
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

**Why this structure:**
- **Route groups** (`(public)`, `(admin)`) let us apply different layouts without affecting URLs
- **Services** keep business logic out of pages, making it testable and reusable
- **Validations** are isolated so they can be shared between client and server
- **Features** directory is reserved for domain-specific modules as the app grows

---

## 3. Domain Model

### Core Entities

```
┌──────────┐     ┌──────────┐     ┌────────────┐
│   User   │────→│   Post   │←────│  Category  │
└──────────┘     └──────────┘     └────────────┘
       │               │
       │               │
       ▼               ▼
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Comment  │←────│   Post   │────→│   Tag    │
└──────────┘     │   Tags   │     └──────────┘
                  └──────────┘
```

### Entity Descriptions

| Entity | Attributes | Description |
|---|---|---|
| **User** | id, name, email, password, role, image, timestamps | Can be `USER` or `ADMIN`. Has many posts and comments. |
| **Post** | id, title, slug (unique), content, excerpt, coverImage, published, featured, authorId, categoryId, timestamps | Belongs to one User and one Category. Has many Tags and Comments. |
| **Category** | id, name (unique), slug (unique), timestamps | Has many Posts. |
| **Tag** | id, name (unique), slug (unique), timestamps | Many-to-many with Posts. |
| **Comment** | id, content, approved, authorId, postId, parentId (nullable), timestamps | Belongs to User and Post. Self-referential for nested replies. |

### Relationships

```
User    1 ─── N Post
User    1 ─── N Comment
Post    1 ─── N Comment
Post    N ─── 1 Category
Post    N ─── N Tag
Comment 1 ─── N Comment (self-referencing for nested replies)
```

---

## 4. Database Design

### Tables

**User**
| Column | Type | Constraints |
|---|---|---|
| id | String (CUID) | PK |
| name | String? | |
| email | String | UNIQUE, NOT NULL |
| password | String | NOT NULL |
| role | Enum (USER, ADMIN) | DEFAULT 'USER' |
| image | String? | |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Post**
| Column | Type | Constraints |
|---|---|---|
| id | String (CUID) | PK |
| title | String | NOT NULL |
| slug | String | UNIQUE, NOT NULL |
| content | String | NOT NULL |
| excerpt | String? | |
| coverImage | String? | |
| published | Boolean | DEFAULT false |
| featured | Boolean | DEFAULT false |
| authorId | String | FK → User.id |
| categoryId | String? | FK → Category.id |
| createdAt | DateTime | INDEX |
| updatedAt | DateTime | |

**Category**
| Column | Type | Constraints |
|---|---|---|
| id | String (CUID) | PK |
| name | String | UNIQUE, NOT NULL |
| slug | String | UNIQUE, NOT NULL |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Tag**
| Column | Type | Constraints |
|---|---|---|
| id | String (CUID) | PK |
| name | String | UNIQUE, NOT NULL |
| slug | String | UNIQUE, NOT NULL |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Comment**
| Column | Type | Constraints |
|---|---|---|
| id | String (CUID) | PK |
| content | String | NOT NULL |
| approved | Boolean | DEFAULT false |
| authorId | String | FK → User.id |
| postId | String | FK → Post.id, INDEX |
| parentId | String? | FK → Comment.id (self) |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Post-Tag** (implicit many-to-many via Prisma)
| Column | Type |
|---|---|
| postId | String (FK) |
| tagId | String (FK) |

### Indexes

- `Post.slug` — unique index for fast slug lookup
- `Post.published + Post.createdAt` — composite index for listing published posts
- `Comment.postId` — index for fetching comments by post
- `Category.slug`, `Tag.slug` — unique indexes for URL lookups

---

## 5. Backend Architecture

### Layer Diagram

```
Request (HTTP / Server Action)
        │
        ▼
┌───────────────────┐
│  Route Handler    │  — thin, delegates to service
│  or Server Action │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Service Layer    │  — business logic, validation, authorization
│  (post.service)   │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Prisma ORM       │  — database access (repository)
│  (prisma.post.*)  │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  PostgreSQL       │
└───────────────────┘
```

### API Layer

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/auth/register` | POST | — | Create account |
| `/api/auth/login` | POST | — | Sign in, set JWT cookie |
| `/api/posts` | GET | — | List published posts |
| `/api/posts` | POST | Required | Create post |
| `/api/comments` | POST | Required | Create comment |
| `/api/upload` | POST | Required | Upload image |

**Server Actions** are preferred for mutations within pages (e.g., admin CRUD). Route handlers exist for external API consumers.

### Service Layer

Each service:
1. **Validates** input using Zod
2. **Authorizes** the action (checks role / ownership)
3. **Processes** the business logic
4. **Persists** via Prisma
5. **Returns** typed response

Example contract:

```
post.service.createPost(input, authorId) → Post
post.service.getPublishedPosts(page, pageSize) → { posts, total }
auth.service.loginUser(input) → { id, name, email, role }
auth.service.registerUser(input) → { id, name, email }
```

### Validation

- All external input is validated through **Zod schemas** before reaching business logic
- Schemas live in `src/validations/` and are framework-agnostic
- Errors are thrown as `ZodError` and caught by the calling layer
- No raw `any` types cross the service boundary

---

## 6. Frontend Architecture

### Pages

| Route | Type | Description |
|---|---|---|
| `/` | RSC | Homepage — featured posts, latest posts |
| `/blog` | RSC | Paginated blog listing with `searchParams.page` |
| `/blog/[slug]` | RSC | Single post with comments |
| `/categories/[slug]` | RSC | Posts filtered by category |
| `/tags/[slug]` | RSC | Posts filtered by tag |
| `/admin` | RSC (guarded) | Dashboard with stats |
| `/admin/posts` | RSC (guarded) | Manage posts |
| `/admin/comments` | RSC (guarded) | Moderate comments |

### Component Tree (Conceptual)

```
RootLayout
├── PublicLayout (implicit via route group)
│   ├── Header (logo, nav)
│   ├── BlogPage
│   │   ├── PostCard[]
│   │   │   ├── PostMeta (author, date, category)
│   │   │   └── TagBadge[]
│   │   └── Pagination
│   ├── PostPage
│   │   ├── PostHeader (title, meta, tags)
│   │   ├── PostContent (Markdown rendered as HTML)
│   │   └── CommentSection
│   │       ├── CommentForm (client component)
│   │       └── CommentTree[]
│   │           └── CommentCard
│   └── Footer
│
├── AdminLayout
│   ├── AdminSidebar
│   ├── Dashboard (stats cards)
│   ├── PostList
│   │   └── PostRow[]
│   └── CommentList
│       └── CommentRow[]
```

### State Management

- **Server state**: Handled by React Server Components — data is fetched directly and passed down
- **Client state**: Minimal — only interactive UI state (form inputs, modals, toggles)
- **No global state library**: Next.js Server Components + `useActionState` for forms covers the needs
- **Cache invalidation**: `revalidatePath()` and `revalidateTag()` after mutations

---

## 7. Authentication Flow

### Registration

```
Client                    Server                    Database
  │                         │                         │
  │  POST /api/auth/register│                         │
  │  { email, password }    │                         │
  │────────────────────────►│                         │
  │                         │  Zod validate input     │
  │                         │  Check email unique     │
  │                         │  Hash password (bcrypt) │
  │                         │  Create User            │
  │                         │────────────────────────►│
  │                         │  User created           │
  │                         │◄────────────────────────│
  │                         │  Sign JWT (userId, role)│
  │                         │  Set httpOnly cookie    │
  │  { user, token }        │                         │
  │◄────────────────────────│                         │
```

### Login

Same flow minus user creation. The JWT payload contains:

```json
{
  "userId": "clx...",
  "email": "user@example.com",
  "role": "ADMIN",
  "iat": 1719000000,
  "exp": 1719604800
}
```

### Protected Routes

- **API routes**: Check `verifySession()` at the start of each handler; return 401 if invalid
- **Admin pages**: Call `requireAdmin()` inside the Server Component — redirects to `/` if unauthorized
- **JWT verification**: Happens synchronously via `jose.jwtVerify()` — no database round trip
- **Cookie**: httpOnly, secure in production, `SameSite=Lax`, 7-day expiry

### Logout

Delete the session cookie → client is immediately unauthenticated.

---

## 8. Data Flow Example — Creating a Blog Post

```
1. Admin fills form in browser
        │
2. Form submit triggers Server Action (or POST /api/posts)
        │
3. Server Action:
   a. Calls verifySession() to get user context
   b. Calls createPostService(input, userId)
        │
4. createPostService:
   a. Parses input with createPostSchema (Zod)
   b. Slugifies the title
   c. Runs prisma.post.create({
        data: {
          title,
          slug,
          content,
          excerpt,
          coverImage,
          published,
          featured,
          authorId,
          categoryId,
          tags: { connect: tagIds }
        }
      })
   d. Returns created post
        │
5. Server Action calls revalidatePath('/admin/posts')
   and revalidatePath('/blog')
        │
6. Next.js re-renders affected pages
        │
7. Client receives response and sees updated post list
```

---

## 9. Future Scalability

### Short-term (Current Architecture)

- Add more **Server Actions** for admin CRUD
- Implement **image upload** to cloud storage (S3 / Cloudflare R2)
- Add **RSS feed** via `app/rss.xml/route.ts`
- Add **sitemap** via `app/sitemap.ts`
- Implement **full-text search** with PostgreSQL `tsvector` or pgvector

### Medium-term

- **Split into feature modules** using the `features/` directory structure
- Add **caching** with `'use cache'` and `cacheLife` profiles for read-heavy pages
- Implement **rate limiting** on auth endpoints
- Add **email notifications** for new comments
- Implement **content scheduling** (publish_at field)

### Long-term

- **Extract services into a separate NestJS or Hono backend** if the monolith becomes too large
- **Add a CDN layer** for static assets and cached API responses
- **Implement a plugin system** for extending blog functionality
- **Add GraphQL** if the API grows complex enough to warrant it
- **Horizontal scaling** by moving sessions to Redis and making the app stateless

### Architectural Decisions That Enable Scaling

| Decision | Why it scales |
|---|---|
| Services are pure functions | Easy to extract into microservices later |
| Validations are separated | Can be shared with client-side or separate API |
| Prisma is the only DB access | Swap to any SQL database or add read replicas |
| JWT is stateless | No session store needed; horizontal scaling is trivial |
| RSC by default | Minimizes client JS; reduces frontend complexity |
| Route groups | Layouts can change without affecting URL structure |
