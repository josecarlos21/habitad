
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CreditCard,
  Wrench,
  Calendar,
  Users,
  MessageCircle,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Inicio" },
  { href: "/comunidad", icon: Building2, label: "Comunidad" },
  { href: "/servicios", icon: Wrench, label: "Servicios" },
  { href: "/pagos", icon: CreditCard, label: "Pagos" },
  { href: "/accesos", icon: ShieldCheck, label: "Accesos" },
];

export function BottomNavBar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    // Make 'Inicio' active only on dashboard, not on sub-paths
    if (path === '/dashboard') {
        return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t bg-background/95 p-2 shadow-[0_-1px_10px_rgba(0,0,0,0.1)] backdrop-blur-sm md:hidden">
      <div className="grid grid-cols-5 gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
              isActive(item.href)
                ? "bg-primary/10 text-primary"
                : ""
            )}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
