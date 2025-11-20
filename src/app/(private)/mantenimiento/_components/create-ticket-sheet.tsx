
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { PlusCircle } from "lucide-react";
import type { Ticket } from "@/lib/types";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";


const ticketSchema = z.object({
  title: z.string().min(5, { message: "El título debe tener al menos 5 caracteres." }),
  category: z.enum(["plumbing", "electrical", "common_area", "other"], { required_error: "Debes seleccionar una categoría."}),
  description: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres." }),
});

type TicketFormValues = z.infer<typeof ticketSchema>;


interface CreateTicketSheetProps {
  onTicketCreated: (newTicket: Omit<Ticket, 'id' | 'createdAt' | 'status' | 'unitId'>) => Promise<void>;
}

export function CreateTicketSheet({ onTicketCreated }: CreateTicketSheetProps) {
    const [open, setOpen] = React.useState(false);
    const { toast } = useToast();
    
    const form = useForm<TicketFormValues>({
        resolver: zodResolver(ticketSchema),
        defaultValues: {
            title: "",
            description: "",
            category: undefined,
        },
    });

    const { isSubmitting } = form.formState;

  const onSubmit = async (data: TicketFormValues) => {
    try {
        await onTicketCreated(data);
        toast({
            title: "Ticket Enviado",
            description: "Tu solicitud de mantenimiento ha sido creada con éxito.",
        });
        form.reset();
        setOpen(false);
    } catch(error) {
         toast({
            variant: "destructive",
            title: "Error al crear ticket",
            description: "No se pudo crear el ticket. Inténtalo de nuevo.",
        });
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isSubmitting) {
        setOpen(isOpen);
        if(!isOpen) {
            form.reset();
        }
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Ticket
        </Button>
      </SheetTrigger>
      <SheetContent>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
                <SheetHeader>
                    <SheetTitle>Crear Nuevo Ticket</SheetTitle>
                    <SheetDescription>
                    Describe el problema que estás experimentando. Sé lo más detallado posible.
                    </SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-4 flex-1 overflow-y-auto pr-2">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Título</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: Fuga de agua en la cocina" {...field} disabled={isSubmitting} />
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
                                <FormLabel>Categoría</FormLabel>
                                 <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona una categoría" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="plumbing">Plomería</SelectItem>
                                        <SelectItem value="electrical">Electricidad</SelectItem>
                                        <SelectItem value="common_area">Área Común</SelectItem>
                                        <SelectItem value="other">Otro</SelectItem>
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
                                    <Textarea placeholder="Describe detalladamente el problema, cuándo comenzó y su ubicación exacta..." {...field} disabled={isSubmitting} rows={5} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant="outline" disabled={isSubmitting}>Cancelar</Button>
                    </SheetClose>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Spinner size="sm" className="mr-2" />}
                        {isSubmitting ? "Creando..." : "Crear Ticket"}
                    </Button>
                </SheetFooter>
            </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
