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
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the registration logic
    // For now, we'll just redirect to the dashboard
    router.push("/dashboard");
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                required
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="unit-code">Código de Unidad</Label>
              <Input
                id="unit-code"
                placeholder="Ej: A-101"
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" type="submit">Registrarme</Button>
           <Button variant="link" size="sm" className="text-muted-foreground" asChild>
            <Link href="/auth">Volver a opciones</Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
