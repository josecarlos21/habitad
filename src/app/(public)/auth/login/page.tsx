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

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Accede a tu condominio</CardTitle>
        <CardDescription>
          Ingresa tu correo o teléfono para recibir un código de acceso.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo o teléfono</Label>
              <Input
                id="email"
                type="email"
                placeholder="residente@habitat.com"
                required
                autoFocus
                defaultValue="residente@habitat.com"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" type="submit">Enviar código</Button>
          <Button variant="link" size="sm" className="text-muted-foreground" asChild>
            <Link href="/auth">Volver a opciones</Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
