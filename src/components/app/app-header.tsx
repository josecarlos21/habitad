"use client";

import { useSidebar } from "../ui/sidebar";
import { Button } from "../ui/button";
import { Menu, Moon, Sun } from "lucide-react";
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


export function AppHeader() {
  const { toggleSidebar } = useSidebar();
  const { user, isLoading } = useUser();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
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
                <Avatar className="h-10 w-10">
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
