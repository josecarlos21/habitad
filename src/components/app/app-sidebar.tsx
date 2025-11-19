
"use client";

import {
  Home,
  CreditCard,
  Wrench,
  ShieldCheck,
  Building2,
  Settings,
  Bell,
  HelpCircle,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebar } from "@/components/providers/sidebar-provider";
import {
  Sheet,
  SheetContent,
  SheetHeader
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const mainNavItems = [
  { href: "/dashboard", icon: Home, label: "Inicio" },
  { href: "/notificaciones", icon: Bell, label: "Notificaciones" },
  { href: "/comunidad", icon: Building2, label: "Comunidad" },
  { href: "/servicios", icon: Wrench, label: "Servicios" },
  { href: "/pagos", icon: CreditCard, label: "Pagos" },
  { href: "/accesos", icon: ShieldCheck, label: "Accesos" },
];

const helpNavItems = [
  { href: "/whatsapp-guide", icon: MessageCircle, label: "Guía WhatsApp" },
  { href: "/faq", icon: HelpCircle, label: "FAQ" },
  { href: "/settings", icon: Settings, label: "Ajustes" },
];

function NavLink({
  item,
  isCollapsed,
}: {
  item: (typeof mainNavItems)[0];
  isCollapsed: boolean;
}) {
  const pathname = usePathname();
  const isActive =
    item.href === "/dashboard"
      ? pathname === item.href
      : pathname.startsWith(item.href);

  const linkContent = (
    <>
      <item.icon
        className={cn(
          "h-6 w-6 shrink-0",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
      />
      <span
        className={cn(
          "truncate transition-all duration-300 ease-in-out",
          isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
        )}
      >
        {item.label}
      </span>
    </>
  );

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Link
          href={item.href}
          className={cn(
            "flex items-center gap-4 rounded-lg px-4 py-3 transition-colors duration-200",
            isActive
              ? "bg-primary/10 text-primary"
              : "hover:bg-muted"
          )}
        >
          {linkContent}
        </Link>
      </TooltipTrigger>
      {isCollapsed && (
        <TooltipContent
          side="right"
          className="bg-background text-foreground"
        >
          <p>{item.label}</p>
        </TooltipContent>
      )}
    </Tooltip>
  );
}

function SidebarContent() {
    const { isCollapsed } = useSidebar();
    return (
        <div className="flex h-full flex-col">
          <SheetHeader className="h-16 flex-shrink-0 px-4">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Icons.logo className="h-6 w-6 text-primary" />
                <span className={cn("text-lg font-semibold transition-opacity duration-300", isCollapsed ? "opacity-0" : "opacity-100")}>
                    Habitat
                </span>
              </Link>
          </SheetHeader>
          <nav className="flex-1 space-y-2 px-4 py-4">
            {mainNavItems.map((item) => (
              <NavLink key={item.href} item={item} isCollapsed={isCollapsed} />
            ))}
          </nav>
          <div className="border-t p-4 space-y-2">
             {helpNavItems.map((item) => (
              <NavLink key={item.href} item={item} isCollapsed={isCollapsed} />
            ))}
          </div>
        </div>
    )
}


export function AppSidebar() {
  const { isSidebarOpen, setSidebarOpen } = useSidebar();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-shrink-0 border-r md:block">
        <SidebarContent />
    </aside>
  );
}
