
"use client";

import { Button } from "../ui/button";
import { Home, CreditCard, Wrench, ShieldCheck, Building2, Menu } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/use-user";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Icons } from "../icons";
import { ThemeToggle } from "./theme-toggle";
import { LiveClock } from "./live-clock";
import { LanguageToggle } from "./language-toggle";
import { Separator } from "../ui/separator";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Inicio" },
  { href: "/comunidad", icon: Building2, label: "Comunidad" },
  { href: "/servicios", icon: Wrench, label: "Servicios" },
  { href: "/pagos", icon: CreditCard, label: "Pagos" },
  { href: "/accesos", icon: ShieldCheck, label: "Accesos" },
];

function MobileNav() {
    const pathname = usePathname();
    const isActive = (path: string) => {
        if (path === '/dashboard') {
            return pathname === path;
        }
        return pathname.startsWith(path);
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Abrir Menú</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <nav className="grid gap-4 text-lg font-medium mt-8">
                     {navItems.map((item) => (
                         <SheetClose asChild key={item.href}>
                            <Link
                                href={item.href}
                                className={cn(
                                "flex items-center gap-4 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                isActive(item.href) && "bg-muted text-primary"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        </SheetClose>
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    )
}

export function AppHeader() {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <MobileNav />
        <Link href="/dashboard" className="flex items-center gap-2">
          <Icons.logo className="h-6 w-6 text-primary" />
          <span className="hidden text-lg font-semibold md:block">
            Habitat <span className="font-light text-muted-foreground">Conectado</span>
          </span>
        </Link>
      </div>
      
      <div className="flex w-full items-center justify-end gap-2 md:ml-auto md:gap-4">
        <div className="hidden items-center gap-2 md:flex">
          <LiveClock />
          <Separator orientation="vertical" className="h-6" />
          <LanguageToggle />
        </div>
        <ThemeToggle />
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border-2 border-primary/50">
                  <AvatarImage src={user.imageUrl} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/perfil">Mi Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">Ajustes</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/auth/login">Cerrar sesión</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
