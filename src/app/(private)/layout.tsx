
"use client";

import { AppHeader } from "@/components/app/app-header";
import { AppSidebar } from "@/components/app/app-sidebar";
import { SidebarProvider } from "@/components/providers/sidebar-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <TooltipProvider delayDuration={0}>
        <div className="group/sidebar flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300 ease-in-out">
          <AppHeader />
          <div className="flex flex-1">
            <AppSidebar />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
}
