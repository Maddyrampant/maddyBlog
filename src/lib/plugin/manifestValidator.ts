import { z } from "zod";

const HookTypeSchema = z.enum(["data", "ui", "api", "ai"]);

const PluginPermissionSchema = z.enum([
  "READ_POST",
  "WRITE_POST",
  "DELETE_POST",
  "READ_USER",
  "WRITE_USER",
  "MANAGE_COMMENTS",
  "SEND_EMAIL",
  "ACCESS_ANALYTICS",
  "MANAGE_PLUGINS",
]);

const PluginManifestSchema = z.object({
  name: z
    .string()
    .min(1, "Plugin name is required")
    .max(64, "Plugin name must be at most 64 characters")
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Plugin name must be kebab-case (e.g., 'my-plugin')",
    ),
  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, "Version must be semver (e.g., '1.0.0')"),
  description: z.string().max(500).optional().default(""),
  author: z.string().max(128).optional().default(""),
  permissions: z.array(PluginPermissionSchema).optional().default([]),
  hooks: z.array(HookTypeSchema).optional().default([]),
  icon: z.string().optional(),
});

export type ValidatedManifest = z.infer<typeof PluginManifestSchema>;

export function validateManifest(
  input: unknown,
):
  | { success: true; data: ValidatedManifest }
  | { success: false; error: z.ZodError } {
  const result = PluginManifestSchema.safeParse(input);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}
