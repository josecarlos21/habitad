"use client";

import { AppSidebar } from "@/components/app/app-sidebar";
import { EmptyState } from "@/components/app/empty-state";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useSession } from "@/hooks/use-session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const { session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.replace("/auth/login");
    }
  }, [session.status, router]);

  if (session.status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Verificando tu acceso...</p>
        </div>
      </div>
    );
  }

  if (session.status !== "authenticated") {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <EmptyState
          icon={Loader2}
          title="Estamos dirigiéndote al acceso"
          description="Si no eres redirigido automáticamente, regresa al inicio de sesión desde el menú principal."
        />
      </main>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
