"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useSession, type RegistrationResult } from "@/hooks/use-session";
import { units } from "@/lib/mocks";
import { Loader2, Sparkles, UserCheck2 } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(3, "Ingresa tu nombre completo."),
  email: z.string().email("Ingresa un correo válido."),
  phone: z
    .string()
    .optional()
    .refine((value) => !value || value.replace(/\D/g, "").length >= 10, "Agrega un teléfono de contacto."),
  unitCode: z.string().min(2, "Selecciona tu unidad."),
  acceptTerms: z
    .boolean()
    .refine((val) => val, { message: "Debes aceptar el aviso de privacidad." }),
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { registerResident } = useSession();
  const [result, setResult] = useState<RegistrationResult | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      unitCode: "",
      acceptTerms: false,
    },
  });

  const handleSubmit = async (values: RegisterValues) => {
    setFeedback(null);
    setIsSubmitting(true);
    try {
      const response = await registerResident({
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        unitCode: values.unitCode,
      });
      setResult(response);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "No pudimos registrar tu solicitud.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Registra tu unidad</CardTitle>
          <CardDescription>
            Validaremos tus datos con la administración antes de darte acceso.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {feedback && (
            <Alert className="mb-4">
              <AlertTitle>Mensaje</AlertTitle>
              <AlertDescription>{feedback}</AlertDescription>
            </Alert>
          )}
          {!result ? (
            <Form {...form}>
              <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Nombre completo</Label>
                      <FormControl>
                        <Input placeholder="Alex Martínez" autoComplete="name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Correo electrónico</Label>
                      <FormControl>
                        <Input placeholder="tu@email.com" type="email" autoComplete="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Teléfono</Label>
                      <FormControl>
                        <Input placeholder="+52 55 0000 0000" type="tel" autoComplete="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unitCode"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Selecciona tu unidad</Label>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Ej: Torre A - 101" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {units.map((unit) => (
                            <SelectItem key={unit.id} value={`${unit.tower}-${unit.number}`}>
                              Torre {unit.tower} • Departamento {unit.number}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-3 rounded-lg border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-tight">
                        <Label className="text-sm font-medium">Acepto el aviso de privacidad.</Label>
                        <p className="text-xs text-muted-foreground">
                          Confirmo que la información es correcta y autorizo el uso de mis datos para gestión
                          condominial.
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enviar solicitud
                </Button>
              </form>
            </Form>
          ) : (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xl font-semibold">¡Recibimos tu solicitud!</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Número de seguimiento <span className="font-semibold">{result.requestId}</span>. Te
                  contactaremos en aprox. {result.estimatedResponseMinutes} minutos.
                </p>
              </div>
              <Badge variant="secondary" className="text-primary">
                En validación con administración
              </Badge>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2 text-center text-sm text-muted-foreground">
          <Link href="/auth" className="hover:underline">
            Volver a opciones
          </Link>
          <span>¿Ya tienes una cuenta? <Link href="/auth/login" className="text-primary hover:underline">Inicia sesión</Link></span>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>¿Qué sigue después?</CardTitle>
          <CardDescription>Conoce el flujo de activación.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Validación",
              description: "Confirmamos con la mesa directiva que perteneces a la unidad indicada.",
            },
            {
              title: "Activación",
              description: "Recibirás un correo con instrucciones para tu primer acceso.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <UserCheck2 className="h-4 w-4 text-primary" />
                {item.title}
              </div>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
