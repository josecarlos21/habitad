import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function AuthPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Bienvenido</CardTitle>
        <CardDescription>
          Selecciona una opción para continuar.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button asChild size="lg">
          <Link href="/auth/login">Iniciar Sesión</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/auth/register">Registrarme</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
