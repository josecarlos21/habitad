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

export default function LoginPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Accede a tu condominio</CardTitle>
        <CardDescription>
          Ingresa tu correo o teléfono para recibir un código de acceso.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo o teléfono</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              required
              autoFocus
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full" asChild>
          <Link href="/dashboard">Enviar código</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
