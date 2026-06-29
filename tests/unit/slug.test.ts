import { describe, it, expect } from "vitest";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

describe("slugify", () => {
  it("converts a title to a slug", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("handles special characters", () => {
    expect(slugify("TypeScript 101: Guide")).toBe("typescript-101-guide");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  Extra   spaces  ")).toBe("extra-spaces");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });
});
