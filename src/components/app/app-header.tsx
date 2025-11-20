
"use client";

import { Button } from "../ui/button";
import Link from "next/link";
import { useCondoUser } from "@/hooks/use-condo-user";
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
import { LanguageToggle } from "./language-toggle";
import { Menu, Bell, LogOut } from "lucide-react";
import { useSidebar } from "../providers/sidebar-provider";
import { LiveClock } from "./live-clock";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export function AppHeader() {
  const { user } = useCondoUser();
  const { toggleSidebar } = useSidebar();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    if (!auth) return;
    signOut(auth).then(() => {
      router.push('/auth/login');
    });
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
         <Button
          variant="outline"
          size="icon"
          className="shrink-0 md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
        <Link href="/dashboard" className="hidden items-center gap-2 md:flex">
          <Icons.logo className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">
            Habitat <span className="font-light text-muted-foreground">Conectado</span>
          </span>
        </Link>
      </div>
      
      <div className="flex w-full items-center justify-end gap-2 md:ml-auto md:gap-4">
        <LiveClock />
        <div className="hidden items-center gap-2 md:flex">
          <LanguageToggle />
        </div>

        <Button variant="ghost" size="icon" asChild>
            <Link href="/notificaciones">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notificaciones</span>
            </Link>
        </Button>

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
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
