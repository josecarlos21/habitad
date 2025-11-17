"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/icons";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";

export default function SplashPage() {
  const router = useRouter();
  const { session } = useSession();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (hasRedirected) return;
    if (session.status === "authenticated") {
      setHasRedirected(true);
      router.replace("/dashboard");
      return;
    }
    if (session.status === "pending") {
      setHasRedirected(true);
      router.replace("/auth/register");
      return;
    }
    if (session.status === "unauthenticated") {
      const timer = setTimeout(() => {
        router.replace("/auth");
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [session.status, router, hasRedirected]);

  const statusCopy = useMemo(() => {
    switch (session.status) {
      case "authenticated":
        return {
          title: `Hola, ${session.user?.name.split(" ")[0] ?? "residente"}`,
          description: "Estamos preparando tu panel con la información más reciente.",
        };
      case "pending":
        return {
          title: "Tu registro está en revisión",
          description:
            session.pendingMessage ??
            "Nuestro equipo de administración verificará tus datos antes de darte acceso.",
        };
      case "checking":
        return {
          title: "Verificando tu acceso seguro",
          description: "Sincronizando con tu condominio...",
        };
      default:
        return {
          title: "Habitat Conectado",
          description: "Te daremos acceso en un momento.",
        };
    }
  }, [session]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="relative flex flex-col items-center">
        <div className="absolute -top-8 right-10 hidden animate-pulse rounded-full bg-primary/10 p-3 text-primary sm:block">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <Icons.logo className="h-16 w-16 text-primary" />
        <h1 className="mt-4 text-4xl font-bold">
          Habitat <span className="font-light text-muted-foreground">Conectado</span>
        </h1>
      </div>

      <div>
        <p className="text-xl font-semibold">{statusCopy.title}</p>
        <p className="mt-2 text-muted-foreground">{statusCopy.description}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="secondary"
          onClick={() => router.push("/auth")}
          disabled={session.status === "checking"}
        >
          Ir al acceso
        </Button>
        <Button
          variant="ghost"
          onClick={() => router.push("/auth/login")}
          className="text-muted-foreground"
        >
          {!hasRedirected && session.status === "checking" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Validando
            </>
          ) : (
            "Usar otra cuenta"
          )}
        </Button>
      </div>
    </div>
  );
}
