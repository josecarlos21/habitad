
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { CheckCircle, PlusCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createIncident } from "../_services/create-incident-service";

const incidentSchema = z.object({
  title: z.string().min(10, { message: "El título debe tener al menos 10 caracteres." }),
  category: z.string({ required_error: "Debes seleccionar una categoría." }),
  description: z.string().min(20, { message: "La descripción debe tener al menos 20 caracteres." }),
});

type IncidentFormValues = z.infer<typeof incidentSchema>;

export function CreateIncidentSheet() {
  const [open, setOpen] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      title: "",
      category: undefined,
      description: "",
    },
  });

  const { isSubmitting } = form.formState;

  const handleSubmit = async (data: IncidentFormValues) => {
    try {
      await createIncident(data);
      setIsSuccess(true);
      // No need to call onIncidentCreated prop anymore
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear el reporte. Inténtalo de nuevo.",
      });
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
        setTimeout(() => {
            form.reset();
            setIsSuccess(false);
        }, 300);
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Reporte
        </Button>
      </SheetTrigger>
      <SheetContent>
        {isSuccess ? (
             <div className="flex flex-col items-center justify-center h-full text-center p-4 animate-fade-in">
                <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold">¡Reporte Enviado!</h3>
                <p className="text-muted-foreground mt-2">
                    Tu reporte ha sido enviado. El equipo de mantenimiento lo revisará a la brevedad.
                </p>
                <Button className="mt-6 w-full" onClick={() => handleOpenChange(false)}>Cerrar</Button>
            </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full">
                <SheetHeader>
                    <SheetTitle>Nuevo Reporte de Mantenimiento</SheetTitle>
                    <SheetDescription>
                        Describe el problema que encontraste. Sé lo más detallado posible.
                    </SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-4 flex-1">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Título del Reporte</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: Foco quemado en pasillo" {...field} disabled={isSubmitting} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Área Afectada</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un área" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Áreas Comunes">Áreas Comunes</SelectItem>
                                        <SelectItem value="Amenidades">Amenidades</SelectItem>
                                        <SelectItem value="Accesos">Accesos</SelectItem>
                                        <SelectItem value="Plomería">Plomería</SelectItem>
                                        <SelectItem value="Electricidad">Electricidad</SelectItem>
                                        <SelectItem value="Otro">Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descripción Detallada</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Describe el problema, ubicación y cualquier otro detalle relevante..."
                                        rows={6}
                                        {...field}
                                        disabled={isSubmitting}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="button" variant="outline" disabled={isSubmitting}>Cancelar</Button>
                    </SheetClose>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Spinner size="sm" className="mr-2"/>}
                        {isSubmitting ? 'Enviando...' : 'Enviar Reporte'}
                    </Button>
                </SheetFooter>
            </form>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  );
}
