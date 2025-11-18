"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Home,
  CreditCard,
  Wrench,
  Calendar,
  UserCheck,
  Package,
  Users,
  Bell,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUser } from "@/hooks/use-user";
import { SheetTitle } from "../ui/sheet";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Inicio" },
  { href: "/pagos", icon: CreditCard, label: "Pagos" },
  { href: "/mantenimiento", icon: Wrench, label: "Mantenimiento" },
  { href: "/reservas", icon: Calendar, label: "Reservas" },
  { href: "/visitantes", icon: UserCheck, label: "Visitantes" },
  { href: "/paqueteria", icon: Package, label: "Paquetería" },
  { href: "/avisos", icon: Bell, label: "Avisos" },
  { href: "/asambleas", icon: Users, label: "Asambleas" },
];

const secondaryNavItems = [
  { href: "/perfil", icon: User, label: "Mi Perfil" },
  { href: "/settings", icon: Settings, label: "Ajustes" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <Sidebar variant="inset" collapsible="icon">
        <SheetTitle className="sr-only">Menú de Navegación</SheetTitle>
      <SidebarHeader className="hidden md:flex">
         <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2">
                <Icons.logo className="h-6 w-6 text-primary" />
                <div className="flex flex-col text-left">
                    <h1 className="text-lg font-semibold text-sidebar-foreground">Habitat</h1>
                    <p className="text-xs text-muted-foreground">Conectado</p>
                </div>
            </Link>
        </div>
      </SidebarHeader>

      <SidebarMenu className="flex-1 p-2">
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
             <SidebarMenuButton
              asChild
              isActive={isActive(item.href)}
              tooltip={item.label}
            >
              <Link href={item.href}>
                <item.icon className="size-5" />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      <Separator className="my-2" />
      
      <SidebarFooter>
        <SidebarMenu className="p-2">
           {secondaryNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon className="size-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
             <SidebarMenuButton tooltip="Cerrar sesión" asChild>
                <Link href="/auth/login">
                    <LogOut className="size-5" />
                    <span>Cerrar sesión</span>
                </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <Separator className="my-2 hidden md:block" />

        {user && (
          <div className="hidden items-center gap-3 p-2 md:flex">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.imageUrl} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                  <p className="font-semibold truncate text-sidebar-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.units[0].tower}-{user.units[0].number}</p>
              </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
