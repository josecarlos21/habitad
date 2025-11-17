import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { useSession } from "@/hooks/use-session";
import { BadgeCheck, LifeBuoy, MessageCircleMore } from "lucide-react";

const helpItems = [
  {
    label: "Soporte 24/7",
    value: "WhatsApp Administración",
    href: "https://wa.me/5215550000000",
    icon: MessageCircleMore,
  },
  {
    label: "Dudas sobre registro",
    value: "admin@habitat.com",
    href: "mailto:admin@habitat.com",
    icon: LifeBuoy,
  },
];

export default function AuthPage() {
  const { session } = useSession();

  return (
    <div className="space-y-6">
      {session.status === "pending" && (
        <Alert>
          <BadgeCheck className="h-4 w-4" />
          <AlertTitle>Registro en revisión</AlertTitle>
          <AlertDescription>
            {session.pendingMessage ??
              "Estamos validando tus datos con la administración. En cuanto esté listo te enviaremos un acceso."}
          </AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader className="text-center space-y-3">
          <CardTitle className="text-2xl">¿Cómo quieres continuar?</CardTitle>
          <CardDescription>
            Accede si ya tienes una cuenta o solicita registro para tu unidad.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button asChild size="lg">
            <Link href="/auth/login">Iniciar Sesión</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/register">Registrarme como residente</Link>
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-1 text-center text-sm text-muted-foreground">
          <p>¿Eres personal de seguridad o administrador?</p>
          <Link href="/auth/login" className="text-primary hover:underline">
            Usa tu acceso asignado
          </Link>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>¿Necesitas ayuda?</CardTitle>
          <CardDescription>Estamos disponibles para acompañarte en tu alta.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {helpItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-lg border p-4 transition hover:border-primary/50"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2 text-primary">
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="font-semibold">{item.value}</p>
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
