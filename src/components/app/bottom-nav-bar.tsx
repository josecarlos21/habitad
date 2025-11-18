
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CreditCard,
  Wrench,
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
    if (path === '/dashboard') {
        return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-4 left-1/2 z-20 w-[90%] max-w-md -translate-x-1/2 rounded-full border bg-background/80 p-2 shadow-lg backdrop-blur-sm md:hidden">
      <div className="grid grid-cols-5 gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
              isActive(item.href)
                ? "bg-primary/10 text-primary"
                : ""
            )}
          >
            <item.icon className="h-6 w-6" />
            <span className="sr-only text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
