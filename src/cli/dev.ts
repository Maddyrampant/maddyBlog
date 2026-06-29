import { execSync } from "child_process";

const command = process.argv[2];

function printHelp() {
  console.log(`
📦 maddyBlog Dev CLI

Usage:
  npm run dev:cli <command>

Commands:
  seed          Run database seed
  reset-db      Drop all tables and re-run migrations + seed
  create-admin  Prompt to create a new admin user
  generate-slug <title>  Convert a title to a URL-friendly slug
  studio        Open Prisma Studio
  help          Show this help
`);
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  switch (command) {
    case "seed":
      console.log("🌱 Running seed...");
      execSync("npx prisma db seed", { stdio: "inherit" });
      break;

    case "reset-db":
      console.log("⚠️  Resetting database...");
      execSync("npx prisma migrate reset --force", { stdio: "inherit" });
      console.log("🌱 Running seed...");
      execSync("npx prisma db seed", { stdio: "inherit" });
      break;

    case "create-admin":
      console.log(
        "👤 Create admin user (not implemented — use prisma/seed.ts)",
      );
      break;

    case "generate-slug": {
      const title = process.argv.slice(3).join(" ");
      if (!title) {
        console.error(
          '❌ Please provide a title: npm run dev:cli generate-slug "My Post Title"',
        );
        process.exit(1);
      }
      console.log(generateSlug(title));
      break;
    }

    case "studio":
      execSync("npx prisma studio", { stdio: "inherit" });
      break;

    case "help":
    default:
      printHelp();
      break;
  }
}

main().catch((err) => {
  console.error("❌ CLI error:", err.message);
  process.exit(1);
});
