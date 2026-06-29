import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ReadingTime from "@/components/blog/ReadingTime";

const meta: Meta<typeof ReadingTime> = {
  title: "Blog/ReadingTime",
  component: ReadingTime,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ReadingTime>;

export const FiveMinutes: Story = {
  args: { minutes: 5 },
};

export const OneMinute: Story = {
  args: { minutes: 1 },
};

export const LongRead: Story = {
  args: { minutes: 15 },
};
