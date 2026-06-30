import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL ?? "";
const adapter = new PrismaPg(connectionString);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.slide.deleteMany();
  await prisma.story.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.reaction.deleteMany();
  await prisma.postView.deleteMany();
  await prisma.postAnalytics.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.postTag.deleteMany();
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  const hash = await bcrypt.hash("admin", 12);
  const userHash = await bcrypt.hash("user123", 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@maddyblog.com",
      username: "admin",
      passwordHash: hash,
      role: "ADMIN",
      bio: "Founder and lead developer at maddyBlog. Writing about code, architecture, and building products.",
      website: "https://maddyblog.com",
    },
  });

  const sarah = await prisma.user.create({
    data: {
      email: "sarah@maddyblog.com",
      username: "sarah_dev",
      passwordHash: userHash,
      role: "USER",
      bio: "Full-stack engineer passionate about TypeScript and React. Open source contributor.",
      website: "https://sarah.dev",
    },
  });

  const alex = await prisma.user.create({
    data: {
      email: "alex@maddyblog.com",
      username: "alex_codes",
      passwordHash: userHash,
      role: "USER",
      bio: "Backend specialist working with PostgreSQL and distributed systems.",
    },
  });

  const reader = await prisma.user.create({
    data: {
      email: "emma@maddyblog.com",
      username: "emma_reader",
      passwordHash: userHash,
      role: "USER",
      bio: "Software engineer and avid reader. Always learning.",
    },
  });

  const james = await prisma.user.create({
    data: {
      email: "james@maddyblog.com",
      username: "james_t",
      passwordHash: userHash,
      role: "USER",
    },
  });

  console.log("  ✓ 5 users created (admin/admin)");

  const categories = await Promise.all([
    prisma.category.create({ data: { name: "TypeScript", slug: "typescript", description: "TypeScript deep dives, patterns, and best practices" } }),
    prisma.category.create({ data: { name: "Next.js", slug: "nextjs", description: "Building modern web applications with Next.js" } }),
    prisma.category.create({ data: { name: "React", slug: "react", description: "React component patterns and ecosystem" } }),
    prisma.category.create({ data: { name: "Architecture", slug: "architecture", description: "System design and software architecture" } }),
    prisma.category.create({ data: { name: "DevOps", slug: "devops", description: "Deployment, CI/CD, Docker, and cloud infrastructure" } }),
    prisma.category.create({ data: { name: "Database", slug: "database", description: "Databases, query optimization, and data modeling" } }),
    prisma.category.create({ data: { name: "CSS", slug: "css", description: "Modern CSS, Tailwind, and design systems" } }),
  ]);

  const [ts, nextjs, reactCat, arch, devops, db, css] = categories;
  console.log("  ✓ 7 categories created");

  const tags = await Promise.all([
    prisma.tag.create({ data: { name: "Server Components", slug: "server-components" } }),
    prisma.tag.create({ data: { name: "Prisma", slug: "prisma" } }),
    prisma.tag.create({ data: { name: "PostgreSQL", slug: "postgresql" } }),
    prisma.tag.create({ data: { name: "Testing", slug: "testing" } }),
    prisma.tag.create({ data: { name: "Performance", slug: "performance" } }),
    prisma.tag.create({ data: { name: "Security", slug: "security" } }),
    prisma.tag.create({ data: { name: "Docker", slug: "docker" } }),
    prisma.tag.create({ data: { name: "Tailwind CSS", slug: "tailwind-css" } }),
    prisma.tag.create({ data: { name: "Authentication", slug: "authentication" } }),
    prisma.tag.create({ data: { name: "API Design", slug: "api-design" } }),
    prisma.tag.create({ data: { name: "State Management", slug: "state-management" } }),
    prisma.tag.create({ data: { name: "Accessibility", slug: "accessibility" } }),
  ]);

  const [sc, prismaTag, pg, testing, perf, security, docker, tw, auth, api, state, a11y] = tags;
  console.log("  ✓ 12 tags created");

  const postsData = [
    {
      title: "Building Scalable Applications with Next.js 16",
      slug: "building-scalable-apps-nextjs-16",
      excerpt: "Next.js 16 introduces the App Router, Server Components, and advanced caching. Here's how to use them in production.",
      content: `<p>Next.js 16 is a monumental release that changes how we think about building web applications. The new App Router architecture brings together the best of server-side rendering, static generation, and client-side interactivity in a unified model.</p>
<h2 id="app-router">The App Router Revolution</h2>
<p>The App Router replaces the old Pages Router with a more intuitive file-based routing system. Nested layouts, loading states, and error boundaries are now first-class citizens.</p>
<pre><code>app/
  layout.tsx        // Root layout
  page.tsx          // Home page
  blog/
    layout.tsx      // Blog layout
    page.tsx        // Blog index
    [slug]/
      page.tsx      // Blog post</code></pre>
<h2 id="server-components">React Server Components</h2>
<p>Server Components allow you to render components entirely on the server, reducing the JavaScript bundle sent to the browser. This means faster page loads and better SEO out of the box.</p>
<h2 id="caching">ISR and Caching</h2>
<p>Incremental Static Regeneration (ISR) allows you to update static content without rebuilding the entire site. Combined with the new caching layer, you get the best of both worlds: static speed with dynamic freshness.</p>`,
      coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-06-15"),
      categoryId: nextjs.id,
      tagIds: [sc.id, perf.id],
      authorId: admin.id,
    },
    {
      title: "TypeScript Patterns for Clean Architecture",
      slug: "typescript-patterns-clean-architecture",
      excerpt: "Learn how to apply clean architecture principles using TypeScript's type system for maintainable, testable code.",
      content: `<p>Clean Architecture, popularized by Robert C. Martin, is about separating concerns so that your business logic remains independent of frameworks, databases, and UI.</p>
<h2 id="repository">The Repository Pattern</h2>
<p>Repositories abstract data access behind an interface. Your business logic never needs to know whether data comes from PostgreSQL, Redis, or an in-memory store.</p>
<h2 id="dependency-injection">Dependency Injection</h2>
<p>TypeScript's structural typing makes DI natural. Define interfaces for your dependencies and let the runtime wire them together.</p>
<h2 id="value-objects">Value Objects</h2>
<p>Wrap primitive values in meaningful types with built-in validation. Email, Money, and DateRange are classic examples.</p>`,
      coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=630&fit=crop",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-06-10"),
      categoryId: ts.id,
      tagIds: [api.id, testing.id],
      authorId: sarah.id,
    },
    {
      title: "Prisma ORM: From Zero to Production",
      slug: "prisma-orm-zero-to-production",
      excerpt: "A complete guide to Prisma ORM with PostgreSQL — schema design, migrations, queries, and production best practices.",
      content: `<p>Prisma has become the standard ORM for TypeScript applications. Its declarative schema, type-safe queries, and powerful migrations make database work a pleasure.</p>
<h2 id="schema">Schema-First Design</h2>
<p>Define your data model in a single schema file, and Prisma generates the TypeScript types automatically. No more manual type definitions.</p>
<h2 id="migrations">Migration Workflow</h2>
<p>Prisma Migrate generates SQL migrations from your schema changes. Review them, apply them, and version control everything.</p>
<h2 id="queries">Type-Safe Queries</h2>
<p>Every query is fully typed. Autocomplete your way to correct database access with zero runtime errors.</p>`,
      coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&h=630&fit=crop",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-06-05"),
      categoryId: db.id,
      tagIds: [prismaTag.id, pg.id, perf.id],
      authorId: alex.id,
    },
    {
      title: "Understanding PostgreSQL Indexing Strategies",
      slug: "postgresql-indexing-strategies",
      excerpt: "Deep dive into B-tree, GIN, GiST, and BRIN indexes — and when to use each one for maximum query performance.",
      content: `<p>Indexes are the single most impactful performance optimization available in PostgreSQL. But using the wrong index type can be worse than having no index at all.</p>
<h2 id="btree">B-Tree: The Default Choice</h2>
<p>B-Tree indexes excel at equality and range queries. They're the default for a reason — they handle most use cases efficiently.</p>
<h2 id="gin">GIN: Full-Text Search and Arrays</h2>
<p>GIN (Generalized Inverted Index) is designed for composite types, arrays, and full-text search.</p>
<h2 id="brin">BRIN: Massive Tables</h2>
<p>Block Range INdexes are ideal for very large tables where data is naturally ordered (like timestamps).</p>`,
      coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-05-28"),
      categoryId: db.id,
      tagIds: [pg.id, perf.id],
      authorId: admin.id,
    },
    {
      title: "Modern CSS with Tailwind v4",
      slug: "modern-css-tailwind-v4",
      excerpt: "Tailwind CSS v4 introduces a new engine, CSS-first configuration, and powerful new utilities.",
      content: `<p>Tailwind CSS v4 is a ground-up rewrite that leverages modern CSS features for a smaller, faster, and more flexible styling experience.</p>
<h2 id="css-first">CSS-First Configuration</h2>
<p>Forget <code>tailwind.config.js</code>. Define your design tokens directly in CSS with <code>@theme</code> directives.</p>
<h2 id="new-engine">The New Engine</h2>
<p>The v4 engine uses Lightning CSS for blazing-fast builds and native CSS nesting support.</p>`,
      coverImage: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=1200&h=630&fit=crop",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-05-20"),
      categoryId: css.id,
      tagIds: [tw.id, perf.id],
      authorId: sarah.id,
    },
    {
      title: "JWT Authentication Best Practices",
      slug: "jwt-authentication-best-practices",
      excerpt: "Implement secure JWT authentication with refresh token rotation, httpOnly cookies, and CSRF protection.",
      content: `<p>JWT authentication remains one of the most popular choices for modern web applications. But implementation details matter for security.</p>
<h2 id="http-only">httpOnly Cookies</h2>
<p>Store your JWT in an httpOnly, Secure, SameSite cookie to prevent XSS attacks from stealing the token.</p>
<h2 id="refresh">Refresh Token Rotation</h2>
<p>Each refresh request issues a new refresh token and invalidates the old one. This limits the damage of a stolen refresh token.</p>`,
      coverImage: "https://images.unsplash.com/photo-1555949963-aa79d7e981b2?w=1200&h=630&fit=crop",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-05-15"),
      categoryId: arch.id,
      tagIds: [auth.id, security.id],
      authorId: admin.id,
    },
    {
      title: "Docker Compose for Full-Stack Development",
      slug: "docker-compose-fullstack-development",
      excerpt: "Set up a complete development environment with PostgreSQL, Redis, and your Next.js app using Docker Compose.",
      content: `<p>Docker Compose simplifies local development by running all your services in containers. No more "it works on my machine."</p>
<h2 id="compose-file">The Compose File</h2>
<p>Define your services — app, database, cache — in a single YAML file and start everything with one command.</p>`,
      coverImage: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1200&h=630&fit=crop",
      status: "DRAFT" as const,
      publishedAt: null,
      categoryId: devops.id,
      tagIds: [docker.id, pg.id],
      authorId: alex.id,
    },
    {
      title: "State Management in React 2026",
      slug: "state-management-react-2026",
      excerpt: "A look at the current state management landscape: Server State, URL State, and when you still need a client store.",
      content: `<p>The state management story in React has evolved dramatically. With Server Components, React Query, and built-in hooks, do you still need Redux?</p>
<h2 id="server-state">Server State</h2>
<p>Tools like TanStack Query and SWR handle server state synchronization effortlessly.</p>`,
      coverImage: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=1200&h=630&fit=crop",
      status: "DRAFT" as const,
      publishedAt: null,
      categoryId: reactCat.id,
      tagIds: [state.id, sc.id],
      authorId: admin.id,
    },
    {
      title: "Web Accessibility: A Practical Guide",
      slug: "web-accessibility-practical-guide",
      excerpt: "Make your web applications accessible to everyone with semantic HTML, ARIA, and keyboard navigation.",
      content: `<p>Accessibility (a11y) is not an afterthought — it's a fundamental aspect of web development that benefits all users.</p>
<h2 id="semantic-html">Semantic HTML</h2>
<p>Use the right elements for the right purpose. <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;article&gt;</code>, and <code>&lt;button&gt;</code> convey meaning to assistive technologies.</p>`,
      coverImage: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1200&h=630&fit=crop",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-05-10"),
      categoryId: css.id,
      tagIds: [a11y.id, testing.id],
      authorId: sarah.id,
    },
    {
      title: "REST API Design Guidelines",
      slug: "rest-api-design-guidelines",
      excerpt: "Design consistent, intuitive REST APIs with proper resource naming, pagination, error handling, and versioning.",
      content: `<p>A well-designed API is a joy to work with. Consistency and predictability matter more than following every rule to the letter.</p>
<h2 id="naming">Resource Naming</h2>
<p>Use plural nouns (<code>/users</code>, <code>/posts</code>), nest resources logically (<code>/users/123/posts</code>), and avoid verbs in URLs.</p>`,
      coverImage: "https://images.unsplash.com/photo-1515879218367-8466d910auj7?w=1200&h=630&fit=crop",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-04-28"),
      categoryId: arch.id,
      tagIds: [api.id, testing.id],
      authorId: admin.id,
    },
  ];

  for (const post of postsData) {
    const { tagIds, ...postData } = post;
    await prisma.post.create({
      data: {
        ...postData,
        tags: {
          create: tagIds.map((tagId) => ({ tagId })),
        },
      },
    });
    console.log(`  ✓ Post: ${post.title}`);
  }

  const publishedPosts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });

  const firstPost = publishedPosts[0];
  const secondPost = publishedPosts[1];
  const thirdPost = publishedPosts[2];

  if (firstPost) {
    const r1 = await prisma.comment.create({
      data: { content: "Excellent article! The App Router section clarified a lot of confusion I had about nested layouts. One question: how do you handle parallel routes with middleware?", postId: firstPost.id, authorId: reader.id },
    });
    await prisma.comment.create({
      data: { content: "Great question! Parallel routes work seamlessly with middleware — just make sure your middleware.ts returns the right response for each slot. I'll write a follow-up post on this.", postId: firstPost.id, authorId: admin.id, parentId: r1.id },
    });
    await prisma.comment.create({
      data: { content: "Can you share an example of the caching strategy in production? We've been using ISR but hit some edge cases with stale data.", postId: firstPost.id, authorId: james.id },
    });
    await prisma.comment.create({
      data: { content: "We use a hybrid approach: ISR for content pages with revalidate=60, and on-demand revalidation triggered by webhooks when data changes. Works great!", postId: firstPost.id, authorId: sarah.id, parentId: r1.id },
    });
    await prisma.comment.create({
      data: { content: "Really helpful, thanks for sharing!", postId: firstPost.id, authorId: reader.id },
    });
  }

  if (secondPost) {
    const r2 = await prisma.comment.create({
      data: { content: "I've been using the Repository pattern for years and it saved my team countless refactoring hours. Highly recommended!", postId: secondPost.id, authorId: alex.id },
    });
    await prisma.comment.create({
      data: { content: "Totally agree! The key is to keep the interfaces lean. Fat repositories are almost as bad as no repositories at all.", postId: secondPost.id, authorId: sarah.id, parentId: r2.id },
    });
    await prisma.comment.create({
      data: { content: "How do you handle transactions across multiple repositories?", postId: secondPost.id, authorId: james.id },
    });
    await prisma.comment.create({
      data: { content: "The Unit of Work pattern is the answer there. Wrap all repository operations in a single transaction context.", postId: secondPost.id, authorId: admin.id, parentId: r2.id },
    });
  }

  if (thirdPost) {
    await prisma.comment.create({
      data: { content: "Just migrated from TypeORM to Prisma and the developer experience is night and day. The type safety alone is worth the switch.", postId: thirdPost.id, authorId: james.id },
    });
    await prisma.comment.create({
      data: { content: "The migration workflow is my favorite part. Being able to review the SQL before applying it gives me so much confidence.", postId: thirdPost.id, authorId: reader.id },
    });
    await prisma.comment.create({
      data: { content: "Pro tip: use prisma db push during development and migrations for production. Best of both worlds.", postId: thirdPost.id, authorId: admin.id },
    });
  }

  if (publishedPosts[3]) {
    await prisma.comment.create({
      data: { content: "This saved me hours of research. The BRIN index tip was exactly what I needed for our time-series data.", postId: publishedPosts[3].id, authorId: reader.id },
    });
  }

  if (publishedPosts[4]) {
    await prisma.comment.create({
      data: { content: "Tailwind v4 is a game changer. The CSS-first configuration is so much cleaner than the old JS config.", postId: publishedPosts[4].id, authorId: james.id },
    });
    await prisma.comment.create({
      data: { content: "Agreed! I was skeptical at first but after trying it, I can't go back.", postId: publishedPosts[4].id, authorId: sarah.id, parentId: (await prisma.comment.findFirst({ where: { postId: publishedPosts[4].id } }))!.id },
    });
  }

  console.log("  ✓ 15+ comments created");

  const allPublishedPosts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true },
  });

  for (const post of allPublishedPosts) {
    await prisma.postView.create({
      data: { postId: post.id, visitorHash: "seed-" + post.id.slice(0, 8) },
    });
    await prisma.postAnalytics.create({
      data: { postId: post.id, date: new Date("2026-06-01"), views: Math.floor(Math.random() * 500) + 50, uniqueVisitors: Math.floor(Math.random() * 200) + 20, comments: Math.floor(Math.random() * 15) + 1, reactions: Math.floor(Math.random() * 80) + 5 },
    });
  }

  console.log("  ✓ View & analytics data created");

  await prisma.follow.createMany({
    data: [
      { followerId: reader.id, followingId: admin.id },
      { followerId: reader.id, followingId: sarah.id },
      { followerId: james.id, followingId: admin.id },
      { followerId: james.id, followingId: alex.id },
      { followerId: sarah.id, followingId: admin.id },
      { followerId: alex.id, followingId: admin.id },
      { followerId: alex.id, followingId: sarah.id },
    ],
  });

  console.log("  ✓ 7 follow relationships created");

  const publishedSlugs = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true, slug: true, coverImage: true, title: true },
  });

  const getPostId = (slug: string) => publishedSlugs.find((p) => p.slug.includes(slug))?.id;

  const storiesData = [
    { title: "New Release", imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&h=200&fit=crop", linkUrl: null, authorId: admin.id },
    { title: "DevOps Tips", imageUrl: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=200&h=200&fit=crop", linkUrl: "/categories/devops", authorId: alex.id },
    { title: "React 2026", imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=200&fit=crop", linkUrl: "/search?q=react", authorId: sarah.id },
    { title: "TypeScript", imageUrl: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=200&h=200&fit=crop", linkUrl: "/categories/typescript", authorId: admin.id },
    { title: "Database", imageUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=200&h=200&fit=crop", linkUrl: "/categories/database", authorId: alex.id },
  ];

  for (let i = 0; i < storiesData.length; i++) {
    await prisma.story.create({ data: { ...storiesData[i], order: i } });
  }
  console.log("  ✓ 5 stories created");

  const slidesData = [
    { title: "Building Scalable Applications with Next.js 16", subtitle: "The App Router revolution is here", imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1400&h=600&fit=crop", linkUrl: null, postId: getPostId("building-scalable"), active: true, order: 0 },
    { title: "TypeScript Patterns for Clean Architecture", subtitle: "Write maintainable, testable code", imageUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1400&h=600&fit=crop", linkUrl: null, postId: getPostId("typescript-patterns"), active: true, order: 1 },
    { title: "Modern CSS with Tailwind v4", subtitle: "CSS-first configuration and a brand new engine", imageUrl: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=1400&h=600&fit=crop", linkUrl: "/tags/tailwind-css", postId: null, active: true, order: 2 },
  ];

  for (const slide of slidesData) {
    await prisma.slide.create({ data: slide });
  }
  console.log("  ✓ 3 slides created");

  const buildingScalableId = getPostId("building-scalable");
  const typescriptPatternsId = getPostId("typescript-patterns");
  const jwtId = getPostId("jwt-authentication");

  if (buildingScalableId) {
    await prisma.post.update({ where: { id: buildingScalableId }, data: { isFeatured: true, featuredOrder: 0 } });
  }
  if (typescriptPatternsId) {
    await prisma.post.update({ where: { id: typescriptPatternsId }, data: { isFeatured: true, featuredOrder: 1 } });
  }
  if (jwtId) {
    await prisma.post.update({ where: { id: jwtId }, data: { isFeatured: true, featuredOrder: 2 } });
  }
  console.log("  ✓ 3 featured posts assigned");

  console.log("\n✅ Seed complete!");
  console.log("\n─── Login ───");
  console.log("  Email:    admin@maddyblog.com");
  console.log("  Username: admin");
  console.log("  Password: admin");
  console.log("\n── Other Users ──");
  console.log("  sarah_dev / user123");
  console.log("  alex_codes / user123");
  console.log("  emma_reader / user123");
  console.log("  james_t / user123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
