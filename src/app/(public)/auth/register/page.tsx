
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
        router.push("/dashboard");
    }, 1500);
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Crea tu cuenta</CardTitle>
        <CardDescription>
          Ingresa tus datos para registrarte en la plataforma.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleRegister}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                placeholder="Juan Pérez"
                required
                autoFocus
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                required
                disabled={isLoading}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="unit-code">Código de Unidad</Label>
              <Input
                id="unit-code"
                placeholder="Ej: A-101"
                required
                disabled={isLoading}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading && <Spinner size="sm" className="mr-2" />}
            {isLoading ? "Registrando..." : "Registrarme"}
          </Button>
           <Button variant="link" size="sm" className="text-muted-foreground" asChild>
            <Link href="/auth">Volver a opciones</Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
