import {
  Home,
  CreditCard,
  Wrench,
  ShieldCheck,
  Building2,
  Settings,
  Bell,
  HelpCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
}

export const mainNavItems: NavItem[] = [
  { href: "/dashboard", icon: Home, label: "Inicio" },
  { href: "/notificaciones", icon: Bell, label: "Notificaciones" },
  { href: "/comunidad", icon: Building2, label: "Comunidad" },
  { href: "/servicios", icon: Wrench, label: "Servicios" },
  { href: "/pagos", icon: CreditCard, label: "Pagos" },
  { href: "/accesos", icon: ShieldCheck, label: "Accesos" },
];

export const helpNavItems: NavItem[] = [
  { href: "/faq", icon: HelpCircle, label: "FAQ" },
  { href: "/perfil", icon: Settings, label: "Mi Perfil" }
];
