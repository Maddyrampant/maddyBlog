import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL ?? "";
const adapter = new PrismaPg(connectionString);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.comment.deleteMany();
  await prisma.postTag.deleteMany();
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  // ── Users ──
  const adminHash = await bcrypt.hash("admin123", 12);
  const userHash = await bcrypt.hash("user123", 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@maddyblog.com",
      username: "admin",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });

  const author = await prisma.user.create({
    data: {
      email: "author@maddyblog.com",
      username: "sarah_dev",
      passwordHash: userHash,
      role: "USER",
    },
  });

  const commenter = await prisma.user.create({
    data: {
      email: "reader@maddyblog.com",
      username: "tech_reader",
      passwordHash: userHash,
      role: "USER",
    },
  });

  console.log("  ✓ Users created");

  // ── Categories ──
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "TypeScript", slug: "typescript", description: "TypeScript deep dives and best practices" } }),
    prisma.category.create({ data: { name: "Next.js", slug: "nextjs", description: "Building with Next.js" } }),
    prisma.category.create({ data: { name: "Architecture", slug: "architecture", description: "System design and software architecture" } }),
    prisma.category.create({ data: { name: "DevOps", slug: "devops", description: "Deployment, CI/CD, and infrastructure" } }),
  ]);

  const [ts, next, arch, devops] = categories;
  console.log("  ✓ Categories created");

  // ── Tags ──
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: "React", slug: "react" } }),
    prisma.tag.create({ data: { name: "Prisma", slug: "prisma" } }),
    prisma.tag.create({ data: { name: "PostgreSQL", slug: "postgresql" } }),
    prisma.tag.create({ data: { name: "Testing", slug: "testing" } }),
    prisma.tag.create({ data: { name: "Performance", slug: "performance" } }),
    prisma.tag.create({ data: { name: "Security", slug: "security" } }),
  ]);

  const [react, prismaTag, pg, , perf, security] = tags;
  console.log("  ✓ Tags created");

  // ── Posts ──
  const posts = [
    {
      title: "Building Scalable Applications with Next.js 16",
      slug: "building-scalable-apps-nextjs-16",
      excerpt: "Learn how to leverage Next.js 16's new features to build production-grade applications that scale.",
      content: `<p>Next.js 16 introduces several groundbreaking features that make building scalable applications easier than ever.</p>
<h2 id="app-router">App Router Architecture</h2>
<p>The App Router provides a powerful file-based routing system with nested layouts, loading states, and error boundaries built in.</p>
<h2 id="server-components">React Server Components</h2>
<p>Server Components allow you to render components on the server, reducing the JavaScript bundle sent to the client.</p>
<h2 id="caching">Advanced Caching</h2>
<p>Next.js 16 includes sophisticated caching strategies including ISR, static generation, and incremental caching.</p>`,
      coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-06-15"),
      categoryId: next.id,
      tagIds: [react.id, perf.id],
      authorId: author.id,
    },
    {
      title: "TypeScript Patterns for Clean Architecture",
      slug: "typescript-patterns-clean-architecture",
      excerpt: "Explore proven TypeScript patterns that enforce clean architecture principles in your projects.",
      content: `<p>Clean architecture is about separating concerns and making your codebase maintainable over time.</p>
<h2 id="repository-pattern">Repository Pattern</h2>
<p>The Repository pattern abstracts data access behind an interface, making your code database-agnostic.</p>
<h2 id="dependency-injection">Dependency Injection</h2>
<p>TypeScript's type system makes dependency injection natural and type-safe.</p>
<h2 id="value-objects">Value Objects</h2>
<p>Encapsulate primitive types into meaningful domain objects with built-in validation.</p>`,
      coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=630&fit=crop",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-06-10"),
      categoryId: ts.id,
      tagIds: [react.id],
      authorId: admin.id,
    },
    {
      title: "Prisma ORM: From Zero to Production",
      slug: "prisma-orm-zero-to-production",
      excerpt: "A comprehensive guide to using Prisma ORM in production applications with PostgreSQL.",
      content: `<p>Prisma ORM has become the go-to choice for TypeScript developers working with databases.</p>
<h2 id="getting-started">Getting Started</h2>
<p>Setting up Prisma with PostgreSQL is straightforward with the new driver adapter approach.</p>
<h2 id="schema-design">Schema Design</h2>
<p>Design your database schema with Prisma's declarative syntax and leverage migrations.</p>
<h2 id="performance">Performance Tips</h2>
<p>Optimize your queries with proper indexing, selective includes, and batch operations.</p>`,
      coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&h=630&fit=crop",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-06-05"),
      categoryId: arch.id,
      tagIds: [prismaTag.id, pg.id, perf.id],
      authorId: author.id,
    },
    {
      title: "Understanding PostgreSQL Indexing Strategies",
      slug: "postgresql-indexing-strategies",
      excerpt: "Deep dive into PostgreSQL indexing to supercharge your database queries.",
      content: `<p>Proper indexing is the single most impactful optimization you can make for database performance.</p>
<h2 id="btree">B-Tree Indexes</h2>
<p>The default and most versatile index type in PostgreSQL.</p>
<h2 id="gin">GIN Indexes</h2>
<p>Ideal for full-text search and array columns.</p>`,
      coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-05-28"),
      categoryId: devops.id,
      tagIds: [pg.id, perf.id],
      authorId: admin.id,
    },
    {
      title: "JWT Authentication Best Practices",
      slug: "jwt-authentication-best-practices",
      excerpt: "Implement secure JWT-based authentication in your Next.js applications.",
      content: `<p>JSON Web Tokens remain one of the most popular authentication mechanisms for modern web apps.</p>
<h2 id="token-structure">Token Structure</h2>
<p>Understanding the JWT format and what to store in claims.</p>
<h2 id="refresh-tokens">Refresh Token Rotation</h2>
<p>Implement secure refresh token rotation to prevent token theft.</p>`,
      status: "DRAFT" as const,
      publishedAt: null,
      categoryId: ts.id,
      tagIds: [security.id],
      authorId: author.id,
    },
  ];

  for (const post of posts) {
    const { tagIds, ...postData } = post;
    const created = await prisma.post.create({
      data: {
        ...postData,
        tags: {
          create: tagIds.map((tagId) => ({ tagId })),
        },
      },
    });
    console.log(`  ✓ Post created: ${created.title}`);
  }

  // ── Comments ──
  const publishedPosts = await prisma.post.findMany({ where: { status: "PUBLISHED" } });

  if (publishedPosts.length > 0) {
    const root1 = await prisma.comment.create({
      data: {
        content: "Great article! The section on App Router really helped me understand the new paradigm.",
        postId: publishedPosts[0].id,
        authorId: commenter.id,
      },
    });

    await prisma.comment.create({
      data: {
        content: "Thanks! I'm glad it was helpful. Let me know if you have any questions.",
        postId: publishedPosts[0].id,
        authorId: author.id,
        parentId: root1.id,
      },
    });

    await prisma.comment.create({
      data: {
        content: "Can you elaborate on the caching strategies? I'd love to learn more about ISR.",
        postId: publishedPosts[0].id,
        authorId: commenter.id,
        parentId: root1.id,
      },
    });

    if (publishedPosts.length > 1) {
      await prisma.comment.create({
        data: {
          content: "This is exactly what I needed. The clean architecture patterns are spot on.",
          postId: publishedPosts[1].id,
          authorId: commenter.id,
        },
      });
    }
  }

  console.log("  ✓ Comments created");
  console.log("\n✅ Seed complete!");
  console.log("\n── Admin Credentials ──");
  console.log("  Email:    admin@maddyblog.com");
  console.log("  Password: admin123");
  console.log("\n── Author Credentials ──");
  console.log("  Email:    author@maddyblog.com");
  console.log("  Password: user123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
