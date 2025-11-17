import type { Meta, StoryObj } from "@storybook/nextjs";
import { EmptyState } from "./empty-state";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

const meta: Meta<typeof EmptyState> = {
  title: "App/EmptyState",
  component: EmptyState,
  parameters: {
    layout: "centered",
  },
  args: {
    icon: Inbox,
    title: "Sin elementos",
    description: "No encontramos información con los filtros actuales.",
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    action: <Button>Crear elemento</Button>,
  },
};
