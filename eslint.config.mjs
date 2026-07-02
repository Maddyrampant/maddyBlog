// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    ".storybook/**",
    "src/stories/Button*",
    "src/stories/Header*",
    "src/stories/Page*",
    "src/stories/Configure.mdx",
    // Agent / tooling config - not project source
    ".opencode/**",
    "**/.opencode/**",
  ]),
  ...storybook.configs["flat/recommended"]
]);

export default eslintConfig;
