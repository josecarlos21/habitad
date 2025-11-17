import type { Meta, StoryObj } from "@storybook/nextjs";
import { PageHeader } from "./page-header";
import { Button } from "@/components/ui/button";

const meta: Meta<typeof PageHeader> = {
  title: "App/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "centered",
  },
  args: {
    title: "Mi perfil",
    description: "Actualiza tus datos personales y preferencias.",
  },
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    actions: <Button variant="ghost">Acción demo</Button>,
  },
};

export const WithHelpText: Story = {
  args: {
    helpText: "Los cambios se guardan automáticamente al enviar.",
  },
};
