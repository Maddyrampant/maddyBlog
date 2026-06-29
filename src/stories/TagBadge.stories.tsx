import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import TagBadge from "@/components/blog/TagBadge";

const meta: Meta<typeof TagBadge> = {
  title: "Blog/TagBadge",
  component: TagBadge,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TagBadge>;

export const Default: Story = {
  args: { name: "React", slug: "react" },
};

export const Multiple: Story = {
  render: () => (
    <div className="flex gap-2">
      <TagBadge name="TypeScript" slug="typescript" />
      <TagBadge name="Next.js" slug="nextjs" />
      <TagBadge name="Prisma" slug="prisma" />
    </div>
  ),
};
