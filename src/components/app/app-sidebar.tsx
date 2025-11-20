"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebar } from "../providers/sidebar-provider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { mainNavItems, helpNavItems, type NavItem } from "@/config/nav";

function NavLink({
  item,
  isCollapsed,
  closeSheet,
}: {
  item: NavItem;
  isCollapsed: boolean;
  closeSheet?: () => void;
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

  const linkProps = {
    href: item.href,
    onClick: closeSheet,
    className: cn(
      "flex items-center gap-4 rounded-lg px-4 py-3 transition-colors duration-200",
      isActive
        ? "bg-primary/10 text-primary"
        : "text-foreground hover:bg-muted"
    ),
  };

  if (isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link {...linkProps}>{linkContent}</Link>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="bg-background text-foreground"
        >
          <p>{item.label}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return <Link {...linkProps}>{linkContent}</Link>;
}

function NavLinks({ isCollapsed, closeSheet }: { isCollapsed: boolean, closeSheet?: () => void }) {
  return (
    <>
      <nav className="flex-1 space-y-2 px-4 py-4">
        {mainNavItems.map((item) => (
          <NavLink key={item.href} item={item} isCollapsed={isCollapsed} closeSheet={closeSheet}/>
        ))}
      </nav>
      <div className="border-t p-4 space-y-2">
        {helpNavItems.map((item) => (
          <NavLink key={item.href} item={item} isCollapsed={isCollapsed} closeSheet={closeSheet} />
        ))}
      </div>
    </>
  );
}

export function AppSidebar() {
  const { isSidebarOpen, setSidebarOpen } = useSidebar();
  const isMobile = useIsMobile();
  const isCollapsed = false; // For now, we don't implement collapse on desktop.

  const closeSheet = () => setSidebarOpen(false);

  if (isMobile) {
    return (
      <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0">
          <div className="flex h-full flex-col">
            <SheetHeader className="h-16 flex-shrink-0 items-center border-b px-4">
              <Link href="/dashboard" className="flex items-center gap-2" onClick={closeSheet}>
                <Icons.logo className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold">Habitat</span>
                <SheetTitle className="sr-only">Menú principal</SheetTitle>
              </Link>
            </SheetHeader>
            <NavLinks isCollapsed={false} closeSheet={closeSheet} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className={cn(
        "sticky top-0 hidden h-screen flex-shrink-0 border-r md:block transition-[width] duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}>
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-4">
            <Link href="/dashboard" className="flex items-center gap-2">
                <Icons.logo className="h-6 w-6 text-primary" />
                <span className={cn("text-lg font-semibold transition-opacity duration-300", isCollapsed ? "opacity-0" : "opacity-100")}>
                    Habitat
                </span>
              </Link>
          </div>
          <NavLinks isCollapsed={isCollapsed} />
        </div>
    </aside>
  );
}
