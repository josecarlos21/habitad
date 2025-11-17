"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, type AuthChallenge } from "@/hooks/use-session";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { CheckCircle2, Loader2, PhoneCall } from "lucide-react";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  identifier: z
    .string()
    .min(6, "Ingresa un correo o teléfono válido.")
    .refine(
      (value) => /\S+@\S+\.\S+/.test(value) || /^[0-9+\s-]{8,}$/.test(value),
      "Debes ingresar un correo electrónico o número celular correcto."
    ),
});

const codeSchema = z.object({
  code: z.string().length(6, "El código tiene 6 dígitos."),
});

type LoginValues = z.infer<typeof loginSchema>;
type CodeValues = z.infer<typeof codeSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { initiateLogin, confirmLogin, session, clearChallenge } = useSession();
  const [challenge, setChallenge] = useState<AuthChallenge | null>(session.challenge);
  const [step, setStep] = useState<"form" | "otp" | "success">(session.challenge ? "otp" : "form");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: session.challenge?.identifier ?? session.user?.email ?? "",
    },
  });

  const codeForm = useForm<CodeValues>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: "" },
  });

  useEffect(() => {
    if (session.challenge) {
      setChallenge(session.challenge);
      setStep("otp");
    }
  }, [session.challenge]);

  useEffect(() => {
    if (session.status === "authenticated") {
      setStep("success");
      const timer = setTimeout(() => router.replace("/dashboard"), 800);
      return () => clearTimeout(timer);
    }
  }, [session.status, router]);

  const handleLogin = async (values: LoginValues) => {
    setFeedback(null);
    setIsSubmitting(true);
    try {
      const newChallenge = await initiateLogin(values.identifier.trim());
      setChallenge(newChallenge);
      setStep("otp");
      codeForm.reset();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "No pudimos iniciar tu acceso.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (values: CodeValues) => {
    if (!challenge) return;
    setFeedback(null);
    setIsVerifying(true);
    try {
      await confirmLogin(challenge.id, values.code);
      setStep("success");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Código inválido, intenta nuevamente.");
    } finally {
      setIsVerifying(false);
    }
  };

  const masked = useMemo(() => challenge?.maskedIdentifier ?? "", [challenge]);

  const handleResend = async () => {
    if (!challenge) return;
    try {
      const newChallenge = await initiateLogin(challenge.identifier);
      setChallenge(newChallenge);
      setFeedback("Reenviamos un nuevo código.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "No se pudo reenviar el código.");
    }
  };

  const handleChangeAccount = () => {
    clearChallenge();
    setChallenge(null);
    setStep("form");
    setFeedback(null);
  };

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden">
        <CardHeader className="text-center">
          <CardTitle>Accede a tu condominio</CardTitle>
          <CardDescription>
            {step === "form"
              ? "Te enviaremos un código único a tu correo o teléfono."
              : step === "otp"
                ? `Ingresa el código de 6 dígitos enviado a ${masked}.`
                : "¡Listo! Estamos preparando tu panel."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {feedback && (
            <Alert>
              <AlertTitle>Mensaje</AlertTitle>
              <AlertDescription>{feedback}</AlertDescription>
            </Alert>
          )}
          {step === "form" && (
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo o teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="residente@habitat.com" autoComplete="username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enviar código
                </Button>
              </form>
            </Form>
          )}

          {step === "otp" && challenge && (
            <div className="space-y-4">
              <Form {...codeForm}>
                <form onSubmit={codeForm.handleSubmit(handleVerify)} className="space-y-4">
                  <FormField
                    control={codeForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código de 6 dígitos</FormLabel>
                        <FormControl>
                          <Input
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            {...field}
                            onChange={(event) => {
                              const onlyDigits = event.target.value.replace(/\D/g, "");
                              field.onChange(onlyDigits);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isVerifying}>
                    {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Verificar código
                  </Button>
                </form>
              </Form>
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                <button type="button" onClick={handleResend} className="text-primary hover:underline">
                  Reenviar código
                </button>
                <button type="button" onClick={handleChangeAccount} className="hover:underline">
                  Usar otro correo
                </button>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center gap-3 py-6">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
              <p className="text-lg font-semibold">¡Bienvenido de nuevo!</p>
              <p className="text-sm text-muted-foreground">Cargando tu tablero personalizado…</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2 text-center text-sm text-muted-foreground">
          <Link href="/auth" className="hover:underline">
            Volver a opciones
          </Link>
          <div className="flex items-center justify-center gap-2">
            <PhoneCall className="h-4 w-4" />
            <a href="tel:+525555555555" className="text-primary hover:underline">
              ¿Necesitas ayuda? Llama a la administración
            </a>
          </div>
        </CardFooter>
      </Card>

      <div className="rounded-lg border px-4 py-3 text-sm text-muted-foreground">
        Código temporal válido por 5 minutos. Para demos utiliza <span className={cn("font-semibold text-foreground")}>123456</span>.
      </div>
    </div>
  );
}
