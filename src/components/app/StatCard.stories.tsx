import type { Meta, StoryObj } from "@storybook/nextjs";
import { StatCard } from "./stat-card";
import { CreditCard } from "lucide-react";

const meta: Meta<typeof StatCard> = {
  title: "App/StatCard",
  component: StatCard,
  parameters: {
    layout: "centered",
  },
  args: {
    title: "Saldo pendiente",
    description: "Adeudos y cuotas extras",
    value: "$4,900",
    trendLabel: "2 facturas",
    icon: CreditCard,
  },
};

export default meta;
type Story = StoryObj<typeof StatCard>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const WithFooter: Story = {
  args: {
    footer: <span>Próximo vencimiento: 15 Nov</span>,
  },
};
